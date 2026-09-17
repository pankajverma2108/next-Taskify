import { Avatar, HStack, Text, VStack } from "@/components/neopop";
import { format } from "date-fns";
import { AuditLog } from "@prisma/client"

import { generateLogMessage } from "@/lib/generate-log-message";

interface ActivityItemProps {
    data: AuditLog;
};

export const ActivityItem = ({
    data,
}: ActivityItemProps) => {
    return (
        <li className="list-none rounded-lg border border-border bg-card p-4">
          <HStack gap={3} align="center">
            <Avatar size={32} src={data.userImage} name={data.userName} />
            <VStack gap={1}>
              <Text><Text as="span" weight="semibold">{data.userName}</Text> {generateLogMessage(data)}</Text>
              <Text type="supporting" color="secondary">{format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}</Text>
            </VStack>
          </HStack>
        </li>
    );
};
