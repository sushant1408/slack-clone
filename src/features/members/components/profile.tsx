import Link from "next/link";
import { AlertTriangle, ChevronDown, Loader, Mail, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThreadProps = {
  profileMemberId: Id<"members">;
  onClose: () => void;
};

export const Profile = ({ profileMemberId, onClose }: ThreadProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { member: currentMember, isMemberLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { member, isMemberLoading } = useGetMember({ id: profileMemberId });

  const { mutate: updateMember, isLoading: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isLoading: isRemovingMember } =
    useRemoveMember();

  const [UpdateConfirmDialog, updateConfirm] = useConfirm({
    title: "Change role",
    message: "Are you sure you want to change this member's role?",
  });
  const [RemoveConfirmDialog, removeConfirm] = useConfirm({
    title: "Remove member",
    message: "Are you sure you want to remove this member?",
  });
  const [LeaveConfirmDialog, leaveConfirm] = useConfirm({
    title: "Leave workspace",
    message: "Are you sure you want to leave this workspace?",
  });

  const handleUpdate = async (role: "admin" | "member") => {
    const isConfirmed = await updateConfirm();

    if (!isConfirmed) {
      return;
    }

    updateMember(
      { id: profileMemberId, role },
      {
        onSuccess(data) {
          toast.success("Member updated");
        },
        onError(error) {
          toast.error("Failed to update member");
        },
      }
    );
  };

  const handleRemove = async () => {
    const isConfirmed = await removeConfirm();

    if (!isConfirmed) {
      return;
    }

    removeMember(
      { id: profileMemberId },
      {
        onSuccess(data) {
          toast.success("Member removed");
          onClose();
        },
        onError(error) {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const handleLeave = async () => {
    const isConfirmed = await leaveConfirm();

    if (!isConfirmed) {
      return;
    }

    removeMember(
      { id: profileMemberId },
      {
        onSuccess(data) {
          toast.success("You left the worksapce");
          onClose();
          router.replace("/");
        },
        onError(error) {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  if (isMemberLoading || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Threads</p>
          <Button size="iconSm" variant="ghost" onClick={onClose}>
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Threads</p>
          <Button size="iconSm" variant="ghost" onClick={onClose}>
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="h-full flex flex-col gap-y-2 items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UpdateConfirmDialog />
      <RemoveConfirmDialog />
      <LeaveConfirmDialog />

      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button size="iconSm" variant="ghost" onClick={onClose}>
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex flex-col p-4 items-center justify-center">
          <Avatar className="rounded-md max-w-[256px] max-h-[256px] size-full">
            <AvatarImage alt={member.user.name} src={member.user.image} />
            <AvatarFallback className="rounded-md aspect-square bg-sky-500 text-white text-6xl">
              {member.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" &&
          currentMember._id !== profileMemberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full capitalize">
                    {member.role} <ChevronDown className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(value) =>
                      handleUpdate(value as "admin" | "member")
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
                variant="outline"
                className="w-full"
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id == profileMemberId &&
            currentMember?.role !== "admin" ? (
            <div className="mt-4">
              <Button
                onClick={handleLeave}
                variant="outline"
                className="w-full"
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <Mail className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264A3]"
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
