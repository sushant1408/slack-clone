import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseCurrentMember {
  workspaceId: Id<"workspaces">;
}

const useCurrentMember = ({ workspaceId }: UseCurrentMember) => {
  const data = useQuery(api.members.currentMember, { workspaceId });
  const isLoading = data === undefined;

  return { currentMember: data, isLoading };
};

export { useCurrentMember };
