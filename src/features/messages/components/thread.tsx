import { differenceInMinutes, format } from "date-fns";
import { AlertTriangleIcon, LoaderIcon, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TIME_THRESHOLD } from "@/lib/constants";
import { formatDateLabel } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCreateMessage } from "../api/use-create-message";
import { useGetMessageById } from "../api/use-get-message-by-id";
import { useGetMessages } from "../api/use-get-messages";
import { useGetConversationId } from "@/features/conversations/api/use-get-conversation-id";
import { useMemberId } from "@/hooks/use-member-id";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadsProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type ReplyMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const Threads = ({ messageId, onClose }: ThreadsProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();

  const [editorKey, setEditorkey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const editorRef = useRef<Quill | null>(null);

  const { isLoading, messageById } = useGetMessageById({ messageId });
  const { currentMember } = useCurrentMember({ workspaceId });
  const { conversationId } = useGetConversationId({
    memberId,
    workspaceId,
  });
  const { results, status, loadMore } = useGetMessages({
    channelId,
    conversationId: conversationId!,
    parentMessageId: messageId,
  });

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: ReplyMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("URL not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorkey((prevState) => prevState + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

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
  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (isLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="icon-sm" variant="ghost">
            <XIcon className="!size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <LoaderIcon className="animate-spin !size-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!messageById) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="icon-sm" variant="ghost">
            <XIcon className="!size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangleIcon className="!size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Messages not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="icon-sm" variant="ghost">
          <XIcon className="!size-5 stroke-1.5" />
        </Button>
      </div>
      <div className="flex flex-col pb-2 overflow-y-auto messages-scrollbar">
        {/* parent message */}
        <Message
          hideThreadButton
          memberId={messageById.memberId}
          authorImage={messageById.user.image}
          authorName={messageById.user.name}
          body={messageById.body}
          image={messageById.image}
          isAuthor={messageById.memberId === currentMember?._id}
          createdAt={messageById._creationTime}
          id={messageById._id}
          isEditing={messageById._id === editingId}
          reactions={messageById.reactions}
          setEditingId={setEditingId}
          updatedAt={messageById.updatedAt}
          messageToolbarClassName="top-0"
        />

        {/* replies */}
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
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                  threadName={message.threadName}
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
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
};

export { Threads };
