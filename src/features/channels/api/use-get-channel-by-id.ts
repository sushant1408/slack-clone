import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetChannelByIdProps {
  channelId: Id<"channels">;
}

const useGetChannelById = ({ channelId }: UseGetChannelByIdProps) => {
  const data = useQuery(api.channels.getChannelById, {
    channelId,
  });
  const isLoading = data === undefined;

  return { channel: data, isLoading };
};

export { useGetChannelById };
