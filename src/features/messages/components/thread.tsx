import { AlertTriangleIcon, LoaderIcon, XIcon } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Message } from "@/components/message";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMessageById } from "../api/use-get-message-by-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadsProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

const Threads = ({ messageId, onClose }: ThreadsProps) => {
  const workspaceId = useWorkspaceId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { isLoading, messageById } = useGetMessageById({ messageId });
  const { currentMember } = useCurrentMember({ workspaceId });

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
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

  if (!messageById) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="icon-sm" variant="ghost">
            <XIcon className="!size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangleIcon className="!size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Messages not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="icon-sm" variant="ghost">
          <XIcon className="!size-5 stroke-1.5" />
        </Button>
      </div>
      <div>
        <Message
          hideThreadButton
          memberId={messageById.memberId}
          authorImage={messageById.user.image}
          authorName={messageById.user.name}
          body={messageById.body}
          image={messageById.image}
          isAuthor={messageById.memberId === currentMember?._id}
          createdAt={messageById._creationTime}
          id={messageById._id}
          isEditing={messageById._id === editingId}
          reactions={messageById.reactions}
          setEditingId={setEditingId}
          updatedAt={messageById.updatedAt}
        />
      </div>
      <div className="px-4">
        <Editor onSubmit={() => {}} />
      </div>
    </div>
  );
};

export { Threads };
