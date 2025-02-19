"use client";

import { LoaderIcon, TriangleAlertIcon } from "lucide-react";

import { MessageList } from "@/components/message-list";
import { useGetChannelById } from "@/features/channels/api/use-get-channel-by-id";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useChannelId } from "@/hooks/use-channel-id";
import { ChatInput } from "./chat-input";
import { Header } from "./header";

export default function ChannelIdPage() {
  const channelId = useChannelId();

  const { channel, isLoading } = useGetChannelById({ channelId });
  const { results, status, loadMore } = useGetMessages({ channelId });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  if (isLoading || status === "LoadingFirstPage") {
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
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        canLoadMore={canLoadMore}
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
}
