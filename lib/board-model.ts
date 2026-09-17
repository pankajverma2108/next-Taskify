export type BoardTask = { id: string; title: string; description: string | null; listId: string; order: number; updatedAt: string };
export type BoardLane = { id: string; title: string; order: number; cards: BoardTask[] };
export type BoardData = { id: string; title: string; lists: BoardLane[] };
export type BoardCommand =
  | { type: "move"; taskId: string; destinationId: string; beforeId: string | null }
  | { type: "move-list"; listId: string; beforeId: string | null }
  | { type: "create-task"; listId: string; title: string }
  | { type: "create-list"; title: string }
  | { type: "rename-list"; listId: string; title: string }
  | { type: "rename-board"; title: string }
  | { type: "edit-task"; taskId: string; title: string; description: string; updatedAt: string }
  | { type: "delete-task"; taskId: string; updatedAt: string };
export type BoardResult = { data: BoardData; error?: never } | { error: string; data?: never };

export function orderVersion(lists: BoardLane[]) {
  return JSON.stringify(lists.map(list => [list.id, list.cards.map(card => card.id)]));
}

export function moveInBoard(lists: BoardLane[], command: Extract<BoardCommand, {type: "move" | "move-list"}>): BoardLane[] {
  const next = lists.map(list => ({ ...list, cards: list.cards.map(card => ({ ...card })) }));
  if (command.type === "move-list") {
    const index = next.findIndex(list => list.id === command.listId);
    if (index < 0) throw new Error("This list no longer exists.");
    const [list] = next.splice(index, 1);
    const target = command.beforeId === null ? next.length : next.findIndex(item => item.id === command.beforeId);
    if (target < 0) throw new Error("The destination changed. Refresh the board.");
    next.splice(target, 0, list);
  } else {
    const source = next.find(list => list.cards.some(card => card.id === command.taskId));
    const destination = next.find(list => list.id === command.destinationId);
    if (!source || !destination) throw new Error("This task or destination no longer exists.");
    const index = source.cards.findIndex(card => card.id === command.taskId);
    const [card] = source.cards.splice(index, 1);
    const target = command.beforeId === null ? destination.cards.length : destination.cards.findIndex(item => item.id === command.beforeId);
    if (target < 0) throw new Error("The destination changed. Refresh the board.");
    destination.cards.splice(target, 0, { ...card, listId: destination.id });
  }
  return next.map((list, order) => ({ ...list, order, cards: list.cards.map((card, cardOrder) => ({ ...card, order: cardOrder })) }));
}
