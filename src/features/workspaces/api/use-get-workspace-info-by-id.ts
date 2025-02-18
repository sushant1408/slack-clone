import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceInfoByIdProps {
  workspaceId: Id<"workspaces">;
}

const useGetWorkspaceInfoById = ({
  workspaceId,
}: UseGetWorkspaceInfoByIdProps) => {
  const data = useQuery(api.workspaces.getWorkspaceInfoById, { workspaceId });
  const isLoading = data === undefined;

  return { workspace: data, isLoading };
};

export { useGetWorkspaceInfoById };
