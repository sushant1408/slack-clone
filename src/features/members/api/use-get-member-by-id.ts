import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMemberByIdProps {
  memberId: Id<"members">;
}

const useGetMemberById = ({ memberId }: UseGetMemberByIdProps) => {
  const data = useQuery(api.members.getMemberById, { memberId });
  const isLoading = data === undefined;

  return { member: data, isLoading };
};

export { useGetMemberById };
