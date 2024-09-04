"use client";

import { UserButton } from "@/features/auth/components/user-button";

export default function Home() {
  return (
    <div className="flex flex-col">
      Home page
      <UserButton />
    </div>
  );
}
