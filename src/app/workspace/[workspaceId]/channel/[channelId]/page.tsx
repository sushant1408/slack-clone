"use client";

import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { ChannelHeader } from "./components/channel-header";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { channel, isChannelLoading } = useGetChannel({ id: channelId });

  if (isChannelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No channel found</span>
      </div>
    );
  }

  return <div className="flex flex-col h-full">
    <ChannelHeader initialValue={channel.name} />
  </div>;
};

export default ChannelIdPage;
