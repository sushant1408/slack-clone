"use client";

import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useGetWorkspaceInfoById } from "@/features/workspaces/api/use-get-workspace-info-by-id";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export default function JoinWorkspacePage() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { workspace, isLoading } = useGetWorkspaceInfoById({ workspaceId });
  const { mutate, isPending } = useJoinWorkspace();

  const isMember = useMemo(() => workspace?.isMember, [workspace?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate(
      { joinCode: value, workspaceId },
      {
        onSuccess: (data) => {
          router.replace(`/workspace/${data}`);
          toast.success("Workspace joined");
        },
        onError: () => {
          toast.error("Failed to join the workspace");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoaderIcon className="animate-spin !size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.svg" alt="logo" width={60} height={60} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold text-center">
            Join {workspace?.name}
          </h1>
          <p className="text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <InputOTP
          onComplete={handleComplete}
          disabled={isPending}
          maxLength={6}
          autoFocus
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              className="border rounded-md uppercase text-black text-lg font-medium"
              index={index}
            />
          ))}
        </InputOTP>
      </div>

      <div className="flex gap-x-4">
        <Button disabled={isPending} size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
