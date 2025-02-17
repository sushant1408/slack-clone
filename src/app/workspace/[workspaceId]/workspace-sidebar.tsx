import {
  AlertTriangleIcon,
  LoaderIcon,
  MessageSquareTextIcon,
  SendHorizonalIcon,
} from "lucide-react";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember(
    { workspaceId }
  );
  const { isLoading: isWorkspaceLoading, workspace } = useGetWorkspaceById({
    workspaceId,
  });

  if (isCurrentMemberLoading || isWorkspaceLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <LoaderIcon className="animate-spin !size-5 text-white" />
      </div>
    );
  }

  if (!workspace || !currentMember) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangleIcon className="!size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={currentMember.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareTextIcon}
          id="threads"
        />
        <SidebarItem
          label="Drafts & sent"
          icon={SendHorizonalIcon}
          id="drafts"
        />
      </div>
    </div>
  );
};

export { WorkspaceSidebar };
