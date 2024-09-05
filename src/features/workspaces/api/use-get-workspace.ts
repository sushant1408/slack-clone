import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseGetWorkspacesProps = {
  id: Id<"workspaces">;
};

export const useGetWorkspace = ({ id }: UseGetWorkspacesProps) => {
  const data = useQuery(api.workspaces.getById, { id });
  const isWorkspaceLoading = data === undefined;

  return { workspace: data, isWorkspaceLoading };
};
