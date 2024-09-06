import { ChangeEvent, FormEvent, useState } from "react";
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
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

type CreateChannelModalProps = {};

export const CreateChannelModal = ({}: CreateChannelModalProps) => {
  const router = useRouter();

  const [open, setOpen] = useCreateChannelModal();

  const workspaceId = useWorkspaceId();
  const { mutate, isLoading, isError, isSettled, isSuccess } =
    useCreateChannel();

  const [name, setName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(
      { workspaceId, name },
      {
        onSuccess(data) {
          toast.success("Channel created");
          handleClose();
          router.push(`/workspace/${workspaceId}/channel/${data}`);
        },
        onError(error) {
          toast.error("Failed to create channel");
        },
        onSettled() {},
      }
    );
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleOnSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={handleChange}
            disabled={isLoading}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="Channel name e.g. 'announcements', 'monthly-reports'"
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
