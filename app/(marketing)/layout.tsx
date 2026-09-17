import { AppShell } from "@/components/neopop";
import { Navbar } from "./_components/navbar";
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <AppShell height="auto" variant="surface" topNav={<Navbar />}>{children}</AppShell>;
}
