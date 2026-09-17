import { HStack, Heading, Section, Text, VStack } from "@/components/neopop";
import { Suspense } from "react";
import { BoardList } from "./_components/board-list";
import { CreateBoardButton } from "@/components/create-board-button";
export default function OrganizationPage() {
  return <VStack gap={8} className="w-full"><HStack justify="between" wrap="wrap" gap={4}><VStack gap={2}><Text type="supporting">YOUR WORKSPACE</Text><Heading level={1}>Good things start here.</Heading><Text color="secondary">Pick up where you left off. Or make room for something new.</Text></VStack><CreateBoardButton /></HStack><Section className="taskify-cover rounded-lg" padding={8}><VStack gap={2}><Heading level={2}>A little structure.<br />A lot of possibility.</Heading><Text>Bring your ideas together, one project at a time.</Text></VStack></Section><Suspense fallback={<BoardList.Skeleton />}><BoardList /></Suspense></VStack>;
}
