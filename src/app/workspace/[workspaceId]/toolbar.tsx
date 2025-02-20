import { InfoIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import Link from "next/link";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { workspace } = useGetWorkspaceById({ workspaceId });

  const [open, setOpen] = useState(false);

  const { channels } = useGetChannels({ workspaceId });
  const { members } = useGetMembers({ workspaceId });

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-[var(--toolbar-h)] p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
        >
          <SearchIcon className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle className="hidden"></DialogTitle>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  asChild
                  onSelect={() => setOpen(false)}
                >
                  <Link
                    href={`/workspace/${workspaceId}/channel/${channel._id}`}
                  >
                    # {channel.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  asChild
                  onSelect={() => setOpen(false)}
                >
                  <Link href={`/workspace/${workspaceId}/member/${member._id}`}>
                    {member.user.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
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
