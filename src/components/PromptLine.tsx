import React from "react";

interface PromptLineProps {
  cwd: string;
  command: string;
}

function formatCwd(cwd: string): string {
  return cwd === "~" ? "~" : cwd;
}

export default function PromptLine({ cwd, command }: PromptLineProps) {
  return (
    <div className="flex leading-7 pt-1">
      <span className="text-terminal-green font-bold">visitor</span>
      <span className="text-terminal-gray">@</span>
      <span className="text-terminal-magenta font-bold">aditya</span>
      <span className="text-terminal-gray">:</span>
      <span className="text-terminal-blue font-bold">{formatCwd(cwd)}</span>
      <span className="text-terminal-white mr-2">$</span>
      <span className="text-terminal-white">{command}</span>
    </div>
  );
}
