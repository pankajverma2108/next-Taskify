"use client";
import { useCallback } from "react";
import { BoardWorkspace } from "./board-workspace";
import { BoardCommand, BoardData } from "@/lib/board-model";
import { refreshBoard, runBoardCommand } from "@/actions/board-command";
import { BoardOptions } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/board-options";

export function ConnectedBoard({ initial, orgId }: { initial: BoardData; orgId: string }) {
  const mutate = useCallback((command: BoardCommand, version: string) => runBoardCommand(initial.id, command, version), [initial.id]);
  const refresh = useCallback(() => refreshBoard(initial.id), [initial.id]);
  return <BoardWorkspace initial={initial} orgId={orgId} mutate={mutate} refresh={refresh} options={<BoardOptions id={initial.id} />} />;
}
