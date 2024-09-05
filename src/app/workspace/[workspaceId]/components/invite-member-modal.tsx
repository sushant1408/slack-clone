import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateJoinCode } from "@/features/workspaces/api/use-update-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Copy, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

type InviteMemberModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
};

export const InviteMemberModal = ({
  open,
  setOpen,
  joinCode,
  name,
}: InviteMemberModalProps) => {
  const workspaceId = useWorkspaceId();

  const { mutate, isLoading } = useUpdateJoinCode();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message:
      "This will deactivate the current invite code and generate a new one",
  });

  const handleCopy = async () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied to clipboard");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleNewCode = async () => {
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }

    mutate(
      { workspaceId },
      {
        onSuccess(data) {
          toast.success("Invite code regenerated");
        },
        onError(error) {
          toast.error("Failed to regenerate invite code");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy link
              <Copy className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={handleNewCode}
              variant="outline"
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
