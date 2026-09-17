import { checkSubscription } from "@/lib/subscription";
import { Info } from "../_components/info";
import { SubscriptionButton } from "./_components/subscription-button";
import { Heading } from "@astryxdesign/core/Heading";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

const BillingPage = async () => {
    const isPro = await checkSubscription();

    return (
        <VStack gap={6} width="100%">
          <VStack gap={2}>
            <Text type="supporting">PLAN AND BILLING</Text>
            <Heading level={1}>Room to make more.</Heading>
            <Text color="secondary">Keep the essentials free, or unlock unlimited projects for the whole crew.</Text>
          </VStack>
          <Info isPro={isPro} />
          <Section variant="muted" padding={6} className="rounded-lg border border-border">
            <VStack gap={4} maxWidth={560}>
              <Heading level={2}>{isPro ? "You are in the flow." : "Ready for unlimited projects?"}</Heading>
              <Text color="secondary">{isPro ? "Manage payment details or your subscription from the secure billing portal." : "Pro removes the project limit so your team never has to ration a good idea."}</Text>
              <SubscriptionButton isPro={isPro} />
            </VStack>
          </Section>
        </VStack>
    );
};

export default BillingPage;
