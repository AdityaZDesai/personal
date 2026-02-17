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
import {
  initAudio,
  playKeypress,
  playEnter,
  playError,
  startAmbient,
  stopAmbient,
  setMuted,
  isMuted,
  loadMutedState,
} from "@/lib/sounds";

interface HistoryEntry {
  cwd: string;
  command: string;
  output: OutputLineType[];
  isBlock?: boolean;
}

const ASCII_ART_LINES = [
  {
    text: " \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557",
    className: "text-gradient-1",
  },
  {
    text: "\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551",
    className: "text-gradient-2",
  },
  {
    text: "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551",
    className: "text-gradient-3",
  },
  {
    text: "\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551",
    className: "text-gradient-4",
  },
  {
    text: "\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2551",
    className: "text-gradient-5",
  },
  {
    text: "\u255a\u2550\u255d  \u255a\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d",
    className: "text-gradient-6",
  },
];

const WELCOME_LINES: OutputLineType[] = [
  { text: "" },
  { text: "" },
  {
    text: "Welcome to my interactive terminal portfolio.",
    className: "text-terminal-green",
  },
  {
    text: "Explore my work, experience, and more with Unix commands.",
    className: "text-terminal-gray",
  },
  { text: "" },
  {
    text: "Type 'help' to see available commands.",
    className: "text-terminal-gray",
  },
  {
    text: "Type 'ls' to start exploring.",
    className: "text-terminal-gray",
  },
  { text: "" },
  { text: "" },
];

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState("");
  const [soundMuted, setSoundMuted] = useState(false);
  const audioInitialized = useRef(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMutedState();
    setSoundMuted(isMuted());
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioInitialized.current) {
      const ok = initAudio();
      if (ok) {
        audioInitialized.current = true;
        if (!isMuted()) {
          startAmbient();
        }
      }
    }
  }, []);

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

  const handleToggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      ensureAudio();
      const newMuted = !soundMuted;
      setSoundMuted(newMuted);
      setMuted(newMuted);
      if (newMuted) {
        stopAmbient();
      } else {
        startAmbient();
      }
    },
    [soundMuted, ensureAudio]
  );

  const handleSubmit = useCallback(() => {
    ensureAudio();
    playEnter();

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

    if (result.isError) {
      playError();
    }

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
  }, [currentInput, cwd, commandHistory, ensureAudio]);

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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      ensureAudio();
      playKeypress();
      setCurrentInput(e.target.value);
    },
    [ensureAudio]
  );

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-[#0d0d0d] p-0 sm:p-4"
      onClick={handleTerminalClick}
    >
      {/* Terminal container */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-none border-0 border-[#262626] bg-[#141414] sm:h-[calc(100vh-32px)] sm:max-w-[1200px] sm:rounded-xl sm:border">
        {/* Title bar */}
        <div className="flex h-9 sm:h-10 flex-shrink-0 items-center justify-between border-b border-[#262626] bg-[#0d0d0d] px-3 sm:px-5 sm:rounded-t-xl">
          <div className="flex items-center min-w-0">
            <div className="mr-3 sm:mr-4 flex gap-1.5 sm:gap-2 shrink-0">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#e5534b] transition-opacity hover:opacity-80" />
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#e5a855] transition-opacity hover:opacity-80" />
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#7dce82] transition-opacity hover:opacity-80" />
            </div>
            <span className="text-[10px] sm:text-xs text-terminal-gray tracking-wide truncate">
              visitor@aditya: {cwd}
            </span>
          </div>
          <button
            onClick={handleToggleMute}
            className="text-terminal-gray hover:text-terminal-white transition-colors text-sm px-2 py-1 rounded select-none"
            title={soundMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {soundMuted ? "\u{1F507}" : "\u{1F50A}"}
          </button>
        </div>

        {/* Scrollable output area */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto scroll-smooth px-3 py-4 sm:px-8 sm:py-8 pb-4 font-mono text-xs sm:text-sm"
        >
          {/* Banner */}
          <div className="animate-fade-in pt-6 pl-1 sm:pt-16 sm:pl-8">
            {/* ASCII art rendered with tight line-height so box-drawing chars connect */}
            <div className="ascii-banner mb-6 sm:mb-10 overflow-x-auto font-mono whitespace-pre text-[10px] sm:text-base md:text-lg leading-[0.75] tracking-[-0.1em] animate-banner-glow">
              {ASCII_ART_LINES.map((line, i) => (
                <div key={`art-${i}`} className={line.className}>
                  {line.text}
                </div>
              ))}
            </div>
            {/* Welcome text */}
            {WELCOME_LINES.map((line, i) => (
              <OutputLine
                key={`welcome-${i}`}
                text={line.text}
                className={line.className}
              />
            ))}
          </div>

          {/* Command history */}
          {history.map((entry, i) => (
            <div key={`entry-${i}`} className="mb-6 animate-fade-in">
              <PromptLine cwd={entry.cwd} command={entry.command} />
              {entry.output.length > 0 &&
                (entry.isBlock ? (
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
                ))}
            </div>
          ))}
        </div>

        {/* Fixed bottom input bar */}
        <div className="animate-slide-up flex-shrink-0 border-t border-[#262626] bg-[#0d0d0d] px-3 py-2 sm:rounded-b-xl sm:px-6 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-[#141414] px-3 py-2 sm:px-4 sm:py-2.5 ring-1 ring-[#262626] transition-all duration-200 focus-within:ring-[#da7756]/50">
            <span className="text-terminal-orange font-bold text-sm sm:text-base select-none">
              &gt;
            </span>
            <div className="relative flex-1 min-w-0">
              <span className="text-terminal-white text-xs sm:text-sm leading-7 break-all">
                {currentInput}
              </span>
              <span className="cursor-blink ml-[1px] inline-block h-[14px] sm:h-[18px] w-[6px] sm:w-[8px] translate-y-[3px] bg-[#e2e8f0]" />
              <input
                ref={inputRef}
                type="text"
                className="absolute inset-0 h-full w-full opacity-0"
                value={currentInput}
                onChange={handleInputChange}
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
        <div className="flex-shrink-0 bg-[#0d0d0d] px-3 py-1.5 text-[10px] text-terminal-gray sm:hidden">
          Tap anywhere to type
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
