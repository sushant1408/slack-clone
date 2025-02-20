"use client";

import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Conversation } from "./conversation";

export default function MemberIdPage() {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      { memberId, workspaceId },
      {
        onSuccess: (data) => {
          setConversationId(data);
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <LoaderIcon className="animate-spin text-muted-foreground !size-5" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlertIcon className="text-muted-foreground !size-5" />
        <span className="text-muted-foreground text-sm">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
}
