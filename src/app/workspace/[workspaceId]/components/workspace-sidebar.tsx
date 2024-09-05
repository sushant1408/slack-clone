import {
  AlertTriangle,
  Hash,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";

type WorkspaceSidebarProps = {};

export const WorkspaceSidebar = ({}: WorkspaceSidebarProps) => {
  const workspaceId = useWorkspaceId();

  const { member, isMemberLoading } = useCurrentMember({ id: workspaceId });
  const { workspace, isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { channels, isChannelsLoading } = useGetChannels({ workspaceId });
  const { members, isMembersLoading } = useGetMembers({ id: workspaceId });

  if (isWorkspaceLoading || isMemberLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>
      <WorkspaceSection label="Channels" hint="New Channel" onNew={() => {}}>
        {channels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            label={channel.name}
            icon={Hash}
            id={channel._id}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection label="Direct Messages" hint="New direct message" onNew={() => {}}>
        {members?.map((member) => (
          <UserItem
            key={member._id}
            label={member.user.name}
            id={member._id}
            image={member.user.image}
            // variant={}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
