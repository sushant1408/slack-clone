"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { LoaderIcon, LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";

const UserButton = () => {
  const { signOut } = useAuthActions();
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <LoaderIcon className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!currentUser) {
    return null;
  }

  const { name, image } = currentUser;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarFallback>
            {name!.charAt(0).toUpperCase()}
          </AvatarFallback>
          <AvatarImage src={image} alt={name} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserButton };
