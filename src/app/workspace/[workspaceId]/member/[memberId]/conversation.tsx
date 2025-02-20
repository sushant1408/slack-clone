import { LoaderIcon } from "lucide-react";

import { useGetMemberById } from "@/features/members/api/use-get-member-by-id";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";

interface ConversationProps {
  id: Id<"conversations">;
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { isLoading, member } = useGetMemberById({ memberId });
  const { loadMore, results, status } = useGetMessages({ conversationId: id });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  if (isLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <LoaderIcon className="animate-spin text-muted-foreground !size-5" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        onClick={() => {}}
        memberName={member?.user.name}
        memberImage={member?.user.image}
      />
      <MessageList
        memberName={member?.user.name}
        memberImage={member?.user.image}
        data={results}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        canLoadMore={canLoadMore}
        variant="conversation"
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};

export { Conversation };
