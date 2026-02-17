import React from "react";

interface PromptLineProps {
  cwd: string;
  command: string;
  isActive?: boolean;
}

function formatCwd(cwd: string): string {
  return cwd === "~" ? "~" : cwd;
}

export default function PromptLine({ cwd, command, isActive = false }: PromptLineProps) {
  return (
    <div className="flex leading-6">
      <span className="text-terminal-green font-bold">visitor</span>
      <span className="text-terminal-gray">@</span>
      <span className="text-terminal-magenta font-bold">aditya</span>
      <span className="text-terminal-gray">:</span>
      <span className="text-terminal-blue font-bold">{formatCwd(cwd)}</span>
      <span className="text-terminal-white mr-2">$</span>
      <span className="text-terminal-white">{command}</span>
      {isActive && (
        <span className="cursor-blink ml-[1px] inline-block h-[18px] w-[8px] translate-y-[2px] bg-[#c0caf5]" />
      )}
    </div>
  );
}
