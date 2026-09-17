"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Section } from "@astryxdesign/core/Section";
import { TextInput } from "@astryxdesign/core/TextInput";
import { TextArea } from "@astryxdesign/core/TextArea";
import { Dialog } from "@astryxdesign/core/Dialog";
import { Selector } from "@astryxdesign/core/Selector";
import { Token } from "@astryxdesign/core/Token";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { LayoutGrid, List, Search, Plus, X, GripVertical, AlignLeft, ArrowUpRight, RotateCcw, Check, Pencil, Trash2 } from "lucide-react";
import { BoardCommand, BoardData, BoardLane, BoardResult, BoardTask, moveInBoard, orderVersion } from "@/lib/board-model";
import { BoardRealtimeStatus, useBoardRealtime } from "@/hooks/use-board-realtime";

type Props = {
  initial: BoardData;
  demo?: boolean;
  mutate: (command: BoardCommand, version: string) => Promise<BoardResult>;
  orgId?: string;
  refresh?: () => Promise<BoardResult>;
  options?: React.ReactNode;
};

type Composer = { kind: "task"; listId: string } | { kind: "list" } | { kind: "rename-list"; listId: string; title: string } | { kind: "rename-board"; title: string };

const realtimeLabels: Record<BoardRealtimeStatus, { label: string; variant: "success" | "warning" | "neutral" }> = {
  connecting: { label: "Connecting live sync", variant: "warning" },
  live: { label: "Live sync", variant: "success" },
  offline: { label: "Live sync paused", variant: "warning" },
  unavailable: { label: "Live sync unavailable", variant: "neutral" },
};

function BoardRealtimeIndicator({ boardId, onInvalidate, orgId }: { boardId: string; onInvalidate: () => void | Promise<void>; orgId: string }) {
  const status = useBoardRealtime({ boardId, onInvalidate, orgId });
  const realtime = realtimeLabels[status];

  return <HStack gap={2}><StatusDot variant={realtime.variant} label={realtime.label} isPulsing={status === "connecting"} /><Text type="supporting" color="secondary">{realtime.label}</Text></HStack>;
}

