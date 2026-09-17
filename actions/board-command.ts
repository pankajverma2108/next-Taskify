"use server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { boardSelect, serializeBoard } from "@/lib/board-data";
import { BoardCommand, BoardResult, moveInBoard, orderVersion } from "@/lib/board-model";

const title = z.string().trim().min(1, "Enter a title.").max(200);
const id = z.string().min(1).max(200);
const commandSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("move"), taskId: id, destinationId: id, beforeId: id.nullable() }),
  z.object({ type: z.literal("move-list"), listId: id, beforeId: id.nullable() }),
  z.object({ type: z.literal("create-task"), listId: id, title }),
  z.object({ type: z.literal("create-list"), title }),
  z.object({ type: z.literal("rename-list"), listId: id, title }),
  z.object({ type: z.literal("rename-board"), title }),
  z.object({ type: z.literal("edit-task"), taskId: id, title, description: z.string().max(20000), updatedAt: z.string().datetime() }),
  z.object({ type: z.literal("delete-task"), taskId: id, updatedAt: z.string().datetime() }),
]);

class BoardConflict extends Error {}
export async function runBoardCommand(boardId: string, input: BoardCommand, expectedOrder: string): Promise<BoardResult> {
  const { userId, orgId, sessionClaims } = await auth();
  if (!userId || !orgId) return { error: "Sign in to your workspace to continue." };
  const parsed = commandSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const command = parsed.data;
  try {
    const data = await db.$transaction(async tx => {
      const record = await tx.board.findFirst({ where: { id: boardId, orgId }, select: boardSelect });
      if (!record) throw new BoardConflict("This board is unavailable.");
      const board = serializeBoard(record);
      if (orderVersion(board.lists) !== expectedOrder) throw new BoardConflict("The board changed while you were working. Refresh and try again.");
      let entityId = boardId;
      let entityTitle = board.title;
      let entityType: "CARD" | "LIST" | "BOARD" = "BOARD";
      if (command.type === "move" || command.type === "move-list") {
        const next = moveInBoard(board.lists, command);
        for (const list of next) {
          if (command.type === "move-list") await tx.list.update({ where: { id: list.id }, data: { order: list.order } });
          else for (const card of list.cards) {
            const before = board.lists.flatMap(item => item.cards).find(item => item.id === card.id)!;
            if (before.order !== card.order || before.listId !== card.listId) await tx.card.update({ where: { id: card.id }, data: { order: card.order, listId: card.listId } });
          }
        }
        entityType = command.type === "move" ? "CARD" : "LIST";
        entityId = command.type === "move" ? command.taskId : command.listId;
        entityTitle = command.type === "move" ? board.lists.flatMap(list => list.cards).find(card => card.id === command.taskId)!.title : board.lists.find(list => list.id === command.listId)!.title;
      } else if (command.type === "create-list") {
        const list = await tx.list.create({ data: { boardId, title: command.title, order: board.lists.length } });
        entityId = list.id; entityTitle = list.title; entityType = "LIST";
      } else if (command.type === "create-task") {
        const list = board.lists.find(item => item.id === command.listId);
        if (!list) throw new BoardConflict("This list is unavailable.");
        const card = await tx.card.create({ data: { listId: list.id, title: command.title, order: (list.cards.at(-1)?.order ?? -1) + 1 } });
        entityId = card.id; entityTitle = card.title; entityType = "CARD";
      } else if (command.type === "rename-list") {
        if (!board.lists.some(list => list.id === command.listId)) throw new BoardConflict("This list is unavailable.");
        await tx.list.update({ where: { id: command.listId }, data: { title: command.title } });
        entityId = command.listId; entityTitle = command.title; entityType = "LIST";
      } else if (command.type === "rename-board") {
        await tx.board.update({ where: { id: boardId }, data: { title: command.title } });
        entityTitle = command.title;
      } else {
        const card = board.lists.flatMap(list => list.cards).find(item => item.id === command.taskId);
        if (!card || card.updatedAt !== command.updatedAt) throw new BoardConflict("This task changed. Your draft is preserved; refresh before saving again.");
        if (command.type === "delete-task") await tx.card.delete({ where: { id: card.id } });
        else await tx.card.update({ where: { id: card.id }, data: { title: command.title, description: command.description } });
        entityId = card.id; entityTitle = command.type === "edit-task" ? command.title : card.title; entityType = "CARD";
      }
      await tx.auditLog.create({ data: {
        orgId, userId, userName: typeof sessionClaims?.name === "string" ? sessionClaims.name : "Team member",
        userImage: typeof sessionClaims?.picture === "string" ? sessionClaims.picture : "",
        action: command.type.startsWith("create") ? "CREATE" : command.type.startsWith("delete") ? "DELETE" : "UPDATE",
        entityType, entityId, entityTitle,
      } });
      return serializeBoard(await tx.board.findUniqueOrThrow({ where: { id: boardId }, select: boardSelect }));
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 15000 });
    revalidatePath(`/board/${boardId}`);
    revalidatePath(`/organization/${orgId}`);
    return { data };
  } catch (error) {
    if (error instanceof BoardConflict) return { error: error.message };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") return { error: "Another change arrived at the same time. Refresh and try again." };
    console.error("[board-command]", error instanceof Error ? error.name : "Unknown error");
    return { error: "Your change could not be saved. Check your connection and retry." };
  }
}

export async function refreshBoard(boardId: string): Promise<BoardResult> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return { error: "Sign in to continue." };
  try {
    const board = await db.board.findFirst({ where: { id: boardId, orgId }, select: boardSelect });
    return board ? { data: serializeBoard(board) } : { error: "This board is unavailable." };
  } catch { return { error: "Unable to refresh. Check your connection." }; }
}
