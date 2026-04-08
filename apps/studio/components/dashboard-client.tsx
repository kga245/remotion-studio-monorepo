"use client";

import { DashboardShell } from "@/components/studio/dashboard-shell";
export type { ProjectListItem } from "@/components/studio/types";

export function DashboardClient({
  initialProjects,
}: {
  initialProjects: import("@/components/studio/types").ProjectListItem[];
}) {
  return <DashboardShell initialProjects={initialProjects} />;
}
