import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Hint } from "./hint";
import { MessageToolbar } from "./message-toolbar";
import { Thumbnail } from "./thumbnail";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { MessageReactions } from "./message-reactions";
import { usePanel } from "@/hooks/use-panel";
import { ChevronRight } from "lucide-react";
import { ThreadBar } from "./thread-bar";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type MessageProps = {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void | null;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
};

const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? "Today"
      : isYesterday(date)
        ? "Yesterday"
        : format(date, "MMM d, yyyy")
  } at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
  body,
  createdAt,
  id,
  image,
  isAuthor,
  isEditing,
  memberId,
  reactions,
  setEditingId,
  updatedAt,
  authorImage,
  authorName = "Member",
  hideThreadButton,
  isCompact,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
}: MessageProps) => {
  const { onCloseMessage, onOpenMessage, parentMessageId, onOpenProfile } = usePanel();

  const { mutate: updateMessage, isLoading: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isLoading: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isLoading: isTogglingReaction } =
    useToggleReaction();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete message",
    message:
      "Are you sure you want to delete this message? This action is irreversible.",
  });

  const handleUpdateMessage = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess(data) {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError(error) {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleRemoveMessage = async () => {
    const confirmed = await confirm();

    if (!confirmed) {
      return;
    }

    removeMessage(
      { id },
      {
        onSuccess(data) {
          toast.success("Message deleted");
          if (parentMessageId === id) {
            onCloseMessage();
          }
        },
        onError(error) {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError(error) {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#F2C74433] hover:bg-[##F2C74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="h-full w-full">
                <Editor
                  onSubmit={handleUpdateMessage}
                  disabled={isUpdatingMessage}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full ml-0.5">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                <MessageReactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  name={threadName}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isLoading={isUpdatingMessage}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemoveMessage}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#F2C74433] hover:bg-[##F2C74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar className="rounded-md">
              <AvatarImage
                className="rounded-md"
                src={authorImage}
                alt={authorName}
              />
              <AvatarFallback className="rounded-md bg-sky-500 text-white text-sm">
                {authorName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="h-full w-full">
              <Editor
                onSubmit={handleUpdateMessage}
                disabled={isUpdatingMessage}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => onOpenProfile(memberId)}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-sm text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <MessageReactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                name={threadName}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isLoading={isUpdatingMessage}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemoveMessage}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
