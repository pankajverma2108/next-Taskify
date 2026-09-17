import { Suspense } from "react";
import { DemoWorkspace } from "@/components/board/demo-workspace";
export const metadata = { title: "Explore the studio", robots: { index: false, follow: false } };
export default function DemoPage() {
  return <Suspense fallback={<p>Opening the studio...</p>}><DemoWorkspace /></Suspense>;
}
