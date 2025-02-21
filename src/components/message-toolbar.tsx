import {
  MessageSquareTextIcon,
  MoreVerticalIcon,
  PencilIcon,
  SmileIcon,
  TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import { TooltipWrapper } from "./tooltip-wrapper";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EmojiClickData } from "emoji-picker-react";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
  messageToolbarClassName?: string;
}

const MessageToolbar = ({
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  isAuthor,
  isPending,
  hideThreadButton,
  messageToolbarClassName,
}: MessageToolbarProps) => {
  return (
    <div className={cn("absolute -top-4 right-5", messageToolbarClassName)}>
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction..."
          onEmojiSelect={(value: EmojiClickData) => handleReaction(value.emoji)}
        >
          <Button variant="ghost" size="icon-sm" disabled={isPending}>
            <SmileIcon />
          </Button>
        </EmojiPopover>

        {!hideThreadButton && (
          <TooltipWrapper label="Reply in thread">
            <Button
              onClick={handleThread}
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
            >
              <MessageSquareTextIcon />
            </Button>
          </TooltipWrapper>
        )}

        {isAuthor && (
          <DropdownMenu>
            <TooltipWrapper label="More actions">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" disabled={isPending}>
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
            </TooltipWrapper>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleEdit}>
                <PencilIcon />
                Edit message
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-rose-600"
              >
                <TrashIcon />
                Delete message...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export { MessageToolbar };