export function BoardWorkspace({ initial, demo = false, mutate, orgId, refresh, options }: Props) {
  const params = useSearchParams();
  const view = params.get("view") === "list" ? "list" : "board";
  const search = params.get("q") ?? "";
  const selectedId = params.get("task");
  const [board, setBoard] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [composer, setComposer] = useState<Composer | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const confirmed = useRef(initial);
  const current = useRef(initial);
  const queue = useRef<BoardCommand[]>([]);
  const draining = useRef(false);
  const dragging = useRef(false);
  const task = board.lists.flatMap(list => list.cards).find(card => card.id === selectedId);
  const count = board.lists.reduce((total, list) => total + list.cards.length, 0);
  const query = search.trim().toLocaleLowerCase();
  const matching = (card: BoardTask) => !query || (card.title + " " + (card.description ?? "")).toLocaleLowerCase().includes(query);
  const visibleCount = board.lists.flatMap(list => list.cards).filter(matching).length;

  function updateUrl(values: Record<string, string | null>) {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", url);
  }

  const apply = useCallback((value: BoardData) => {
    current.current = value;
    setBoard(value);
  }, []);

  useEffect(() => {
    if (!draining.current && !dragging.current) { confirmed.current = initial; apply(initial); }
  }, [initial, apply]);

  const reload = useCallback(async () => {
    if (!refresh || draining.current || dragging.current) return;
    try {
      const result = await refresh();
      if (result.error) { setError(result.error); return; }
      if (result.data && !draining.current && !dragging.current) { confirmed.current = result.data; apply(result.data); setError(""); }
    } catch { setError("Connection lost. Your last loaded board is still here. Try refreshing."); }
  }, [refresh, apply]);

  useEffect(() => {
    if (!refresh) return;
    const focus = () => { void reload(); };
    window.addEventListener("focus", focus);
    window.addEventListener("online", focus);
    return () => { window.removeEventListener("focus", focus); window.removeEventListener("online", focus); };
  }, [refresh, reload]);

  async function submit(command: BoardCommand) {
    if (draining.current && command.type !== "move" && command.type !== "move-list") return false;
    setError("");
    if (command.type === "move" || command.type === "move-list") {
      try { apply({ ...current.current, lists: moveInBoard(current.current.lists, command) }); }
      catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to move this task."); return false; }
    }
    queue.current.push(command);
    if (draining.current) return true;
    draining.current = true;
    setBusy(true);
    let success = true;
    try {
      while (queue.current.length) {
        const pending = queue.current[0];
        const result = await mutate(pending, orderVersion(confirmed.current.lists));
        if (result.error || !result.data) throw new Error(result.error || "Unable to save.");
        confirmed.current = result.data;
        queue.current.shift();
        let optimistic = result.data;
        for (const remaining of queue.current) {
          if (remaining.type === "move" || remaining.type === "move-list") optimistic = { ...optimistic, lists: moveInBoard(optimistic.lists, remaining) };
        }
        apply(optimistic);
      }
    } catch (cause) {
      queue.current = [];
      apply(confirmed.current);
      setError(cause instanceof Error ? cause.message : "Your change could not be saved. Please retry.");
      success = false;
    } finally {
      draining.current = false;
      setBusy(false);
    }
    return success;
  }

  function onDragEnd({ source, destination, draggableId, type }: DropResult) {
    dragging.current = false;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;
    if (type === "list") {
      const remaining = current.current.lists.filter(list => list.id !== draggableId);
      void submit({ type: "move-list", listId: draggableId, beforeId: remaining[destination.index]?.id ?? null });
    } else {
      const lane = current.current.lists.find(list => list.id === destination.droppableId);
      const remaining = lane?.cards.filter(card => card.id !== draggableId) ?? [];
      void submit({ type: "move", taskId: draggableId, destinationId: destination.droppableId, beforeId: remaining[destination.index]?.id ?? null });
    }
  }

  function openComposer(value: Composer) {
    setNewTitle("title" in value ? value.title : "");
    setComposer(value);
  }

  async function create() {
    if (!composer || !newTitle.trim()) return;
    const title = newTitle.trim();
    const command: BoardCommand = composer.kind === "task" ? { type: "create-task", listId: composer.listId, title }
      : composer.kind === "list" ? { type: "create-list", title }
      : composer.kind === "rename-list" ? { type: "rename-list", listId: composer.listId, title }
      : { type: "rename-board", title };
    if (await submit(command)) { setComposer(null); setNewTitle(""); }
  }

  return <VStack gap={0} className="h-full min-w-0">
    <Section padding={6} className="w-full">
      <VStack gap={5}>
        <HStack justify="between" gap={4} align="start" wrap="wrap">
          <VStack gap={2}>
            <HStack gap={2}><Token label={demo ? "INTERACTIVE DEMO" : "TEAM PROJECT"} color="cyan" size="sm" /><Text color="secondary">{count} tasks</Text></HStack>
            <HStack gap={2}><Heading level={1}>{board.title}</Heading><IconButton label="Rename project" icon={<Pencil className="size-4" />} variant="ghost" onClick={() => openComposer({ kind: "rename-board", title: board.title })} /></HStack>
            <Text color="secondary">{demo ? "A fresh idea. A small crew. Let's make it happen." : "A clear picture of what is moving, and what comes next."}</Text>
          </VStack>
          <HStack gap={2}>{options}<Button label="Add task" variant="primary" icon={<Plus className="size-4" />} isDisabled={!board.lists.length || busy} onClick={() => openComposer({ kind: "task", listId: board.lists[0].id })} /></HStack>
        </HStack>
        <Section className="taskify-cover rounded-lg" padding={5}>
          <HStack justify="between" wrap="wrap" gap={3}><VStack gap={1}><Text weight="semibold">Make space for the next big thing.</Text><Text color="secondary">Small moves. Real momentum.</Text></VStack><ArrowUpRight className="size-8" aria-hidden /></HStack>
        </Section>
        <HStack justify="between" wrap="wrap" gap={3}>
          <HStack gap={1}><Button label="Board" icon={<LayoutGrid className="size-4" />} variant={view === "board" ? "secondary" : "ghost"} aria-pressed={view === "board"} onClick={() => updateUrl({ view: null })} /><Button label="List" icon={<List className="size-4" />} variant={view === "list" ? "secondary" : "ghost"} aria-pressed={view === "list"} onClick={() => updateUrl({ view: "list" })} /></HStack>
          <HStack gap={3} wrap="wrap"><TextInput label="Search tasks" isLabelHidden placeholder="Find a task..." startIcon={<Search className="size-4" />} value={search} onChange={value => updateUrl({ q: value || null })} hasClear width={240} />
            <Text type="supporting" role="status" aria-live="polite">{busy ? "Saving changes..." : demo ? "Demo / changes stay in this tab" : "Changes saved"}</Text>
            {!demo && orgId && refresh && <BoardRealtimeIndicator boardId={initial.id} orgId={orgId} onInvalidate={reload} />}
            {refresh && <IconButton label="Refresh board" icon={<RotateCcw className="size-4" />} onClick={() => void reload()} isDisabled={busy} variant="ghost" />}
          </HStack>
        </HStack>
        {error && <Section variant="muted" padding={3}><HStack justify="between" gap={3}><Text role="alert">{error}</Text>{refresh && <Button label="Refresh" onClick={() => void reload()} />}</HStack></Section>}
        {query && <Text color="secondary" role="status">{visibleCount} matching tasks. Clear search to reorder tasks.</Text>}
      </VStack>
    </Section>
    <Section className="w-full min-h-0 flex-1 overflow-auto px-6 pb-6 taskify-board-scroll">
      {view === "board" ? <DragDropContext onBeforeDragStart={() => { dragging.current = true; }} onDragEnd={onDragEnd}>
        <Droppable droppableId="board-lists" type="list" direction="horizontal" isDropDisabled={!!query}>
          {provided => <HStack as="ol" gap={4} align="start" height="100%" ref={provided.innerRef} {...provided.droppableProps}>
            {board.lists.map((lane, index) => <Draggable key={lane.id} draggableId={lane.id} index={index} isDragDisabled={!!query}>
              {listProvided => <VStack as="li" gap={3} width={304} className="shrink-0" ref={listProvided.innerRef} {...listProvided.draggableProps}>
                <HStack justify="between" gap={2}>
                  <HStack gap={2}><IconButton {...listProvided.dragHandleProps} label={`Move ${lane.title} list`} icon={<GripVertical className="size-4" />} variant="ghost" /><Text weight="semibold">{lane.title}</Text><Text color="secondary">{lane.cards.filter(matching).length}</Text></HStack>
                  <HStack gap={0}><IconButton label={`Rename ${lane.title}`} icon={<Pencil className="size-4" />} variant="ghost" onClick={() => openComposer({ kind: "rename-list", listId: lane.id, title: lane.title })} /><IconButton label={`Add task to ${lane.title}`} icon={<Plus className="size-4" />} variant="ghost" isDisabled={busy} onClick={() => openComposer({ kind: "task", listId: lane.id })} /></HStack>
                </HStack>
                <Droppable droppableId={lane.id} type="card" isDropDisabled={!!query}>
                  {(cardsProvided, snapshot) => <VStack as="ol" gap={3} padding={2} minHeight={100} width="100%" ref={cardsProvided.innerRef} {...cardsProvided.droppableProps} className={`rounded-lg border ${snapshot.isDraggingOver ? "border-primary bg-accent" : "border-transparent"}`}>
                    {lane.cards.filter(matching).map((card, cardIndex) => <Draggable key={card.id} draggableId={card.id} index={cardIndex} isDragDisabled={!!query}>
                      {(cardProvided, cardSnapshot) => <VStack as="li" gap={3} padding={4} ref={cardProvided.innerRef} {...cardProvided.draggableProps} className={`w-full rounded-lg border bg-card ${cardSnapshot.isDragging ? "taskify-dragging" : "border-border"}`}>
                        <Button label={card.title} variant="ghost" className="w-full whitespace-normal text-left justify-start h-auto" onClick={() => updateUrl({ task: card.id })} />
                        {card.description && <Text color="secondary" maxLines={2}>{card.description}</Text>}
                        <HStack justify="between" gap={2}>
                          <HStack gap={1} align="center">
                            <IconButton {...cardProvided.dragHandleProps} label={`Move ${card.title}`} icon={<GripVertical className="size-4" />} variant="ghost" />
                            <Text type="supporting">{card.description ? <AlignLeft className="size-4" aria-label="Has description" /> : "Ready for the next move"}</Text>
                          </HStack>
                          <IconButton label={`Open ${card.title}`} icon={<ArrowUpRight className="size-4" />} variant="ghost" onClick={() => updateUrl({ task: card.id })} />
                        </HStack>
                      </VStack>}
                    </Draggable>)}
                    {cardsProvided.placeholder}
                    {!lane.cards.length && <Text color="secondary" className="py-5 text-center">Drop a task here.<br />Or start something new.</Text>}
                  </VStack>}
                </Droppable>
                <Button label="Add task" variant="ghost" icon={<Plus className="size-4" />} isDisabled={busy} onClick={() => openComposer({ kind: "task", listId: lane.id })} />
              </VStack>}
            </Draggable>)}
            {provided.placeholder}
            <Button label="Add list" variant="ghost" className="shrink-0" icon={<Plus className="size-4" />} isDisabled={busy} onClick={() => openComposer({ kind: "list" })} />
          </HStack>}
        </Droppable>
      </DragDropContext> : <VStack gap={6}>
        {board.lists.map(lane => <VStack key={lane.id} gap={3}>
          <HStack justify="between"><Heading level={3}>{lane.title}</Heading><Button label="Add task" size="sm" variant="ghost" icon={<Plus className="size-4" />} isDisabled={busy} onClick={() => openComposer({ kind: "task", listId: lane.id })} /></HStack>
          {lane.cards.filter(matching).map(card => <Section key={card.id} padding={3} dividers={["bottom"]}><HStack justify="between" gap={4}><Button label={card.title} variant="ghost" className="whitespace-normal text-left" onClick={() => updateUrl({ task: card.id })} /><Text color="secondary" className="hidden md:block">{card.description ? "Has description" : "No description"}</Text><IconButton label={`Open ${card.title}`} icon={<ArrowUpRight className="size-4" />} variant="ghost" onClick={() => updateUrl({ task: card.id })} /></HStack></Section>)}
          {!lane.cards.filter(matching).length && <Text color="secondary">{query ? "No matching tasks." : "Nothing here yet. Add your first task."}</Text>}
        </VStack>)}
        <Button label="Add list" icon={<Plus className="size-4" />} onClick={() => openComposer({ kind: "list" })} />
      </VStack>}
    </Section>
    <Dialog isOpen={!!composer} onOpenChange={open => { if (!open) setComposer(null); }} aria-label="Project editor" purpose="form" width={440} padding={6}>
      <VStack gap={4}><HStack justify="between"><Heading level={2}>{composer?.kind === "task" ? "A new next step" : composer?.kind === "list" ? "Add a list" : "Give it a name"}</Heading><IconButton label="Close editor" icon={<X className="size-4" />} onClick={() => setComposer(null)} variant="ghost" /></HStack><TextInput label="Title" value={newTitle} onChange={setNewTitle} hasAutoFocus onEnter={() => { if (!busy) void create(); }} /><Button label={busy ? "Saving..." : "Save"} variant="primary" isLoading={busy} isDisabled={!newTitle.trim()} onClick={() => void create()} />{error && <Text role="alert">{error}</Text>}</VStack>
    </Dialog>
    {task && <TaskEditor key={task.id} task={task} lists={board.lists} busy={busy} error={error} onClose={() => updateUrl({ task: null })} onSave={submit} />}
    {selectedId && !task && <Dialog isOpen onOpenChange={() => updateUrl({ task: null })} aria-label="Task unavailable" padding={6}><VStack gap={4}><Heading level={2}>This task is unavailable</Heading><Text>It may have been removed or moved since you opened this link.</Text><Button label="Back to board" onClick={() => updateUrl({ task: null })} /></VStack></Dialog>}
  </VStack>;
}

