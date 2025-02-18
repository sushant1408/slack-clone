"use client";

import { useGetChannelById } from "@/features/channels/api/use-get-channel-by-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export default function MemberIdPage() {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { channel } = useGetChannelById({ channelId, workspaceId });

  return <>{JSON.stringify(channel, null, 4)}</>;
}
