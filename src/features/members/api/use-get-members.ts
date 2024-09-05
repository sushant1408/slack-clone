import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseGetMembersProps = {
  id: Id<"workspaces">;
};

export const useGetMembers = ({ id }: UseGetMembersProps) => {
  const data = useQuery(api.members.get, { workspaceId: id });
  const isMembersLoading = data === undefined;

  return { members: data, isMembersLoading };
};
