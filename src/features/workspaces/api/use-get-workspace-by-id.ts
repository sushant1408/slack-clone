import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceByIdProps {
  workspaceId: Id<"workspaces">;
}

const useGetWorkspaceById = ({ workspaceId }: UseGetWorkspaceByIdProps) => {
  const data = useQuery(api.workspaces.getWorkspaceById, { workspaceId });
  const isLoading = data === undefined;

  return { workspace: data, isLoading };
};

export { useGetWorkspaceById };
