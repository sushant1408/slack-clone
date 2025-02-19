import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";

import { Doc, Id } from "../../convex/_generated/dataModel";
import { TooltipWrapper } from "./tooltip-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { MessageToolbar } from "./message-toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteMessage } from "@/features/messages/api/use-delete-message";

const Renderer = dynamic(() => import("./renderer"), { ssr: false });
const Editor = dynamic(() => import("./editor"), { ssr: false });

interface MessageProps {
  id: Doc<"messages">["_id"];
  memberId: Doc<"messages">["memberId"];
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
  isCompact?: boolean;
  setEditingId: (messageId: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

const Message = ({
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
}: MessageProps) => {
  const [ConfirmationDialog, confirm] = useConfirm({
    message:
      "Are you sure youwant to delete this message? This cannot be undone.",
    title: "Delete message",
  });
  const { isPending: isUpdatingMessage, mutate: updateMessage } =
    useUpdateMessage();
  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage();

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      {
        body,
        messageId: id,
      },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to edit the message");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    deleteMessage(
      { messageId: id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to delete the message");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmationDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
          )}
        >
          <div className="flex items-start gap-2">
            <TooltipWrapper label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </TooltipWrapper>
            {isEditing ? (
              <div className="h-full w-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isUpdatingMessage || isDeletingMessage}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
              </div>
            )}
          </div>

          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
              handleDelete={handleDelete}
              handleReaction={() => {}}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmationDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarFallback className="text-xs">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage src={authorImage} alt={authorName} />
            </Avatar>
          </button>
          {isEditing ? (
            <div className="h-full w-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isUpdatingMessage || isDeletingMessage}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button className="font-bold text-primary hover:underline">
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <TooltipWrapper label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </TooltipWrapper>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
            </div>
          )}
        </div>

        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isUpdatingMessage || isDeletingMessage}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={handleDelete}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};

export { Message };
