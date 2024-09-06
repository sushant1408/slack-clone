"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";

type WorkspaceIdPageProps = {};

const WorkspaceIdPage = ({}: WorkspaceIdPageProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { isWorkspaceLoading, workspace } = useGetWorkspace({
    id: workspaceId,
  });
  const { isChannelsLoading, channels } = useGetChannels({ workspaceId });
  const { isMemberLoading, member } = useCurrentMember({ workspaceId });

  const [open, setOpen] = useCreateChannelModal();

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      isWorkspaceLoading ||
      isChannelsLoading ||
      isMemberLoading ||
      !member ||
      !workspace
    ) {
      return;
    }

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    isWorkspaceLoading,
    isChannelsLoading,
    workspace,
    open,
    setOpen,
    router,
    workspaceId,
    isMemberLoading,
    member,
    isAdmin,
  ]);

  if (isWorkspaceLoading || isChannelsLoading || isMemberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
};

export default WorkspaceIdPage;
