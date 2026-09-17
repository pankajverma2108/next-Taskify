import { HStack, Heading, Section, Text, VStack } from "@/components/neopop";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { getAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { CreateBoardButton } from "@/components/create-board-button";

export async function BoardList() {
  const { orgId } = await auth();
  if (!orgId) redirect("/select-org");
  const [boards, used, isPro] = await Promise.all([
    db.board.findMany({ where: { orgId }, orderBy: { updatedAt: "desc" }, include: { _count: { select: { lists: true } } } }),
    getAvailableCount(), checkSubscription(),
  ]);
  return <VStack gap={4}><HStack justify="between" wrap="wrap" gap={3}><Heading level={2}>Your projects</Heading><Text color="secondary">{isPro ? "Unlimited projects" : `${Math.max(0, MAX_FREE_BOARDS - used)} free projects remaining`}</Text></HStack><Section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {boards.map(board => <Link key={board.id} href={`/board/${board.id}`} className="rounded-lg border border-border overflow-hidden bg-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"><Image src={board.imageThumbUrl} alt="" width={600} height={280} className="w-full h-40 object-cover" /><VStack padding={5} gap={3}><HStack justify="between"><Heading level={3}>{board.title}</Heading><ArrowUpRight className="size-5 text-primary" /></HStack><Text color="secondary">{board._count.lists} lists / Open project</Text></VStack></Link>)}
    {!boards.length && <VStack gap={4} padding={6}><Heading level={3}>Your first project starts here.</Heading><Text color="secondary">Create a board, add a few lists, and get the ideas moving.</Text><CreateBoardButton /></VStack>}
  </Section></VStack>;
}
BoardList.Skeleton = function BoardListSkeleton() { return <Text role="status">Loading your projects...</Text>; };
