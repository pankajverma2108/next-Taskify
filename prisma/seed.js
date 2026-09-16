const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleOrgId = "sample-org";
const sampleUserId = "sample-user";
const sampleImage = {
  imageId: "sample-board-image",
  imageThumbUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400",
  imageFullUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600",
  imageUserName: "Unsplash",
  imageLinkHTML: "https://unsplash.com/",
};

async function main() {
  const board = await prisma.board.upsert({
    where: { id: "sample-board" },
    update: { title: "Product launch", ...sampleImage },
    create: {
      id: "sample-board",
      orgId: sampleOrgId,
      title: "Product launch",
      ...sampleImage,
    },
  });

  const lists = [
    { id: "sample-list-backlog", title: "Backlog", order: 1 },
    { id: "sample-list-progress", title: "In progress", order: 2 },
    { id: "sample-list-done", title: "Done", order: 3 },
  ];

  for (const list of lists) {
    await prisma.list.upsert({
      where: { id: list.id },
      update: { title: list.title, order: list.order, boardId: board.id },
      create: { ...list, boardId: board.id },
    });
  }

  const cards = [
    {
      id: "sample-card-requirements",
      listId: "sample-list-backlog",
      title: "Finalize launch requirements",
      description: "Confirm scope, owners, and acceptance criteria.",
      order: 1,
    },
    {
      id: "sample-card-design",
      listId: "sample-list-progress",
      title: "Review dashboard design",
      description: "Collect feedback from the product and support teams.",
      order: 1,
    },
    {
      id: "sample-card-release",
      listId: "sample-list-done",
      title: "Create release checklist",
      description: "The checklist is ready for the launch meeting.",
      order: 1,
    },
  ];

  for (const card of cards) {
    await prisma.card.upsert({
      where: { id: card.id },
      update: card,
      create: card,
    });
  }

  await prisma.orgLimit.upsert({
    where: { orgId: sampleOrgId },
    update: { count: 1 },
    create: { orgId: sampleOrgId, count: 1 },
  });

  await prisma.auditLog.upsert({
    where: { id: "sample-audit-board" },
    update: { entityTitle: board.title },
    create: {
      id: "sample-audit-board",
      orgId: sampleOrgId,
      action: "CREATE",
      entityId: board.id,
      entityType: "BOARD",
      entityTitle: board.title,
      userId: sampleUserId,
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96",
      userName: "Sample User",
    },
  });

  console.log("Seeded sample board data for organization sample-org");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });