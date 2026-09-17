import "server-only";
import { Prisma } from "@prisma/client";
import { BoardData } from "./board-model";

export const boardSelect = {
  id: true, title: true,
  lists: { orderBy: [{ order: "asc" }, { id: "asc" }], select: {
    id: true, title: true, order: true,
    cards: { orderBy: [{ order: "asc" }, { id: "asc" }], select: { id: true, title: true, description: true, order: true, listId: true, updatedAt: true } },
  } },
} satisfies Prisma.BoardSelect;

type SelectedBoard = Prisma.BoardGetPayload<{ select: typeof boardSelect }>;
export function serializeBoard(board: SelectedBoard): BoardData {
  return { ...board, lists: board.lists.map(list => ({ ...list, cards: list.cards.map(card => ({ ...card, updatedAt: card.updatedAt.toISOString() })) })) };
}
