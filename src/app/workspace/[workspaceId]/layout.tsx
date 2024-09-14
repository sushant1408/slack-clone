"use client";

import { ReactNode } from "react";
import { Loader } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePanel } from "@/hooks/use-panel";
import { Toolbar } from "./components/toolbar";
import { Sidebar } from "./components/sidebar";
import { WorkspaceSidebar } from "./components/workspace-sidebar";
import { Thread } from "@/features/messages/components/thread";
import { Id } from "../../../../convex/_generated/dataModel";
import { Profile } from "@/features/members/components/profile";

type WorkspaceIdLayoutProps = {
  children: ReactNode;
};

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { onCloseMessage, parentMessageId, onCloseProfile, profileMemberId } =
    usePanel();

  const showPanel: boolean = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="sg-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
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
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onCloseMessage}
                  />
                ) : profileMemberId ? (
                  <Profile
                    profileMemberId={profileMemberId as Id<"members">}
                    onClose={onCloseProfile}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
