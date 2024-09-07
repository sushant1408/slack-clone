import { ChevronDown, Trash } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ConversationHeaderProps = {
  memberName?: string;
  memberImage?: string;
  onClick: () => void;
};

export const ConversationHeader = ({
  onClick,
  memberImage,
  memberName = "Member",
}: ConversationHeaderProps) => {
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
      >
        <Avatar className="rounded-md size-6 mr-2">
          <AvatarImage src={memberImage} alt={memberName} />
          <AvatarFallback className="bg-sky-500 rounded-md text-sm">
            {memberName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <ChevronDown className="size-4 ml-1 shrink-0" />
      </Button>
    </div>
  );
};
