import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

export const ActivityList = async () => {
    const { orgId } = await auth();
  
    if (!orgId) {
      redirect("/select-org");
    }

    const auditLogs = await db.auditLog.findMany({
        where: {
          orgId,
        },
        orderBy: {
            createdAt: "desc"
        }
      });

      if (!auditLogs.length) return <Text color="secondary">No activity yet. Create a project or move a task to start the story.</Text>;

      return <ol className="space-y-3">{auditLogs.map((log) => <ActivityItem key={log.id} data={log} />)}</ol>;
};

ActivityList.Skeleton = function ActivityListSkeleton() {
    return (
      <VStack gap={3}>{[0, 1, 2, 3].map(index => <Skeleton key={index} width="100%" height={72} index={index} />)}</VStack>
    );
};
