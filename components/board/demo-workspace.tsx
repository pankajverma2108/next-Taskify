"use client";
import { useCallback, useRef } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { BoardWorkspace } from "./board-workspace";
import { demoBoard } from "@/lib/demo-board";
import { BoardCommand, BoardResult, moveInBoard } from "@/lib/board-model";

export function DemoWorkspace() {
  const data = useRef(structuredClone(demoBoard));
  const mutate = useCallback(async (command: BoardCommand): Promise<BoardResult> => {
    const board = structuredClone(data.current);
    const timestamp = new Date().toISOString();
    if (command.type === "move" || command.type === "move-list") board.lists = moveInBoard(board.lists, command);
    else if (command.type === "create-list") board.lists.push({ id: crypto.randomUUID(), title: command.title, order: board.lists.length, cards: [] });
    else if (command.type === "rename-board") board.title = command.title;
    else if (command.type === "rename-list") {
      const list = board.lists.find(item => item.id === command.listId);
      if (list) list.title = command.title;
    } else if (command.type === "create-task") {
      const list = board.lists.find(item => item.id === command.listId);
      if (list) list.cards.push({ id: crypto.randomUUID(), title: command.title, description: null, listId: list.id, order: list.cards.length, updatedAt: timestamp });
    } else {
      for (const list of board.lists) {
        const task = list.cards.find(card => card.id === command.taskId);
        if (!task) continue;
        if (command.type === "delete-task") list.cards = list.cards.filter(card => card.id !== task.id);
        else Object.assign(task, { title: command.title, description: command.description, updatedAt: timestamp });
      }
    }
    data.current = board;
    return { data: board };
  }, []);
  return <WorkspaceShell demo orgName="Your creative studio"><BoardWorkspace initial={demoBoard} demo mutate={mutate} /></WorkspaceShell>;
}
