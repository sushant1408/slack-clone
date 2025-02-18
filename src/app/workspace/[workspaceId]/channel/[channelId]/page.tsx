"use client";

import { useGetChannelById } from "@/features/channels/api/use-get-channel-by-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";

export default function ChannelIdPage() {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { channel, isLoading } = useGetChannelById({ channelId });

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <LoaderIcon className="animate-spin text-muted-foreground !size-5" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlertIcon className="text-muted-foreground !size-5" />
        <span className="text-muted-foreground text-sm">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1" />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
}
