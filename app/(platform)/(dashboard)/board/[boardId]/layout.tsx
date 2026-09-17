import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
export async function generateMetadata({ params }: { params: Promise<{ boardId: string }> }) {
  const { orgId } = await auth();
  if (!orgId) return { title: "Project" };
  const { boardId } = await params;
  const board = await db.board.findFirst({ where: { id: boardId, orgId }, select: { title: true } });
  return { title: board?.title ?? "Project" };
}
export default function BoardLayout({ children }: { children: React.ReactNode }) { return children; }
