import {
  aboutText,
  projects,
  experiences,
  skillCategories,
  hobbiesText,
  beliefsText,
  links,
  type Project,
  type Experience,
} from "./content";

export interface FSNode {
  name: string;
  type: "file" | "directory";
  children?: FSNode[];
  content?: string[];
}

function formatProject(p: Project): string[] {
  const lines: string[] = [];
  lines.push(`  ${p.name}`);
  lines.push(`  ${"─".repeat(p.name.length)}`);
  lines.push("");
  lines.push(`  ${p.description}`);
  lines.push("");
  lines.push(`  Tech: ${p.tech.join(", ")}`);
  if (p.url) lines.push(`  URL:  ${p.url}`);
  if (p.github) lines.push(`  Repo: ${p.github}`);
  lines.push("");
  return lines;
}

function formatExperience(e: Experience): string[] {
  const lines: string[] = [];
  lines.push(`  ${e.role} @ ${e.company}`);
  lines.push(`  ${e.dates}`);
  lines.push(`  ${"─".repeat(Math.max(e.role.length + e.company.length + 3, e.dates.length))}`);
  lines.push("");
  for (const bullet of e.bullets) {
    lines.push(`  • ${bullet}`);
  }
  lines.push("");
  return lines;
}

function formatSkills(): string[] {
  const lines: string[] = [];
  lines.push("");
  for (const cat of skillCategories) {
    const padded = cat.name.padEnd(16);
    lines.push(`  ${padded}${cat.skills.join(", ")}`);
  }
  lines.push("");
  return lines;
}

function formatLinks(): string[] {
  const lines: string[] = [];
  lines.push("");
  lines.push("  Available links (use 'open <name>' to visit):");
  lines.push("");
  for (const link of links) {
    const padded = link.name.padEnd(12);
    lines.push(`    ${padded}${link.label}`);
  }
  lines.push("");
  return lines;
}

function textToLines(text: string): string[] {
  return text.split("\n").map((line) => line);
}

function buildFileSystem(): FSNode {
  const root: FSNode = {
    name: "~",
    type: "directory",
    children: [
      {
        name: "about.txt",
        type: "file",
        content: [...textToLines(aboutText), ...formatLinks()],
      },
      {
        name: "projects",
        type: "directory",
        children: projects.map((p) => ({
          name: `${p.slug}.txt`,
          type: "file" as const,
          content: formatProject(p),
        })),
      },
      {
        name: "experience",
        type: "directory",
        children: experiences.map((e) => ({
          name: `${e.slug}.txt`,
          type: "file" as const,
          content: formatExperience(e),
        })),
      },
      {
        name: "skills.txt",
        type: "file",
        content: formatSkills(),
      },
      {
        name: "hobbies.txt",
        type: "file",
        content: textToLines(hobbiesText),
      },
      {
        name: "beliefs.txt",
        type: "file",
        content: textToLines(beliefsText),
      },
    ],
  };
  return root;
}

export const fileSystem = buildFileSystem();

export function getNodeAtPath(path: string): FSNode | null {
  const resolved = normalizePath(path);
  if (resolved === "~") return fileSystem;

  const parts = resolved.replace("~/", "").split("/").filter(Boolean);
  let current: FSNode = fileSystem;

  for (const part of parts) {
    if (current.type !== "directory" || !current.children) return null;
    const child = current.children.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }

  return current;
}

export function normalizePath(path: string): string {
  let resolved = path.replace(/\/+/g, "/").replace(/\/$/, "");
  if (!resolved) return "~";

  if (resolved === "~" || resolved === "/") return "~";
  if (!resolved.startsWith("~")) {
    resolved = "~/" + resolved;
  }

  const parts = resolved.split("/");
  const stack: string[] = [];

  for (const part of parts) {
    if (part === "..") {
      if (stack.length > 1) stack.pop();
    } else if (part !== ".") {
      stack.push(part);
    }
  }

  return stack.join("/") || "~";
}

export function resolvePath(cwd: string, inputPath: string): string {
  if (inputPath === "~" || inputPath === "/") return "~";
  if (inputPath.startsWith("~/") || inputPath.startsWith("/")) {
    return normalizePath(inputPath.replace(/^\//, "~/"));
  }

  if (inputPath === "..") {
    const parts = cwd.split("/");
    if (parts.length > 1) parts.pop();
    return parts.join("/") || "~";
  }

  if (inputPath.startsWith("../")) {
    const cwdParts = cwd.split("/");
    if (cwdParts.length > 1) cwdParts.pop();
    const rest = inputPath.replace(/^\.\.\//, "");
    return normalizePath(cwdParts.join("/") + "/" + rest);
  }

  if (inputPath === ".") return cwd;
  if (inputPath.startsWith("./")) {
    return normalizePath(cwd + "/" + inputPath.slice(2));
  }

  return normalizePath(cwd + "/" + inputPath);
}

export function listDirectory(node: FSNode): string[] {
  if (node.type !== "directory" || !node.children) return [];
  return node.children.map((child) =>
    child.type === "directory" ? child.name + "/" : child.name
  );
}

export function readFile(node: FSNode): string[] | null {
  if (node.type !== "file") return null;
  return node.content || [];
}

export function getTreeLines(
  node: FSNode,
  prefix: string = "",
  isLast: boolean = true
): string[] {
  const lines: string[] = [];
  const connector = isLast ? "└── " : "├── ";
  const displayName =
    node.type === "directory" ? node.name + "/" : node.name;

  if (node.name === "~") {
    lines.push("~");
  } else {
    lines.push(prefix + connector + displayName);
  }

  if (node.type === "directory" && node.children) {
    const childPrefix =
      node.name === "~" ? "" : prefix + (isLast ? "    " : "│   ");
    node.children.forEach((child, index) => {
      const childIsLast = index === node.children!.length - 1;
      lines.push(...getTreeLines(child, childPrefix, childIsLast));
    });
  }

  return lines;
}

export function getCompletions(cwd: string, partial: string): string[] {
  const cwdNode = getNodeAtPath(cwd);
  if (!cwdNode || cwdNode.type !== "directory" || !cwdNode.children) return [];

  if (partial.includes("/")) {
    const lastSlash = partial.lastIndexOf("/");
    const dirPart = partial.substring(0, lastSlash) || ".";
    const filePart = partial.substring(lastSlash + 1);
    const resolvedDir = resolvePath(cwd, dirPart);
    const dirNode = getNodeAtPath(resolvedDir);
    if (!dirNode || dirNode.type !== "directory" || !dirNode.children)
      return [];
    return dirNode.children
      .filter((c) => c.name.startsWith(filePart))
      .map((c) => {
        const suffix = c.type === "directory" ? "/" : "";
        return dirPart + "/" + c.name + suffix;
      });
  }

  return cwdNode.children
    .filter((c) => c.name.startsWith(partial))
    .map((c) => {
      const suffix = c.type === "directory" ? "/" : "";
      return c.name + suffix;
    });
}
