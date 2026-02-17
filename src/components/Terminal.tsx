"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import OutputLine from "./OutputLine";
import PromptLine from "./PromptLine";
import {
  executeCommand,
  setCommandHistoryRef,
  getCommandNames,
  type OutputLine as OutputLineType,
} from "@/lib/commands";
import { getCompletions } from "@/lib/filesystem";

interface HistoryEntry {
  cwd: string;
  command: string;
  output: OutputLineType[];
}

const ASCII_BANNER: OutputLineType[] = [
  { text: "" },
  { text: "    ___       ___  __                ____                   _", className: "text-terminal-cyan" },
  { text: "   /   | ____/ (_)/ /___  __ ____ _ / __ \\ ___   ___  ____ (_)", className: "text-terminal-cyan" },
  { text: "  / /| |/ __  / // __/ / / / __  // / / // _ \\ / __// __  // /", className: "text-terminal-cyan" },
  { text: " / ___ / /_/ / // /_ / /_/ / /_/ // /_/ //  __/(__  ) /_/ // /", className: "text-terminal-cyan" },
  { text: "/_/  |_\\__,_/_/ \\__/ \\__, /\\__,_//_____/ \\___//____/\\__,_//_/", className: "text-terminal-cyan" },
  { text: "                    /____/", className: "text-terminal-cyan" },
  { text: "" },
  { text: "  Welcome to my interactive terminal portfolio.", className: "text-terminal-green" },
  { text: "  Type 'help' to see available commands.", className: "text-terminal-gray" },
  { text: "  Type 'ls' to start exploring.", className: "text-terminal-gray" },
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
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
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
    const result = executeCommand(input, cwd);

    if (result.clear) {
      setHistory([]);
      return;
    }

    const entry: HistoryEntry = {
      cwd,
      command: input,
      output: result.output,
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
      setCurrentInput(parts.join(" ") + (completions[0].endsWith("/") ? "" : " "));
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
      className="flex h-screen w-screen flex-col bg-[#1a1b26] text-sm"
      onClick={handleTerminalClick}
    >
      {/* Title bar */}
      <div className="flex h-8 flex-shrink-0 items-center bg-[#16161e] px-4">
        <div className="flex gap-2 mr-4">
          <div className="h-3 w-3 rounded-full bg-[#f7768e]" />
          <div className="h-3 w-3 rounded-full bg-[#e0af68]" />
          <div className="h-3 w-3 rounded-full bg-[#9ece6a]" />
        </div>
        <span className="text-xs text-terminal-gray">
          visitor@aditya: {cwd}
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono"
      >
        {/* Banner */}
        {bannerLines.map((line, i) => (
          <OutputLine key={`banner-${i}`} text={line.text} className={line.className} />
        ))}

        {/* Command history */}
        {history.map((entry, i) => (
          <div key={`entry-${i}`}>
            <PromptLine cwd={entry.cwd} command={entry.command} />
            {entry.output.map((line, j) => (
              <OutputLine key={`output-${i}-${j}`} text={line.text} className={line.className} />
            ))}
          </div>
        ))}

        {/* Active prompt */}
        <div className="flex leading-6">
          <span className="text-terminal-green font-bold">visitor</span>
          <span className="text-terminal-gray">@</span>
          <span className="text-terminal-magenta font-bold">aditya</span>
          <span className="text-terminal-gray">:</span>
          <span className="text-terminal-blue font-bold">{cwd}</span>
          <span className="text-terminal-white mr-2">$</span>
          <span className="relative">
            <span className="text-terminal-white">{currentInput}</span>
            <span className="cursor-blink ml-[1px] inline-block h-[18px] w-[8px] translate-y-[2px] bg-[#c0caf5]" />
          </span>
        </div>

        {/* Hidden input for capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 h-0 w-0"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {/* Mobile hint */}
      <div className="flex-shrink-0 bg-[#16161e] px-4 py-2 text-xs text-terminal-gray sm:hidden">
        Tap anywhere to type. Best viewed on desktop.
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
