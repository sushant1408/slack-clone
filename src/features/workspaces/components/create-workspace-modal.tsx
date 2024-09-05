import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";

type CreateWorkspaceModalProps = {};

export const CreateWorkspaceModal = ({}: CreateWorkspaceModalProps) => {
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isLoading, isError, isSettled, isSuccess } =
    useCreateWorkspace();

  const [name, setName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(
      { name },
      {
        onSuccess(data) {
          toast.success("Workspace created");
          handleClose();
          router.push(`/workspace/${data}`);
        },
        onError(error) {
          toast.error("Something went wrong");
        },
        onSettled() {},
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleOnSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isLoading}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isLoading} type="submit">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
