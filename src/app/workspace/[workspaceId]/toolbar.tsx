import { InfoIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { workspace } = useGetWorkspaceById({ workspaceId });

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-[var(--toolbar-h)] p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
        >
          <SearchIcon className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="icon-sm">
          <InfoIcon className="!size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export { Toolbar };
