import React from "react";

interface OutputLineProps {
  text: string;
  className?: string;
  command?: string;
  href?: string;
  actionLabel?: string;
  onCommand?: (command: string) => void;
}

const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;
const URL_TEST_REGEX = /^https?:\/\/[^\s]+$/;
const EMAIL_TEST_REGEX = /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/;

function renderWithLinks(text: string) {
  const parts = text.split(URL_SPLIT_REGEX);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (URL_TEST_REGEX.test(part) || EMAIL_TEST_REGEX.test(part)) {
      const isEmail = EMAIL_TEST_REGEX.test(part);
      return (
        <a
          key={i}
          href={isEmail ? `mailto:${part}` : part}
          target={isEmail ? undefined : "_blank"}
          rel={isEmail ? undefined : "noopener noreferrer"}
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

export default function OutputLine({
  text,
  className,
  command,
  href,
  actionLabel,
  onCommand,
}: OutputLineProps) {
  const content = text ? renderWithLinks(text) : "\u00A0";
  const actionContent = text || "\u00A0";
  const sharedClassName = `output-line whitespace-pre-wrap break-words leading-7 py-[2px] ${className || ""}`;

  if (command && onCommand) {
    return (
      <button
        type="button"
        className={`${sharedClassName} output-action block text-left`}
        onClick={(event) => {
          event.stopPropagation();
          onCommand(command);
        }}
        aria-label={actionLabel || `Run ${command}`}
      >
        {actionContent}
      </button>
    );
  }

  if (href) {
    const isEmail = href.startsWith("mailto:");
    return (
      <a
        href={href}
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noopener noreferrer"}
        className={`${sharedClassName} output-action block`}
        onClick={(event) => event.stopPropagation()}
        aria-label={actionLabel}
      >
        {actionContent}
      </a>
    );
  }

  return (
    <div className={sharedClassName}>{content}</div>
  );
}
