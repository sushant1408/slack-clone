import { Info, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

type ToolbarProps = {};

export const Toolbar = ({}: ToolbarProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { workspace } = useGetWorkspace({ id: workspaceId });

  const [open, setOpen] = useState<boolean>(false);

  const { channels } = useGetChannels({ workspaceId });
  const { members } = useGetMembers({ workspaceId });

  const handleChannelClick = (channelId: Id<"channels">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const handleMemberClick = (memberId: Id<"members">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <div className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem key={channel._id} onSelect={() => handleChannelClick(channel._id)}>
                  # {channel?.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem key={member._id} onSelect={() => handleMemberClick(member._id)}>
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </div>
  );
};
