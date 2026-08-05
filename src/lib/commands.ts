import {
  getNodeAtPath,
  resolvePath,
  listDirectory,
  readFile,
  getTreeLines,
} from "./filesystem";
import { links } from "./content";

export interface OutputLine {
  text: string;
  className?: string;
  command?: string;
  href?: string;
  actionLabel?: string;
}

export interface CommandResult {
  output: OutputLine[];
  newCwd?: string;
  clear?: boolean;
  isBlock?: boolean;
  isError?: boolean;
}

type CommandHandler = (args: string[], cwd: string) => CommandResult;

const commands: Record<string, CommandHandler> = {
  help: handleHelp,
  ls: handleLs,
  cd: handleCd,
  cat: handleCat,
  pwd: handlePwd,
  clear: handleClear,
  whoami: handleWhoami,
  tree: handleTree,
  open: handleOpen,
  history: handleHistory,
  echo: handleEcho,
};

function handleHelp(): CommandResult {
  const output: OutputLine[] = [
    { text: "" },
    { text: " Available Commands:", className: "text-terminal-green font-bold" },
    { text: "" },
    { text: "  help         Show this help message", command: "help" },
    { text: "  ls [dir]     List directory contents", command: "ls" },
    { text: "  cd <dir>     Change directory" },
    { text: "  cat <file>   Display file contents" },
    { text: "  pwd          Print working directory", command: "pwd" },
    { text: "  tree [dir]   Show directory tree", command: "tree" },
    { text: "  whoami       About the visitor", command: "whoami" },
    { text: "  open <name>  Open a contact link", command: "open" },
    { text: "  history      Show command history", command: "history" },
    { text: "  clear        Clear the terminal", command: "clear" },
    { text: "  echo <text>  Print text" },
    { text: "" },
    { text: " Navigation Tips:", className: "text-terminal-yellow font-bold" },
    { text: "" },
    { text: "  Tab          Auto-complete names" },
    { text: "  Up/Down      Navigate command history" },
    { text: "  cd ..        Go up one directory" },
    { text: "  cd ~         Go to home directory" },
    { text: "" },
    {
      text: " Try: cat projects/harmonica.txt",
      className: "text-terminal-gray",
      command: "cat projects/harmonica.txt",
    },
    { text: "" },
  ];
  return { output, isBlock: true };
}

function handleLs(args: string[], cwd: string): CommandResult {
  const target = args[0] || cwd;
  const resolved = args[0] ? resolvePath(cwd, args[0]) : cwd;
  const node = getNodeAtPath(resolved);

  if (!node) {
    return {
      output: [
        {
          text: `ls: cannot access '${target}': No such file or directory`,
          className: "text-terminal-red",
        },
      ],
      isError: true,
    };
  }

  if (node.type === "file") {
    return {
      output: [
        {
          text: `  ${node.name}`,
          command: `cat ${resolved}`,
          actionLabel: `Read ${node.name}`,
        },
      ],
    };
  }

  const entries = listDirectory(node);
  if (entries.length === 0 || !node.children) {
    return { output: [{ text: "  (empty directory)", className: "text-terminal-gray" }] };
  }

  const output: OutputLine[] = node.children.map((entry) => {
    const entryPath = resolved === "~" ? `~/${entry.name}` : `${resolved}/${entry.name}`;
    const isDirectory = entry.type === "directory";
    return {
      text: `  ${entry.name}${isDirectory ? "/" : ""}`,
      className: isDirectory
        ? "text-terminal-yellow font-bold"
        : "text-terminal-white",
      command: isDirectory ? `ls ${entryPath}` : `cat ${entryPath}`,
      actionLabel: isDirectory
        ? `Explore ${entry.name}`
        : `Read ${entry.name}`,
    };
  });

  return { output };
}

function handleCd(args: string[], cwd: string): CommandResult {
  if (args.length === 0 || args[0] === "~") {
    return { output: [], newCwd: "~" };
  }

  const resolved = resolvePath(cwd, args[0]);
  const node = getNodeAtPath(resolved);

  if (!node) {
    return {
      output: [
        {
          text: `cd: no such file or directory: ${args[0]}`,
          className: "text-terminal-red",
        },
      ],
      isError: true,
    };
  }

  if (node.type !== "directory") {
    return {
      output: [
        {
          text: `cd: not a directory: ${args[0]}`,
          className: "text-terminal-red",
        },
      ],
      isError: true,
    };
  }

  return { output: [], newCwd: resolved };
}

