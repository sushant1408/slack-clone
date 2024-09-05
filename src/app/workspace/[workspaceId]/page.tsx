"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

type WorkspaceIdPageProps = {};

const WorkspaceIdPage = ({}: WorkspaceIdPageProps) => {
  const workspaceId = useWorkspaceId();
  const { isWorkspaceLoading, workspace } = useGetWorkspace({
    id: workspaceId,
  });

  return <div></div>;
};

export default WorkspaceIdPage;
