import { OrganizationProfile } from "@clerk/nextjs";
import { Heading } from "@astryxdesign/core/Heading";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

const SettingsPage = () => {
    return (
      <VStack gap={6} width="100%">
        <VStack gap={2}>
          <Text type="supporting">WORKSPACE SETTINGS</Text>
          <Heading level={1}>Shape your space.</Heading>
          <Text color="secondary">Manage the people, roles, and details behind this workspace.</Text>
        </VStack>
        <Section className="overflow-hidden rounded-lg border border-border bg-surface" padding={0}>
            <OrganizationProfile
            appearance={{
                elements: {
                    rootBox: {
                        boxShadow: "none",
                        width: "100%"
                    },
                 card: {
                    border: "0",
                    boxShadow: "none",
                    width: "100%"
                 }
                }
            }}
            />
        </Section>
      </VStack>
    );
};

export default SettingsPage;
