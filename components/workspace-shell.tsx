"use client";

import { AppShell, Button, HStack, SideNav, SideNavHeading, SideNavItem, SideNavSection, Text, TopNav, VStack } from "@/components/neopop";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Orbit, PanelsTopLeft, Activity, Settings2, CreditCard, ArrowUpRight, Sparkles } from "lucide-react";

type Props = { children: React.ReactNode; orgId?: string; orgName?: string; boards?: { id: string; title: string }[]; account?: React.ReactNode; create?: React.ReactNode; demo?: boolean };

export function WorkspaceShell({ children, orgId, orgName = "Your workspace", boards = [], account, create, demo = false }: Props) {
  const pathname = usePathname();
  const home = demo ? "/demo" : `/organization/${orgId}`;
  const isBoard = demo || pathname.startsWith("/board/");
  return <AppShell variant="surface" height="fill" mobileNav={{ breakpoint: "md" }}
    className={isBoard ? "taskify-board-shell" : undefined}
    sideNav={<SideNav className="border-r border-border" header={<SideNavHeading heading="taskify" subheading="MAKE ROOM FOR GREAT WORK" headingHref={home} as={Link} icon={<Orbit className="size-7 text-primary" />} />}
      topContent={<VStack gap={3} padding={4}><Text type="supporting" weight="semibold">{orgName}</Text>{create}</VStack>}
      footer={<VStack gap={2} padding={4}><Sparkles className="size-5 text-primary" /><Text weight="semibold">Less noise. More flow.</Text><Text color="secondary">A little space for your next big thing.</Text>{demo && <Button label="Create your workspace" href="/sign-up" as={Link} icon={<ArrowUpRight className="size-4" />} />}</VStack>}>
      <SideNavSection title="Workspace">
        <SideNavItem label={demo ? "Studio board" : "Projects"} href={home} as={Link} icon={<PanelsTopLeft className="size-4" />} isSelected={pathname === home} />
        {!demo && <><SideNavItem label="Activity" href={home + "/activity"} as={Link} icon={<Activity className="size-4" />} isSelected={pathname.endsWith("/activity")} /><SideNavItem label="Settings" href={home + "/settings"} as={Link} icon={<Settings2 className="size-4" />} isSelected={pathname.endsWith("/settings")} /><SideNavItem label="Billing" href={home + "/billing"} as={Link} icon={<CreditCard className="size-4" />} isSelected={pathname.endsWith("/billing")} /></>}
      </SideNavSection>
      {boards.length > 0 && <SideNavSection title="Your projects">{boards.map(board => <SideNavItem key={board.id} label={board.title} href={`/board/${board.id}`} as={Link} isSelected={pathname === `/board/${board.id}`} />)}</SideNavSection>}
    </SideNav>}
    topNav={<TopNav label="Workspace" startContent={<HStack gap={2}><Text color="secondary">{orgName}</Text><Text color="secondary">/</Text><Text>{demo ? "Product studio" : "Projects"}</Text></HStack>} endContent={account ?? <Button label="Sign in" href="/sign-in" as={Link} variant="ghost" />} />}>
    {children}
  </AppShell>;
}
