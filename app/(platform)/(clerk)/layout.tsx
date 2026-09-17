import { Section, Text, VStack } from "@/components/neopop";
import { Brand } from "@/components/brand";

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
