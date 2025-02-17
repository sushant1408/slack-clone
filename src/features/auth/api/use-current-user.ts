import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

const useCurrentUser = () => {
  const data = useQuery(api.users.currentUser);
  const isLoading = data === undefined;

  return { currentUser: data, isLoading };
};

export { useCurrentUser };
