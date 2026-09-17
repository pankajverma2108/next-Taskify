import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { boardSelect, serializeBoard } from "@/lib/board-data";
import { ConnectedBoard } from "@/components/board/connected-board";
import { Text } from "@astryxdesign/core/Text";

export default async function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { orgId } = await auth();
  if (!orgId) notFound();
  const { boardId } = await params;
  const board = await db.board.findFirst({ where: { id: boardId, orgId }, select: boardSelect });
  if (!board) notFound();
  return <Suspense fallback={<Text>Opening your project...</Text>}><ConnectedBoard initial={serializeBoard(board)} orgId={orgId} /></Suspense>;
}
