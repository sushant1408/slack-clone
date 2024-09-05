import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseCurrentMemberProps = {
  id: Id<"workspaces">;
};

export const useCurrentMember = ({ id }: UseCurrentMemberProps) => {
  const data = useQuery(api.members.current, { id });
  const isMemberLoading = data === undefined;

  return { member: data, isMemberLoading };
};
