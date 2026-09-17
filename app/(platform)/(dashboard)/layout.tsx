import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { HStack } from "@astryxdesign/core/HStack";
import { db } from "@/lib/db";
import { WorkspaceShell } from "@/components/workspace-shell";
import { CreateBoardButton } from "@/components/create-board-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/select-org");
  const [boards, organization] = await Promise.all([
    db.board.findMany({ where: { orgId }, select: { id: true, title: true }, orderBy: { updatedAt: "desc" } }),
    (await clerkClient()).organizations.getOrganization({ organizationId: orgId }),
  ]);
  return <WorkspaceShell orgId={orgId} orgName={organization.name} boards={boards}
    create={<CreateBoardButton />}
    account={<HStack gap={3}><OrganizationSwitcher hidePersonal afterSelectOrganizationUrl="/organization/:id" afterCreateOrganizationUrl="/organization/:id" /><UserButton /></HStack>}>
    {children}
  </WorkspaceShell>;
}
