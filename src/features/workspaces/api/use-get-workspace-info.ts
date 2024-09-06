import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseGetWorkspacesProps = {
  id: Id<"workspaces">;
};

export const useGetWorkspaceInfo = ({ id }: UseGetWorkspacesProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });
  const isWorkspaceInfoLoading = data === undefined;

  return { workspaceInfo: data, isWorkspaceInfoLoading };
};
