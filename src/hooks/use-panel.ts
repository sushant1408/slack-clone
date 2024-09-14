import { useProfileMemberId } from "@/features/members/store/use-profile-member-id";
import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    onCloseProfile();
  };

  const onCloseMessage = () => {
    setParentMessageId(null);
  };

  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    onCloseMessage();
  };

  const onCloseProfile = () => {
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onCloseMessage,
    profileMemberId,
    onOpenProfile,
    onCloseProfile,
  };
};
