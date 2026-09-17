import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Orbit } from "lucide-react";
export function Brand() {
  return <HStack gap={2} align="center"><Orbit aria-hidden className="size-6 text-primary" /><Text weight="bold" size="xl">taskify</Text></HStack>;
}
