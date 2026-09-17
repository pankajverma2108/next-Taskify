import { BoardData } from "./board-model";
const lanes = [
  { title: "Ideas", tasks: [
    ["Make the first impression count", "Explore a new visual language for our next chapter. Strong type, a little space, and something unexpected."],
    ["Collect things that inspire us", "Build a shared reference library. Think music sleeves, architecture, and the small details we keep coming back to."],
    ["What should we build next?", "Bring one idea to the next studio catch-up. A rough sketch is more than enough."],
  ] },
  { title: "In motion", tasks: [
    ["A homepage with a point of view", "Turn the direction into something you can feel. Start with the story, then find the composition."],
    ["Make the tiny interactions feel right", "Test pickup, placement, keyboard controls, and the moment a task lands exactly where you wanted."],
    ["Write like a human", "Clear labels. Useful empty states. A little personality where it belongs."],
  ] },
  { title: "In review", tasks: [
    ["Take it for a spin on mobile", "Check the smallest screen. Open a task. Move it. Make sure nothing gets in the way."],
    ["Give the details a second look", "Review spacing, contrast, focus rings, and the states nobody remembers until they break."],
  ] },
  { title: "Made it", tasks: [
    ["Find our north star", "A place where a small team can see what matters and move great work forward."],
    ["Make room for the team", "Set up the studio board and agree on how we work together."],
  ] },
];
export const demoBoard: BoardData = {
  id: "demo", title: "The next chapter",
  lists: lanes.map((lane, index) => ({
    id: `demo-list-${index}`, title: lane.title, order: index,
    cards: lane.tasks.map(([title, description], order) => ({
      id: `demo-task-${index}-${order}`, title, description, listId: `demo-list-${index}`, order, updatedAt: "2026-09-17T00:00:00.000Z",
    })),
  })),
};
