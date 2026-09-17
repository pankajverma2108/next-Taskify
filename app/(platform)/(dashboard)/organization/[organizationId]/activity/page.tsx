import { Suspense } from "react";

import { ActivityList } from "./_components/activity-list";
import { Info } from "../_components/info";
import { checkSubscription } from "@/lib/subscription";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

const ActivityPage = async () => {
    const isPro = await checkSubscription();

    return (
        <VStack gap={6} width="100%">
            <VStack gap={2}>
              <Text type="supporting">ACTIVITY PULSE</Text>
              <Heading level={1}>See the momentum.</Heading>
              <Text color="secondary">A clear trail of what your team created, moved, and finished.</Text>
            </VStack>
            <Info isPro={isPro} />
            <Suspense fallback={<ActivityList.Skeleton />}>
              <ActivityList />
            </Suspense>
        </VStack>
    );
};

export default ActivityPage;
