"use client";

import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

export default function WorkspaceIdScreen() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useCreateChannelModal();

  const { currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember(
    { workspaceId }
  );
  const { isLoading: isWorkspaceLoading, workspace } = useGetWorkspaceById({
    workspaceId,
  });
  const { channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(
    () => currentMember?.role === "admin",
    [currentMember?.role]
  );

  useEffect(() => {
    if (
      isWorkspaceLoading ||
      isChannelsLoading ||
      isCurrentMemberLoading ||
      !workspace ||
      !currentMember
    ) {
      return;
    }

    if (channelId) {
      router.replace(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    isWorkspaceLoading,
    isChannelsLoading,
    isChannelsLoading,
    currentMember,
    isAdmin,
    workspace,
    open,
    router,
    workspaceId,
    setOpen,
  ]);

  if (isWorkspaceLoading || isChannelsLoading || isCurrentMemberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <LoaderIcon className="animate-spin text-muted-foreground !size-6" />
      </div>
    );
  }

  if (!workspace || !currentMember) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlertIcon className="text-muted-foreground !size-6" />
        <span className="text-muted-foreground text-sm">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlertIcon className="text-muted-foreground !size-6" />
      <span className="text-muted-foreground text-sm">No channel found</span>
    </div>
  );
}
