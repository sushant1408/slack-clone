import {
  AlertTriangleIcon,
  HashIcon,
  LoaderIcon,
  MessageSquareTextIcon,
  SendHorizonalIcon,
} from "lucide-react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { SidebarItem } from "./sidebar-item";
import { UserItem } from "./user-item";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSection } from "./workspace-section";
import { useMemberId } from "@/hooks/use-member-id";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();

  const [_open, setOpen] = useCreateChannelModal();

  const { currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember(
    { workspaceId }
  );
  const { isLoading: isWorkspaceLoading, workspace } = useGetWorkspaceById({
    workspaceId,
  });
  const { channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  });
  const { isLoading: isMembersLoading, members } = useGetMembers({
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

      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={currentMember.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={item._id === channelId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label="Direct messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            label={item.user.name}
            image={item.user.image}
            id={item._id}
            variant={item._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export { WorkspaceSidebar };
