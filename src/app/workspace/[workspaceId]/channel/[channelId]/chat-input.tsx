import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Quill from "quill";
import { toast } from "sonner";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorkey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const editorRef = useRef<Quill | null>(null);

  const { mutate } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      await mutate(
        {
          body,
          workspaceId,
          channelId,
        },
        { throwError: true }
      );
      setEditorkey((prevState) => prevState + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export { ChatInput };
