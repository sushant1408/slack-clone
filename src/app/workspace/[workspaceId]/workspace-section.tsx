import { PlusIcon } from "lucide-react";
import { ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkspaceSectionProps {
  children: ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}

const WorkspaceSection = ({
  children,
  hint,
  label,
  onNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2 [--text-color:#f9edffcc]">
      <div className="flex items-center px-3.5 group">
        <Button
          onClick={toggle}
          variant="transparent"
          className="p-0.5 text-sm text-[var(--text-color)] shrink-0 size-6"
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", !on && "-rotate-90")}
          />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm text-[var(--text-color)] h-[26px] justify-normal overflow-hidden items-center"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew && (
          <TooltipWrapper label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition ml-auto p-0.5 text-sm text-[var(--text-color)] size-6 shrink-0"
            >
              <PlusIcon className="!size-5" />
            </Button>
          </TooltipWrapper>
        )}
      </div>
      {on && children}
    </div>
  );
};

export { WorkspaceSection };
