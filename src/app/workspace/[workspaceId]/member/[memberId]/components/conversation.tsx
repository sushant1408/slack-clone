import { MessageList } from "@/components/message-list";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useMemberId } from "@/hooks/use-member-id";
import { Loader } from "lucide-react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { ChatInput } from "./chat-input";
import { ConversationHeader } from "./conversation-header";

type ConversationProps = {
  id: Id<"conversations">;
};

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { isMemberLoading, member } = useGetMember({ id: memberId });

  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";

  if (isMemberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        canLoadMore={canLoadMore}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
