import { HStack, Text } from "@/components/neopop";
import { Orbit } from "lucide-react";
export function Brand() {
  return <HStack gap={2} align="center"><Orbit aria-hidden className="size-6 text-primary" /><Text weight="bold" size="xl">taskify</Text></HStack>;
}
