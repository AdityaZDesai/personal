import React from "react";

interface OutputLineProps {
  text: string;
  className?: string;
}

export default function OutputLine({ text, className }: OutputLineProps) {
  return (
    <div
      className={`whitespace-pre-wrap break-all leading-7 py-[1px] ${className || ""}`}
    >
      {text || "\u00A0"}
    </div>
  );
}
