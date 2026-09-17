"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Command, Layers3, MousePointer2, Orbit, Sparkles } from "lucide-react";
import { Button, Heading, HStack, Section, Text, Token, VStack } from "@/components/neopop";

const previewLanes = [
  { label: "Up next", count: "03", tone: "yellow", tasks: ["Shape the launch story", "Invite the early crew"] },
  { label: "In motion", count: "02", tone: "blue", tasks: ["Make the board feel alive", "Polish the happy path"] },
  { label: "Made it", count: "08", tone: "green", tasks: ["Choose a clear direction", "Protect the team's focus"] },
];

const promises = [
  { icon: Layers3, kicker: "SEE IT", title: "The whole idea, at one glance.", body: "A visual board for momentum and a focused list for the details. Same work. Better perspective." },
  { icon: MousePointer2, kicker: "MOVE IT", title: "Progress should feel physical.", body: "Pick up a task, move it forward, and let every interaction confirm that something changed." },
  { icon: Command, kicker: "MAKE IT", title: "Less ceremony. More making.", body: "Search, shape, and ship without turning your team's next move into another process to manage." },
];

export default function MarketingPage() {
  return <VStack gap={0}>
    <Section className="np-marketing-hero" padding={6}>
      <VStack gap={8} maxWidth={1320} className="mx-auto w-full">
        <HStack justify="between" wrap="wrap" gap={4}>
          <HStack gap={2}><Orbit className="size-4 text-primary" /><Text type="supporting" weight="semibold">A workspace for affirmative momentum</Text></HStack>
          <HStack gap={2}><span className="np-live-mark" /><Text type="supporting" color="secondary">Built for ideas already in motion</Text></HStack>
        </HStack>

        <div className="np-hero-grid">
          <VStack gap={6} className="np-hero-copy">
            <Heading level={1} type="display-1">Make work<br /><span>feel possible.</span></Heading>
            <HStack gap={3} wrap="wrap"><Token label="CLEAR" /><Token label="ALIVE" color="green" /><Token label="YOURS" color="pink" /></HStack>
          </VStack>
          <VStack gap={5} justify="end" className="np-hero-aside">
            <Text type="large">Taskify gives small teams a vivid place to turn a rough idea into a confident next move.</Text>
            <HStack gap={3} wrap="wrap"><Button label="Start making" size="lg" variant="primary" href="/sign-up" as={Link} icon={<ArrowUpRight className="size-5" />} /><Button label="Open the live board" size="lg" variant="ghost" href="/demo" as={Link} /></HStack>
            <HStack gap={2}><ArrowDown className="size-4" /><Text type="supporting" color="secondary">Scroll into the flow</Text></HStack>
          </VStack>
        </div>

        <div className="np-momentum-rail" aria-label="From idea to done">
          <span>Idea</span><span>Clarity</span><span>Motion</span><span>Made it</span>
        </div>
      </VStack>
    </Section>

    <Section className="np-board-showcase" padding={6}>
      <VStack gap={6} maxWidth={1320} className="mx-auto w-full">
        <HStack justify="between" align="end" wrap="wrap" gap={5}>
          <VStack gap={2}><Text type="supporting">THE WORK, WITH A PULSE</Text><Heading level={2}>A board that says yes,<br />then shows the way.</Heading></VStack>
          <VStack gap={2} maxWidth={430}><Text color="secondary">Every state has a job. Yellow invites the next move. Blue holds active work. Green makes progress visible.</Text><Button label="Try this board" href="/demo" as={Link} variant="ghost" icon={<ArrowUpRight className="size-4" />} /></VStack>
        </HStack>

        <div className="np-preview-board">
          {previewLanes.map((lane) => <section key={lane.label} className={`np-preview-lane np-preview-lane--${lane.tone}`}>
            <HStack justify="between"><Text type="supporting">{lane.label}</Text><span className="np-preview-count">{lane.count}</span></HStack>
            <VStack gap={3}>{lane.tasks.map((task, index) => <article key={task} className="np-preview-task"><Text weight="semibold">{task}</Text><HStack justify="between"><Text type="supporting" color="secondary">0{index + 1}</Text>{lane.tone === "green" ? <Check className="size-4" /> : <ArrowUpRight className="size-4" />}</HStack></article>)}</VStack>
            <Text type="supporting" color="secondary">+ ADD THE NEXT MOVE</Text>
          </section>)}
        </div>
      </VStack>
    </Section>

    <Section className="np-promise-section" padding={6}>
      <VStack gap={7} maxWidth={1320} className="mx-auto w-full">
        <HStack gap={2}><Sparkles className="size-5 text-primary" /><Text type="supporting">WHY IT FEELS DIFFERENT</Text></HStack>
        <div className="np-promise-grid">{promises.map(({ icon: Icon, kicker, title, body }) => <article key={title} className="np-promise"><Icon className="size-6" /><Text type="supporting">{kicker}</Text><Heading level={3}>{title}</Heading><Text color="secondary">{body}</Text></article>)}</div>
        <div className="np-final-call"><VStack gap={2}><Text type="supporting">YOUR NEXT CHAPTER</Text><Heading level={2}>Give the good idea<br />somewhere to go.</Heading></VStack><Button label="Create your workspace" size="lg" variant="primary" href="/sign-up" as={Link} icon={<ArrowUpRight className="size-5" />} /></div>
      </VStack>
    </Section>
  </VStack>;
}
