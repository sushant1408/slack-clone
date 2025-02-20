import {
  AlertTriangleIcon,
  ChevronDownIcon,
  LoaderIcon,
  MailIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useCurrentMember } from "../api/use-current-member";
import { useGetMemberById } from "../api/use-get-member-by-id";
import { useRemoveMember } from "../api/use-remove-member";
import { useUpdateMember } from "../api/use-update-member";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [UpdateConfirmationDialog, updateConfirm] = useConfirm({
    message: "Are you aure you want to change this member's role?",
    title: "Change role",
  });
  const [RemoveConfirmationDialog, removeConfirm] = useConfirm({
    message: "Are you aure you want to remove this member?",
    title: "Remove member",
  });
  const [LeaveConfirmationDialog, leaveConfirm] = useConfirm({
    message: "Are you aure you want to leave this workspace?",
    title: "Leave workspace",
  });

  const { isLoading, member } = useGetMemberById({ memberId });
  const { currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember(
    { workspaceId }
  );

  const { isPending: isUpdatingMember, mutate: updateMember } =
    useUpdateMember();
  const { isPending: isRemovingMember, mutate: removeMember } =
    useRemoveMember();

  const handleUpdateMember = async (role: Doc<"members">["role"]) => {
    const ok = await updateConfirm();

    if (!ok) {
      return;
    }

    updateMember(
      { memberId, role },
      {
        onSuccess: () => {
          toast.success("Role changed");
        },
        onError: () => {
          toast.error("Failed to change the role");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await removeConfirm();

    if (!ok) {
      return;
    }

    removeMember(
      { memberId },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const handleLeave = async () => {
    const ok = await leaveConfirm();

    if (!ok) {
      return;
    }

    removeMember(
      { memberId },
      {
        onSuccess: () => {
          toast.success("You left the workspace");
          onClose();
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  if (isLoading || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="icon-sm" variant="ghost">
            <XIcon className="!size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <LoaderIcon className="animate-spin !size-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="icon-sm" variant="ghost">
            <XIcon className="!size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangleIcon className="!size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LeaveConfirmationDialog />
      <RemoveConfirmationDialog />
      <UpdateConfirmationDialog />

      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="icon-sm" variant="ghost">
            <XIcon className="!size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarFallback className="aspect-square text-6xl">
              {(member.user.name || "Member").charAt(0)?.toUpperCase()}
            </AvatarFallback>
            <AvatarImage src={member.user.image} />
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" &&
          currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    // onClick={handleUpdateMember}
                    disabled={isRemovingMember || isUpdatingMember}
                    variant="outline"
                    className="w-full capitalize"
                  >
                    {member.role} <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      handleUpdateMember(role as Doc<"members">["role"])
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleRemove}
                disabled={isRemovingMember || isUpdatingMember}
                variant="outline"
                className="w-full"
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== "admin" ? (
            <div>
              <Button
                onClick={handleLeave}
                disabled={isRemovingMember || isUpdatingMember}
                variant="outline"
                className="mt-4"
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Profile };
