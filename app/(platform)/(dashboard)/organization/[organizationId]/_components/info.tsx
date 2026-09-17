"use client";

import { Avatar, Badge, HStack, Skeleton, Text, VStack } from "@/components/neopop";
import { CreditCard } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

interface InfoProps {
  isPro: boolean;
};



export const Info = ({
  isPro,
}: InfoProps) => {
const { organization, isLoaded } = useOrganization();

    if (!isLoaded){
        return(
            <Info.Skeleton />
        );
    }

    return (
        <HStack gap={4} align="center">
          <Avatar src={organization?.imageUrl} name={organization?.name} size={60} shape="rounded" />
          <VStack gap={2}>
            <Text type="large" weight="semibold">{organization?.name}</Text>
            <Badge variant={isPro ? "success" : "neutral"} icon={<CreditCard className="size-3" />} label={isPro ? "Pro workspace" : "Free workspace"} />
          </VStack>
        </HStack>
    );
};

Info.Skeleton = function SkeletonInfo() {
    return (
      <HStack gap={4} align="center">
        <Skeleton width={60} height={60} radius={3} />
        <VStack gap={2}><Skeleton width={200} height={24} /><Skeleton width={100} height={20} /></VStack>
      </HStack>
    );
  };
