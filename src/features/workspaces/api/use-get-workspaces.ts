import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.getWorkspaces);
  const isLoading = data === undefined;

  return { workspaces: data, isLoading };
};

export { useGetWorkspaces };
