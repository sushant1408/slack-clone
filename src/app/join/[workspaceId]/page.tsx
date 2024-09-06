"use client";

import Image from "next/image";
import Link from "next/link";
import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";

const JoinWorkspacePage = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { workspaceInfo, isWorkspaceInfoLoading } = useGetWorkspaceInfo({
    id: workspaceId,
  });
  const { mutate, isLoading: isJoining } = useJoinWorkspace();

  const isMember = useMemo(() => workspaceInfo?.isMember, [workspaceInfo?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (joinCode: string) => {
    mutate(
      { workspaceId, joinCode },
      {
        onSuccess(data) {
          toast.success("Workspace joined");
          router.replace(`/workspace/${data}`);
        },
        onError(error) {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isWorkspaceInfoLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.svg" width={60} height={60} alt="logo" />
      <div className="flex flex-col items-center justify-center gap-y-4 max-w-md">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">Join {workspaceInfo?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the worksapce code to join
          </p>
        </div>
        <VerificationInput
          classNames={{
            container: cn("flex gap-x-2", isJoining && "opacity-50 cursor-not-allowed"),
            character:
              "uppercase h-auto rounded-md border border-gray-500 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
          length={6}
          onComplete={handleComplete}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinWorkspacePage;
