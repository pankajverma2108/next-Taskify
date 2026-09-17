import { Brand } from "@/components/brand";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

const ClerkLayout = ({ children }: { children: React.ReactNode }) => (
  <Section className="taskify-auth-stage min-h-dvh w-full" padding={6}>
    <VStack gap={8} align="center" justify="center" minHeight="calc(100dvh - 48px)">
      <VStack gap={2} align="center">
        <Brand />
        <Text color="secondary">Your next move starts here.</Text>
      </VStack>
      {children}
    </VStack>
  </Section>
);

export default ClerkLayout;
