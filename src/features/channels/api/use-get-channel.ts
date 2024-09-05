import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseGetChannelProps = {
  id: Id<"channels">;
};

export const useGetChannel = ({ id }: UseGetChannelProps) => {
  const data = useQuery(api.channels.getById, { id });
  const isChannelLoading = data === undefined;

  return { channel: data, isChannelLoading };
};
