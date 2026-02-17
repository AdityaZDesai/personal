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
    <div className="flex flex-wrap leading-7 pt-2 mb-1">
      <span className="shrink-0">
        <span className="text-terminal-orange font-bold">visitor</span>
        <span className="text-terminal-gray">@</span>
        <span className="text-terminal-orange font-bold">aditya</span>
        <span className="text-terminal-gray">:</span>
        <span className="text-terminal-yellow font-bold">
          {formatCwd(cwd)}
        </span>
        <span className="text-terminal-white">{"$ "}</span>
      </span>
      <span className="text-terminal-white break-all">{command}</span>
    </div>
  );
}
