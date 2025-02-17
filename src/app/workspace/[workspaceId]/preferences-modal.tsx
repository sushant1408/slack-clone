import { FormEvent, useState } from "react";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

const PreferencesModal = ({
  initialValue,
  open,
  setOpen,
}: PreferencesModalProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [ConfirmationDialog, confirm] = useConfirm({
    message: "This action is irreversible",
    title: "Are you sure?",
  });

  const [value, setValue] = useState(initialValue);
  const [renameOpen, setRenameOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isWorkspaceUpdating } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isWorkspaceDeleting } =
    useDeleteWorkspace();

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    deleteWorkspace(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace deleted");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to delete the workspace");
        },
      }
    );
  };

  const handleRename = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      { name: value, workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace updated");
          setRenameOpen(false);
        },
        onError: () => {
          toast.error("Failed to update the workspace");
        },
      }
    );
  };

  return (
    <>
      <ConfirmationDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRename} className="space-y-4">
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isWorkspaceUpdating}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isWorkspaceUpdating}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isWorkspaceUpdating}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              onClick={handleDelete}
              disabled={isWorkspaceDeleting}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { PreferencesModal };
