"use client";

import { ReactNode } from "react";

import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";

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
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="sg-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5e2c5f]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
