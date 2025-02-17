"use client";

import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export default function WorkspaceIdScreen() {
  const workspaceId = useWorkspaceId();
  const { workspace } = useGetWorkspaceById({ workspaceId });

  return <>{JSON.stringify(workspace, null, 4)}</>;
}