function TaskEditor({ task, lists, busy, error, onClose, onSave }: { task: BoardTask; lists: BoardLane[]; busy: boolean; error: string; onClose: () => void; onSave: (command: BoardCommand) => Promise<boolean> }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [version, setVersion] = useState(task.updatedAt);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const changedElsewhere = task.updatedAt !== version;
  const dirty = title !== task.title || description !== (task.description ?? "");
  const [confirmClose, setConfirmClose] = useState(false);
  const close = () => { if (dirty) setConfirmClose(true); else onClose(); };
  async function save() {
    if (await onSave({ type: "edit-task", taskId: task.id, title: title.trim(), description, updatedAt: version })) onClose();
  }
  return <Dialog isOpen onOpenChange={close} purpose="form" width={560} maxHeight="94dvh" position={{ end: "var(--spacing-3)", top: "var(--spacing-3)" }} aria-label="Task details" padding={6}>
    <VStack gap={5}>
      <HStack justify="between"><Token label="TASK DETAILS" color="cyan" /><IconButton label="Close task" icon={<X className="size-4" />} variant="ghost" onClick={close} /></HStack>
      <TextInput label="Task title" value={title} onChange={setTitle} hasAutoFocus />
      <Selector label="In list" value={task.listId} options={lists.map(list => ({ value: list.id, label: list.title }))} isDisabled={busy} onChange={destinationId => { void onSave({ type: "move", taskId: task.id, destinationId, beforeId: null }); }} />
      <TextArea label="Description" value={description} onChange={setDescription} placeholder="What does a good outcome look like?" rows={6} />
      {changedElsewhere && <VStack gap={2}><Text role="status">This task has a newer version. Your draft is still here.</Text><Button label="Load latest version" onClick={() => { setTitle(task.title); setDescription(task.description ?? ""); setVersion(task.updatedAt); }} /></VStack>}
      {error && <Text role="alert">{error}</Text>}
      <HStack justify="between" gap={3}><Button label="Delete task" variant="ghost" icon={<Trash2 className="size-4" />} onClick={() => setConfirmDelete(true)} isDisabled={busy} /><Button label="Save changes" variant="primary" icon={<Check className="size-4" />} isLoading={busy} isDisabled={!title.trim() || changedElsewhere} onClick={() => void save()} /></HStack>
      {confirmDelete && <Section variant="muted" padding={4}><VStack gap={3}><Text>Delete this task permanently?</Text><HStack gap={2}><Button label="Keep task" onClick={() => setConfirmDelete(false)} /><Button label="Delete permanently" variant="destructive" isLoading={busy} onClick={async () => { if (await onSave({ type: "delete-task", taskId: task.id, updatedAt: version })) onClose(); }} /></HStack></VStack></Section>}
      {confirmClose && <Section variant="muted" padding={4}><VStack gap={3}><Text>Leave without saving your draft?</Text><HStack gap={2}><Button label="Keep editing" onClick={() => setConfirmClose(false)} /><Button label="Discard draft" variant="destructive" onClick={onClose} /></HStack></VStack></Section>}
    </VStack>
  </Dialog>;
}
