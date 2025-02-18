import { FaChevronDown } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { useConfirm } from "@/hooks/use-confirm";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useDeleteChannel } from "@/features/channels/api/use-delete-channel";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const channelId = useChannelId();
const router = useRouter();
  const [ConfirmationDialog, confirm] = useConfirm({
    message: "This action is irreversible",
    title: "Are you sure?",
  });

  const [value, setValue] = useState(title);
  const [renameOpen, setRenameOpen] = useState(false);

  const { mutate: updateChannel, isPending: isChannelUpdating } =
    useUpdateChannel();
  const { mutate: deleteChannel, isPending: isChannelDeleting } =
    useDeleteChannel();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleRename = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { name: value, channelId },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          setRenameOpen(false);
        },
        onError: () => {
          toast.error("Failed to update the channel");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    deleteChannel(
      { channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to delete the channel");
        },
      }
    );
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
              size="sm"
            >
              <span className="truncate"># {title}</span>
              <FaChevronDown className="!size-2.5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    </div>
                    <p className="text-sm"># {title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRename} className="space-y-4">
                    <Input
                      value={value}
                      onChange={handleNameChange}
                      disabled={isChannelUpdating}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isChannelUpdating}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isChannelUpdating}>
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <button
                onClick={handleDelete}
                disabled={isChannelDeleting}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export { Header };
