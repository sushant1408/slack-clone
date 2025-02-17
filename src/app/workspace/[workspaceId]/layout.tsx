"use client";

import { ReactNode } from "react";

import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";

export default function WorkspaceIdLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-full [--toolbar-h:40px]">
      <Toolbar />
      <div className="flex h-[calc(100vh-var(--toolbar-h))]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
