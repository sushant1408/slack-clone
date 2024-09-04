"use client";

import { useEffect, useMemo } from "react";

import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

export default function Home() {
  const { isWorkspacesLoading, workspaces } = useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useMemo(() => workspaces?.[0]?._id, [workspaces]);

  useEffect(() => {
    if (isWorkspacesLoading) {
      return;
    }

    if (workspaceId) {

    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isWorkspacesLoading, open, setOpen]);

  return (
    <div className="flex flex-col">
      Home page
      <UserButton />
    </div>
  );
}
