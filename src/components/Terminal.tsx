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
  getMutedState,
} from "@/lib/sounds";

interface HistoryEntry {
  cwd: string;
  command: string;
  output: OutputLineType[];
  isBlock?: boolean;
}

const ASCII_ART_LINES = [
  {
    text: " █████╗   ██████╗   ██╗",
    className: "text-gradient-1",
  },
  {
    text: "██╔══██╗  ██╔══██╗  ██║",
    className: "text-gradient-2",
  },
  {
    text: "██║  ██║  ██║  ██║  ██║",
    className: "text-gradient-3",
  },
  {
    text: "███████║  ██║  ██║  ██║",
    className: "text-gradient-4",
  },
  {
    text: "██║  ██║  ██║  ██║  ██║",
    className: "text-gradient-5",
  },
  {
    text: "██║  ██║  ██████╔╝  ██║",
    className: "text-gradient-6",
  },
  {
    text: "╚═╝  ╚═╝  ╚═════╝   ╚═╝",
    className: "text-gradient-7",
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
    text: "Explore my work with the quick actions below or Unix commands.",
    className: "text-terminal-gray",
  },
  { text: "" },
  {
    text: "Everything is clickable, so typing is optional.",
    className: "text-terminal-gray",
  },
  {
    text: "Run 'help' to see every available command.",
    className: "text-terminal-gray",
  },
  { text: "" },
];

