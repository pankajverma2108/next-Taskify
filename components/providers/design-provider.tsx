"use client";

import { Theme } from "@astryxdesign/core/theme";
import { taskifyNocturneTheme } from "@/theme/taskify-nocturne";

export function DesignProvider({ children }: { children: React.ReactNode }) {
  return <Theme theme={taskifyNocturneTheme} mode="dark">{children}</Theme>;
}
