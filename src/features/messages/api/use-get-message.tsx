import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseGetMessageProps = {
  id: Id<"messages">;
};

export const useGetMessage = ({ id }: UseGetMessageProps) => {
  const data = useQuery(api.messages.getById, { id });
  const isMessageLoading = data === undefined;

  return { message: data, isMessageLoading };
};
