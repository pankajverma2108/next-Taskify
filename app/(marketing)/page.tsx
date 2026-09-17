"use client";
import Link from "next/link";
import { Section } from "@astryxdesign/core/Section";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Token } from "@astryxdesign/core/Token";
import { ArrowUpRight, MoveRight, Orbit, Layers3, MousePointer2, Command } from "lucide-react";

export default function MarketingPage() {
  return <VStack gap={0}>
    <Section padding={6} className="w-full">
      <VStack gap={6} paddingBlock={10} maxWidth={1200} className="mx-auto">
        <HStack gap={2}><Orbit className="size-4 text-primary" /><Text type="supporting" weight="semibold">A SPACE FOR IDEAS IN MOTION</Text></HStack>
        <HStack gap={10} align="end" wrap="wrap" justify="between">
          <VStack gap={3} maxWidth={760}><Heading level={1} type="display-1">Big ideas.<br />Clear next moves.</Heading><Text type="large" color="secondary">Give your team a place to make things happen.<br />Plan it. Move it. Make it yours.</Text></VStack>
          <VStack gap={3}><Button label="Build your workspace" size="lg" variant="primary" href="/sign-up" as={Link} icon={<ArrowUpRight className="size-5" />} /><Button label="Try the interactive board" variant="ghost" href="/demo" as={Link} /></VStack>
        </HStack>
        <Section className="taskify-cover rounded-lg overflow-hidden" padding={6}>
          <VStack gap={6} paddingBlock={10}><HStack justify="between" wrap="wrap" gap={3}><Token label="YOUR NEXT CHAPTER" color="cyan" /><Text weight="semibold">Your ideas deserve a little room.</Text></HStack>
            <HStack gap={4} wrap="wrap" align="start">
              {[
                ["Up next", "The idea that won't leave you alone", "Make the first move", "blue"],
                ["In motion", "Something worth making", "Find your flow", "cyan"],
                ["Made it", "That thing you said you'd do", "Keep the momentum", "green"],
              ].map(([lane, title, caption, color]) => <Section key={lane} padding={5} className="bg-surface rounded-lg flex-1 min-w-48"><VStack gap={5}><Text color="secondary">{lane}</Text><Heading level={3}>{title}</Heading><Text color="secondary">{caption}</Text><MoveRight className="size-5 text-primary" /></VStack></Section>)}
            </HStack>
            <Button label="Take it for a spin" href="/demo" as={Link} icon={<ArrowUpRight className="size-4" />} />
          </VStack>
        </Section>
        <HStack gap={8} wrap="wrap" align="start">
          {[{ icon: Layers3, title: "Your work, in perspective.", body: "Switch between a visual board and a focused list. Keep the context. Lose the clutter." }, { icon: MousePointer2, title: "Move at the speed of thought.", body: "Pick up a task and put it where it belongs. Keyboard controls included." }, { icon: Command, title: "Clear on what comes next.", body: "Search your board, open a task, and turn a rough idea into a clear next step." }].map(({ icon: Icon, title, body }) => <VStack key={title} gap={3} className="flex-1 min-w-56"><Icon className="size-6 text-primary" /><Heading level={3}>{title}</Heading><Text color="secondary">{body}</Text></VStack>)}
        </HStack>
      </VStack>
    </Section>
    <Section padding={6} dividers={["top"]} className="w-full"><HStack justify="between" wrap="wrap" gap={3}><Text weight="semibold">taskify</Text><Text color="secondary">Good work starts with a little clarity.</Text><Button href="/sign-up" as={Link} label="Let's make something" variant="ghost" /></HStack></Section>
  </VStack>;
}
