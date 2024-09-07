import { format, isToday, isYesterday } from "date-fns";
import { ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type ThreadBarProps = {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick: () => void;
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

export const ThreadBar = ({
  count,
  image,
  timestamp,
  name = "Member",
  onClick,
}: ThreadBarProps) => {
  if (!count || !timestamp) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md border border-transparent hover:bg-white hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="rounded-md size-6">
          <AvatarImage src={image} className="rounded-md" />
          <AvatarFallback className="bg-sky-500 rounded-md text-xs">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count === 1 ? "reply" : "replies"}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          {formatFullTime(new Date(timestamp))}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRight className="ml-auto opacity-0 group-hover/thread-bar:opacity-100 size-4 text-muted-foreground transition shrink-0" />
    </button>
  );
};
