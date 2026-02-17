import React from "react";

interface OutputLineProps {
  text: string;
  className?: string;
}

export default function OutputLine({ text, className }: OutputLineProps) {
  return (
    <div
      className={`whitespace-pre-wrap break-words leading-7 py-[2px] ${className || ""}`}
    >
      {text || "\u00A0"}
    </div>
  );
}
