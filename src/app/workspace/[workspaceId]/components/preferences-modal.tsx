import { FormEvent, useState } from "react";
import { Trash } from "lucide-react";
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
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

type PreferencesModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
};

export const PreferencesModal = ({
  initialValue,
  open,
  setOpen,
}: PreferencesModalProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This action is irreversible.",
  });

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const { mutate: updateWorkspace, isLoading: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isLoading: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess(data) {
          toast.success("Workspace updated");
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
    
    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess(data) {
          toast.success("Workspace removed");
          router.replace("/");
        },
        onError(error) {
          toast.error("Something went wrong");
        },
        onSettled() {},
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264A3] hover:underline font-semibold">
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
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    disabled={isUpdatingWorkspace}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingWorkspace}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isUpdatingWorkspace}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
