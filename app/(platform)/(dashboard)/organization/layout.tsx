import { Section } from "@/components/neopop";
export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return <Section padding={6} className="min-w-0 w-full">{children}</Section>;
}
