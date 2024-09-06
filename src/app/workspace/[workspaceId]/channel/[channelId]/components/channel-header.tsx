import { ChevronDown, Trash } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { toast } from "sonner";
import { useChannelId } from "@/hooks/use-channel-id";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

type ChannelHeaderProps = {
  initialValue: string;
};

export const ChannelHeader = ({ initialValue }: ChannelHeaderProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete this channel?",
    message:
      "You are about to delete this channel. This action is irreversible.",
  });

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const { mutate: updateChannel, isLoading: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isLoading: isRemovingChannel } =
    useRemoveChannel();
  const { member } = useCurrentMember({ workspaceId });

  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess(data) {
          toast.success("Channel updated");
          setEditOpen(false);
        },
        onError(error) {
          toast.error("Something went wrong");
          setValue(initialValue);
        },
        onSettled() {},
      }
    );
  };

  const handleRemove = async () => {
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }

    removeChannel(
      { id: channelId },
      {
        onSuccess(data) {
          toast.success("Workspace removed");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError(error) {
          toast.error("Something went wrong");
        },
        onSettled() {},
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size="sm"
          >
            <span className="truncate"># {value}</span>
            <ChevronDown className="size-4 ml-1 shrink-0" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog
              open={editOpen}
              onOpenChange={isAdmin ? setEditOpen : undefined}
            >
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {isAdmin && (
                      <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    onChange={handleChange}
                    disabled={isUpdatingChannel}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isUpdatingChannel}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {isAdmin && (
              <button
                disabled={isRemovingChannel}
                onClick={handleRemove}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
              >
                <Trash className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
