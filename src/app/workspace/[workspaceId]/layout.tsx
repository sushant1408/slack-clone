"use client";

import { ReactNode } from "react";

import { Toolbar } from "./components/toolbar";

type WorkspaceIdLayoutProps = {
  children: ReactNode;
};

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
};

export default WorkspaceIdLayout;
