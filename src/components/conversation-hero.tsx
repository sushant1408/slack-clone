import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type ConversationHeroProps = {
  name?: string;
  image?: string;
};

export const ConversationHero = ({
  image,
  name = "Member",
}: ConversationHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 rounded-md mr-2">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-sky-500 rounded-md">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold flex items-center mb-2">{name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between <strong>@{name}</strong> and you.
        Check out their profile to learn more about them.
      </p>
    </div>
  );
};
