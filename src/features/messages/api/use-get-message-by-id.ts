import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMessageByIdProps {
  messageId: Id<"messages">;
}

const useGetMessageById = ({ messageId }: UseGetMessageByIdProps) => {
  const data = useQuery(api.messages.getMessageById, {
    messageId,
  });
  const isLoading = data === undefined;

  return { messageById: data, isLoading };
};

export { useGetMessageById };
