"use client";
import Link from "next/link";
import { TopNav } from "@astryxdesign/core/TopNav";
import { HStack } from "@astryxdesign/core/HStack";
import { Button } from "@astryxdesign/core/Button";
import { Brand } from "@/components/brand";
export function Navbar() {
  return <TopNav heading={<Link href="/" aria-label="Taskify home"><Brand /></Link>} endContent={<HStack gap={2}><Button label="Explore the board" variant="ghost" href="/demo" as={Link} className="hidden sm:inline-flex" /><Button label="Sign in" href="/sign-in" as={Link} /><Button label="Start creating" variant="primary" href="/sign-up" as={Link} /></HStack>} />;
}
