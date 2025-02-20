import { differenceInMinutes, format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TIME_THRESHOLD } from "@/lib/constants";
import { formatDateLabel } from "@/lib/utils";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { ChannelHero } from "./channel-hero";
import { ConversationHero } from "./conversation-hero";
import { Message } from "./message";

interface MessageListProps {
  memberName?: Doc<"users">["name"];
  memberImage?: Doc<"users">["image"];
  channelName?: Doc<"channels">["name"];
  channelCreationTime?: Doc<"channels">["_creationTime"];
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const MessageList = ({
  canLoadMore,
  data,
  isLoadingMore,
  loadMore,
  channelCreationTime,
  channelName,
  memberImage,
  memberName,
  variant = "channel",
}: MessageListProps) => {
  const workspaceId = useWorkspaceId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { currentMember } = useCurrentMember({ workspaceId });

  /**
   * this will create an object with date as key and array of messages which are created on that date. for e.g.
   * {
   *    "2025-06-02": [
   *      { ...message1 },
   *      { ...message2 },
   *    ],
   *    "2025-07-13": [
   *      { ...message1 },
   *      { ...message2 },
   *      { ...message3 },
   *    ]
   * }
   */
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {})?.map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user?._id === message.user?._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
              />
            );
          })}
        </div>
      ))}

      {/* present but almost invisible div to load more messages whenever this div is visible */}
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );

            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <LoaderIcon className="size-4 animate-spin" />
          </span>
        </div>
      )}

      {variant === "channel" && channelName && channelCreationTime ? (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      ) : null}
      {variant === "conversation" && memberName ? (
        <ConversationHero image={memberImage} name={memberName} />
      ) : null}
    </div>
  );
};

export { MessageList };
