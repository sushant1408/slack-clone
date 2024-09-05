import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseGetChannelsProps = {
  workspaceId: Id<"workspaces">;
};

export const useGetChannels = ({ workspaceId }: UseGetChannelsProps) => {
  const data = useQuery(api.channels.get, { workspaceId });
  const isChannelsLoading = data === undefined;

  return { channels: data, isChannelsLoading };
};