import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react";
import { EmojiPopover } from "./emoji-popover";
import { Hint } from "./hint";

import { Button } from "./ui/button";

type MessageToolbarProps = {
  isAuthor: boolean;
  isLoading: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleReaction: (value: string) => void;
  handleDelete: () => void;
  hideThreadButton?: boolean;
};

export const MessageToolbar = ({
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  isAuthor,
  isLoading,
  hideThreadButton,
}: MessageToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border rounded-md shadow-sm bg-white">
        <EmojiPopover
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
          hint="Add reaction..."
        >
          <Button variant="ghost" size="iconSm" disabled={isLoading}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              onClick={handleThread}
              variant="ghost"
              size="iconSm"
              disabled={isLoading}
            >
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="iconSm"
                disabled={isLoading}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="iconSm"
                disabled={isLoading}
                className="text-rose-600"
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
