import { ExpertHubShell } from "@/features/shell/expert-hub-shell";
import { requireUser } from "@/features/auth/session";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <ExpertHubShell>{children}</ExpertHubShell>;
}
