import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name: Doc<"users">["name"];
  image: Doc<"users">["image"];
}

const ConversationHero = ({
  image,
  name = "Member",
}: ConversationHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>.
      </p>
    </div>
  );
};

export { ConversationHero };
