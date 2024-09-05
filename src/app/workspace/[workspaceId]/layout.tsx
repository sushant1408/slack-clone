"use client";

import { ReactNode } from "react";

import { Toolbar } from "./components/toolbar";
import { Sidebar } from "./components/sidebar";

type WorkspaceIdLayoutProps = {
  children: ReactNode;
};

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