const QUICK_ACTIONS = [
  { label: "About", command: "cat ~/about.txt" },
  { label: "Projects", command: "ls ~/projects" },
  { label: "Experience", command: "ls ~/experience" },
  { label: "Skills", command: "cat ~/skills.txt" },
  { label: "Education", command: "cat ~/education.txt" },
  { label: "Contact", command: "cat ~/contact.txt" },
  { label: "Help", command: "help" },
] as const;

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState("");
  const [soundMuted, setSoundMuted] = useState(getMutedState);
  const audioInitialized = useRef(false);
  const commandHistoryRef = useRef<string[]>([]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (getMutedState()) return;

    // Browsers may block unmuted autoplay, so retry on the first interaction.
    startAmbient();
    const unlockAudio = () => {
      initAudio();
      startAmbient();
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioInitialized.current) {
      const ok = initAudio();
      if (ok) {
        audioInitialized.current = true;
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
    if (history.length > 0) {
      scrollToBottom();
    }
  }, [history, scrollToBottom]);

  const handleToggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newMuted = !soundMuted;
      setSoundMuted(newMuted);
      setMuted(newMuted);
      if (newMuted) {
        stopAmbient();
      } else {
        ensureAudio();
        startAmbient();
      }
    },
    [soundMuted, ensureAudio]
  );

  const runCommand = useCallback((input: string) => {
    playEnter();

    setCurrentInput("");
    setHistoryIndex(-1);
    setSavedInput("");

    const existingHistory = commandHistoryRef.current;
    const newCommandHistory = input.trim()
      ? [...existingHistory, input.trim()]
      : existingHistory;

    if (input.trim()) {
      commandHistoryRef.current = newCommandHistory;
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
  }, [cwd]);

  const handleSubmit = useCallback(() => {
    runCommand(currentInput);
  }, [currentInput, runCommand]);

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
      playKeypress();
      setCurrentInput(e.target.value);
    },
    []
  );

  return (
    <main
      className="terminal-page flex h-[100dvh] w-full min-w-0 items-center justify-center bg-[#0d0d0d] p-0 sm:p-4"
    >
      {/* Terminal container */}
      <section
        className="terminal-window flex h-full w-full min-w-0 flex-col overflow-hidden rounded-none border-0 border-[#262626] bg-[#141414] sm:h-[calc(100dvh-32px)] sm:max-w-[1200px] sm:rounded-xl sm:border"
        aria-labelledby="portfolio-title"
      >
        <h1 id="portfolio-title" className="sr-only">
          Aditya Desai&apos;s terminal portfolio
        </h1>
        {/* Title bar */}
        <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-[#262626] bg-[#0d0d0d] px-3 sm:px-5 sm:rounded-t-xl">
          <div className="flex items-center min-w-0">
            <div
              className="mr-3 sm:mr-4 flex gap-1.5 sm:gap-2 shrink-0"
              aria-hidden="true"
            >
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#e5534b] transition-opacity hover:opacity-80" />
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#e5a855] transition-opacity hover:opacity-80" />
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#7dce82] transition-opacity hover:opacity-80" />
            </div>
            <span className="text-xs text-terminal-gray tracking-wide truncate">
              visitor@aditya: {cwd}
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleMute}
            className="sound-toggle text-terminal-gray hover:text-terminal-white transition-colors text-sm rounded select-none"
            title={soundMuted ? "Unmute sounds" : "Mute sounds"}
            aria-label={soundMuted ? "Enable terminal sounds" : "Disable terminal sounds"}
            aria-pressed={!soundMuted}
          >
            <span aria-hidden="true">{soundMuted ? "\u{1F507}" : "\u{1F50A}"}</span>
          </button>
        </div>

        {/* Scrollable output area */}
        <div
          ref={terminalRef}
          className="terminal-output min-w-0 flex-1 overflow-y-auto scroll-smooth px-3 py-4 sm:px-8 sm:py-8 pb-4 font-mono text-xs sm:text-sm"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {/* Banner */}
          <div className="terminal-intro animate-fade-in pt-2 pl-1 sm:pt-16 sm:pl-8">
            {/* ASCII art rendered with tight line-height so box-drawing chars connect */}
            <div
              className="ascii-banner mb-6 sm:mb-10 overflow-x-auto font-mono whitespace-pre text-sm sm:text-lg md:text-xl leading-[0.75] tracking-[-0.1em] animate-banner-glow"
              aria-hidden="true"
            >
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
            <nav
              className="quick-actions mb-8 flex flex-wrap gap-2"
              aria-label="Portfolio sections"
            >
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.command}
                  type="button"
                  className="quick-action"
                  onClick={() => runCommand(action.command)}
                >
                  <span className="mr-1.5" aria-hidden="true">
                    $
                  </span>
                  {action.label}
                </button>
              ))}
            </nav>
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
                        command={line.command}
                        href={line.href}
                        actionLabel={line.actionLabel}
                        onCommand={runCommand}
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
                        command={line.command}
                        href={line.href}
                        actionLabel={line.actionLabel}
                        onCommand={runCommand}
                      />
                    ))}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Fixed bottom input bar */}
        <div className="terminal-command-bar animate-slide-up flex-shrink-0 border-t border-[#262626] bg-[#0d0d0d] px-3 py-2 sm:rounded-b-xl sm:px-6 sm:py-3">
          <form
            className="terminal-command-form flex items-center gap-2 sm:gap-3 rounded-lg bg-[#141414] px-3 py-2 sm:px-4 sm:py-2.5 ring-1 ring-[#262626] transition-all duration-200 focus-within:ring-[#da7756]/70"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <label htmlFor="terminal-command" className="sr-only">
              Terminal command
            </label>
            <span
              className="text-terminal-orange font-bold text-sm sm:text-base select-none"
              aria-hidden="true"
            >
              &gt;
            </span>
            <input
              id="terminal-command"
              ref={inputRef}
              type="text"
              className="terminal-input min-w-0 flex-1 bg-transparent text-xs leading-7 text-terminal-white outline-none sm:text-sm"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              aria-describedby="terminal-help"
              placeholder="Type a command"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <span className="hidden text-xs text-terminal-gray sm:block select-none">
              {cwd}
            </span>
            <button type="submit" className="run-command">
              Run
            </button>
          </form>
          <p id="terminal-help" className="sr-only">
            Enter a Unix-style command, or use the portfolio section buttons above.
            Use Tab to autocomplete and the arrow keys to navigate command history.
          </p>
        </div>

        {/* Mobile hint */}
        <div className="mobile-hint flex-shrink-0 bg-[#0d0d0d] px-3 py-1.5 text-xs text-terminal-gray sm:hidden">
          Choose a section or enter a command
        </div>
      </section>
    </main>
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
