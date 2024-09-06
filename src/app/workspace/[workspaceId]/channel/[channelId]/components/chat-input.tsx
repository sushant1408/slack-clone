import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { toast } from "sonner";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { Id } from "../../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type ChatInputProps = {
  placeholder: string;
};

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    image,
    body,
  }: {
    image: File | null;
    body: string;
  }) => {
    try {
      setIsSending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        workspaceId,
        channelId,
        image: undefined,
      };

      if (image) {
        const uploadUrl = await generateUploadUrl({}, { throwError: true });

        if (!uploadUrl) {
          throw new Error("Failed to generate upload URL");
        }

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await response.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((prevState) => prevState + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
      editorRef.current?.enable(true);
    }
  };

  return (
    <div className="px-4 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isSending}
        innerRef={editorRef}
      />
    </div>
  );
};