function handleCat(args: string[], cwd: string): CommandResult {
  if (args.length === 0) {
    return {
      output: [
        { text: "cat: missing file operand", className: "text-terminal-red" },
      ],
      isError: true,
    };
  }

  const resolved = resolvePath(cwd, args[0]);
  const node = getNodeAtPath(resolved);

  if (!node) {
    return {
      output: [
        {
          text: `cat: ${args[0]}: No such file or directory`,
          className: "text-terminal-red",
        },
      ],
      isError: true,
    };
  }

  if (node.type === "directory") {
    return {
      output: [
        {
          text: `cat: ${args[0]}: Is a directory`,
          className: "text-terminal-red",
        },
      ],
      isError: true,
    };
  }

  const content = readFile(node);
  if (!content) {
    return {
      output: [{ text: "  (empty file)", className: "text-terminal-gray" }],
    };
  }

  const output: OutputLine[] = content.map((line) => {
    if (line.match(/^\s{2}[A-Z][\w\s]+:$/)) {
      return { text: line, className: "text-terminal-green font-bold" };
    }
    if (line.match(/^\s{2}─+$/)) {
      return { text: line, className: "text-terminal-gray" };
    }
    if (line.match(/https?:\/\/\S+/) || line.match(/\S+@\S+\.\S+/)) {
      return { text: line, className: "text-terminal-cyan" };
    }
    if (line.match(/^\s{2}•/)) {
      return { text: line, className: "text-terminal-white" };
    }
    if (line.match(/^\s{2}Tech:/)) {
      return { text: line, className: "text-terminal-yellow" };
    }
    if (line.match(/^\s{2}(URL|Repo):/)) {
      return { text: line, className: "text-terminal-cyan" };
    }
    if (line.match(/^\s{4}\w+\s{2,}/)) {
      return { text: line, className: "text-terminal-white" };
    }
    return { text: line };
  });

  return { output, isBlock: true };
}

function handlePwd(_args: string[], cwd: string): CommandResult {
  return {
    output: [{ text: cwd.replace("~", "/home/visitor"), className: "text-terminal-white" }],
  };
}

function handleClear(): CommandResult {
  return { output: [], clear: true };
}

function handleWhoami(): CommandResult {
  return {
    output: [
      { text: "" },
      { text: "  visitor", className: "text-terminal-green" },
      { text: "  Welcome to Aditya Desai's terminal portfolio.", className: "text-terminal-gray" },
      { text: "  Type 'help' for available commands.", className: "text-terminal-gray" },
      { text: "" },
    ],
  };
}

function handleTree(args: string[], cwd: string): CommandResult {
  let node;
  if (args.length === 0) {
    node = getNodeAtPath(cwd);
  } else {
    const resolved = resolvePath(cwd, args[0]);
    node = getNodeAtPath(resolved);
  }

  if (!node) {
    return {
      output: [
        {
          text: `tree: '${args[0] || cwd}': No such file or directory`,
          className: "text-terminal-red",
        },
      ],
      isError: true,
    };
  }

  if (node.type === "file") {
    return { output: [{ text: "  " + node.name }] };
  }

  const lines = getTreeLines(node);
  const output: OutputLine[] = lines.map((line) => {
    if (line.endsWith("/")) {
      return { text: "  " + line, className: "text-terminal-blue font-bold" };
    }
    return { text: "  " + line };
  });

  return { output, isBlock: true };
}

function handleOpen(args: string[]): CommandResult {
  if (args.length === 0) {
    const output: OutputLine[] = [
      { text: "" },
      { text: "  Usage: open <name>", className: "text-terminal-yellow" },
      { text: "" },
      { text: "  Available links:", className: "text-terminal-green" },
      { text: "" },
    ];
    for (const link of links) {
      output.push({
        text: `    ${link.name.padEnd(12)} ${link.label}`,
        href: link.url,
        actionLabel: `Open ${link.label}`,
      });
    }
    output.push({ text: "" });
    return { output, isBlock: true };
  }

  const name = args[0].toLowerCase();
  const link = links.find((l) => l.name.toLowerCase() === name);

  if (!link) {
    return {
      output: [
        {
          text: `open: '${args[0]}' is not a recognized link. Type 'open' to see available links.`,
          className: "text-terminal-red",
        },
      ],
      isError: true,
    };
  }

  if (typeof window !== "undefined") {
    if (link.url.startsWith("mailto:")) {
      window.location.href = link.url;
    } else {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  }

  return {
    output: [
      {
        text: `  Opening ${link.label}...`,
        className: "text-terminal-cyan",
        href: link.url,
        actionLabel: `Open ${link.label}`,
      },
    ],
  };
}

let commandHistoryRef: string[] = [];

export function setCommandHistoryRef(history: string[]) {
  commandHistoryRef = history;
}

function handleHistory(): CommandResult {
  if (commandHistoryRef.length === 0) {
    return {
      output: [{ text: "  No commands in history.", className: "text-terminal-gray" }],
    };
  }

  const output: OutputLine[] = commandHistoryRef.map((cmd, i) => ({
    text: `  ${String(i + 1).padStart(4)}  ${cmd}`,
  }));

  return { output };
}

function handleEcho(args: string[]): CommandResult {
  return {
    output: [{ text: "  " + args.join(" ") }],
  };
}

export function executeCommand(input: string, cwd: string): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: [] };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const handler = commands[cmd];
  if (!handler) {
    return {
      output: [
        {
          text: `  command not found: ${cmd}. Type 'help' for available commands.`,
          className: "text-terminal-red",
        },
      ],
      isError: true,
    };
  }

  return handler(args, cwd);
}

export function getCommandNames(): string[] {
  return Object.keys(commands);
}
