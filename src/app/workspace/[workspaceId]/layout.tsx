"use client";

import { LoaderIcon } from "lucide-react";
import { ReactNode } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Threads } from "@/features/messages/components/thread";
import { usePanel } from "@/hooks/use-panel";
import { Id } from "../../../../convex/_generated/dataModel";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { WorkspaceSidebar } from "./workspace-sidebar";

export default function WorkspaceIdLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { parentMessageId, onCloseMessage } = usePanel();

  const showPanel = !!parentMessageId;

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

          {showPanel && (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Threads messageId={parentMessageId as Id<"messages">} onClose={onCloseMessage} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <LoaderIcon className="animate-spin !size-5 text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
