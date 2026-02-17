import React from "react";

interface OutputLineProps {
  text: string;
  className?: string;
}

const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/g;
const URL_TEST_REGEX = /^https?:\/\/[^\s]+$/;

function renderWithLinks(text: string) {
  const parts = text.split(URL_SPLIT_REGEX);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (URL_TEST_REGEX.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-cyan underline decoration-terminal-cyan/40 hover:decoration-terminal-cyan transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function OutputLine({ text, className }: OutputLineProps) {
  return (
    <div
      className={`whitespace-pre-wrap break-words leading-7 py-[2px] ${className || ""}`}
    >
      {text ? renderWithLinks(text) : "\u00A0"}
    </div>
  );
}
