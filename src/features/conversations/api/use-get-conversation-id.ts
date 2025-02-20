import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetConversationIdProps {
  workspaceId: Id<"workspaces">;
  memberId: Id<"members">;
}

const useGetConversationId = ({
  memberId,
  workspaceId,
}: UseGetConversationIdProps) => {
  const data = useQuery(api.conversations.getConversationId, {
    memberId,
    workspaceId,
  });
  const isLoading = data === undefined;

  return { conversationId: data, isLoading };
};

export { useGetConversationId };
