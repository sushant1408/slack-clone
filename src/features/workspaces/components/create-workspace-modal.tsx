import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";

type CreateWorkspaceModalProps = {};

export const CreateWorkspaceModal = ({}: CreateWorkspaceModalProps) => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isLoading, isError, isSettled, isSuccess } = useCreateWorkspace();

  const [name, setName] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate({ name }, {
      onSuccess(data) {
          
      },
      onError(error) {
          
      },
      onSettled() {
          
      },
    });
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
