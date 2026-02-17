"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import OutputLine from "./OutputLine";
import PromptLine from "./PromptLine";
import {
  executeCommand,
  setCommandHistoryRef,
  getCommandNames,
  type OutputLine as OutputLineType,
  type CommandResult,
} from "@/lib/commands";
import { getCompletions } from "@/lib/filesystem";

interface HistoryEntry {
  cwd: string;
  command: string;
  output: OutputLineType[];
  isBlock?: boolean;
}

const ASCII_BANNER: OutputLineType[] = [
  { text: "" },
  { text: "" },
  {
    text: "    ___       ___  __                ____                   _",
    className: "text-terminal-cyan animate-banner-glow",
  },
  {
    text: "   /   | ____/ (_)/ /___  __ ____ _ / __ \\ ___   ___  ____ (_)",
    className: "text-terminal-cyan animate-banner-glow",
  },
  {
    text: "  / /| |/ __  / // __/ / / / __  // / / // _ \\ / __// __  // /",
    className: "text-terminal-cyan animate-banner-glow",
  },
  {
    text: " / ___ / /_/ / // /_ / /_/ / /_/ // /_/ //  __/(__  ) /_/ // /",
    className: "text-terminal-cyan animate-banner-glow",
  },
  {
    text: "/_/  |_\\__,_/_/ \\__/ \\__, /\\__,_//_____/ \\___//____/\\__,_//_/",
    className: "text-terminal-cyan animate-banner-glow",
  },
  {
    text: "                    /____/",
    className: "text-terminal-cyan animate-banner-glow",
  },
  { text: "" },
  { text: "" },
  {
    text: "  Welcome to my interactive terminal portfolio.",
    className: "text-terminal-green",
  },
  { text: "" },
  {
    text: "  Type 'help' to see available commands.",
    className: "text-terminal-gray",
  },
  {
    text: "  Type 'ls' to start exploring.",
    className: "text-terminal-gray",
  },
  { text: "" },
  { text: "" },
];

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [bannerLines] = useState<OutputLineType[]>(ASCII_BANNER);
  const [currentInput, setCurrentInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState("");

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      requestAnimationFrame(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const input = currentInput;
    setCurrentInput("");
    setHistoryIndex(-1);
    setSavedInput("");

    const newCommandHistory = input.trim()
      ? [...commandHistory, input.trim()]
      : commandHistory;

    if (input.trim()) {
      setCommandHistory(newCommandHistory);
    }

    setCommandHistoryRef(newCommandHistory);
    const result: CommandResult = executeCommand(input, cwd);

    if (result.clear) {
      setHistory([]);
      return;
    }

    const entry: HistoryEntry = {
      cwd,
      command: input,
      output: result.output,
      isBlock: result.isBlock,
    };

    setHistory((prev) => [...prev, entry]);

    if (result.newCwd) {
      setCwd(result.newCwd);
    }
  }, [currentInput, cwd, commandHistory]);

  const handleTabCompletion = useCallback(() => {
    const parts = currentInput.trimEnd().split(/\s+/);
    if (parts.length < 2) {
      const partial = parts[0] || "";
      const cmdNames = getCommandNames();
      const matches = cmdNames.filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        setCurrentInput(matches[0] + " ");
      }
      return;
    }

    const partial = parts[parts.length - 1];
    const completions = getCompletions(cwd, partial);

    if (completions.length === 1) {
      parts[parts.length - 1] = completions[0];
      setCurrentInput(
        parts.join(" ") + (completions[0].endsWith("/") ? "" : " ")
      );
    } else if (completions.length > 1) {
      const commonPrefix = findCommonPrefix(completions);
      if (commonPrefix.length > partial.length) {
        parts[parts.length - 1] = commonPrefix;
        setCurrentInput(parts.join(" "));
      }
    }
  }, [currentInput, cwd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Tab") {
        e.preventDefault();
        handleTabCompletion();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        if (historyIndex === -1) {
          setSavedInput(currentInput);
          const newIndex = commandHistory.length - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        } else if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setCurrentInput(savedInput);
        }
      } else if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        setCurrentInput("");
        setHistoryIndex(-1);
        setHistory((prev) => [
          ...prev,
          { cwd, command: currentInput + "^C", output: [] },
        ]);
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setHistory([]);
      }
    },
    [
      handleSubmit,
      handleTabCompletion,
      commandHistory,
      historyIndex,
      currentInput,
      savedInput,
      cwd,
    ]
  );

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-[#0f0f14] p-0 sm:p-4"
      onClick={handleTerminalClick}
    >
      {/* Terminal container */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-none border-0 border-[#292e42] bg-[#1a1b26] sm:h-[calc(100vh-32px)] sm:max-w-[1200px] sm:rounded-xl sm:border">
        {/* Title bar */}
        <div className="flex h-10 flex-shrink-0 items-center border-b border-[#292e42] bg-[#16161e] px-5 sm:rounded-t-xl">
          <div className="mr-4 flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#f7768e] transition-opacity hover:opacity-80" />
            <div className="h-3 w-3 rounded-full bg-[#e0af68] transition-opacity hover:opacity-80" />
            <div className="h-3 w-3 rounded-full bg-[#9ece6a] transition-opacity hover:opacity-80" />
          </div>
          <span className="text-xs text-terminal-gray tracking-wide">
            visitor@aditya: {cwd}
          </span>
        </div>

        {/* Scrollable output area */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto scroll-smooth px-5 py-5 sm:px-6 sm:py-6 font-mono text-sm"
        >
          {/* Banner */}
          <div className="animate-fade-in">
            {bannerLines.map((line, i) => (
              <OutputLine
                key={`banner-${i}`}
                text={line.text}
                className={line.className}
              />
            ))}
          </div>

          {/* Command history */}
          {history.map((entry, i) => (
            <div key={`entry-${i}`} className="mb-5 animate-fade-in">
              <PromptLine cwd={entry.cwd} command={entry.command} />
              {entry.output.length > 0 && (
                entry.isBlock ? (
                  <div className="output-block mt-2">
                    {entry.output.map((line, j) => (
                      <OutputLine
                        key={`output-${i}-${j}`}
                        text={line.text}
                        className={line.className}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-1">
                    {entry.output.map((line, j) => (
                      <OutputLine
                        key={`output-${i}-${j}`}
                        text={line.text}
                        className={line.className}
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* Fixed bottom input bar */}
        <div className="animate-slide-up flex-shrink-0 border-t border-[#292e42] bg-[#16161e] px-5 py-3 sm:rounded-b-xl sm:px-6">
          <div className="flex items-center gap-3 rounded-lg bg-[#1a1b26] px-4 py-2.5 ring-1 ring-[#292e42] transition-all duration-200 focus-within:ring-[#7aa2f7]/50">
            <span className="text-terminal-blue font-bold text-base select-none">&gt;</span>
            <div className="relative flex-1">
              <span className="text-terminal-white text-sm leading-7">{currentInput}</span>
              <span className="cursor-blink ml-[1px] inline-block h-[18px] w-[8px] translate-y-[3px] bg-[#c0caf5]" />
              <input
                ref={inputRef}
                type="text"
                className="absolute inset-0 h-full w-full opacity-0"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            <span className="hidden text-xs text-terminal-gray sm:block select-none">
              {cwd}
            </span>
          </div>
        </div>

        {/* Mobile hint */}
        <div className="flex-shrink-0 bg-[#16161e] px-5 py-2 text-xs text-terminal-gray sm:hidden">
          Tap anywhere to type. Best viewed on desktop.
        </div>
      </div>
    </div>
  );
}

function findCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}
