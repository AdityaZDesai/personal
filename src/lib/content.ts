export interface Project {
  name: string;
  slug: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
}

export interface Experience {
  company: string;
  slug: string;
  role: string;
  dates: string;
  bullets: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Link {
  name: string;
  url: string;
  label: string;
}

export const aboutText = `
  Hey, I'm Aditya Desai.

  I'm a software engineer who loves building things that live on the internet.
  I care deeply about clean code, great user experiences, and shipping products
  that make a difference.

  When I'm not coding, you'll find me exploring new tech, reading, or working
  on side projects that scratch a creative itch.

  Feel free to explore this terminal to learn more about me.
  Type 'help' to see what commands are available.

  Contact:
    Email    aditya@example.com
    GitHub   github.com/adityadesai
    LinkedIn linkedin.com/in/adityadesai
`;

export const projects: Project[] = [
  {
    name: "Terminal Portfolio",
    slug: "terminal-portfolio",
    description:
      "This very website! A terminal-style portfolio built with Next.js and TypeScript. Navigate with Unix commands to explore my work and background.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    url: "https://adityadesai.dev",
    github: "https://github.com/adityadesai/terminal-portfolio",
  },
  {
    name: "CloudSync",
    slug: "cloudsync",
    description:
      "A real-time file synchronization tool that keeps local and cloud storage in perfect harmony. Features conflict resolution and delta syncing.",
    tech: ["Go", "gRPC", "AWS S3", "SQLite"],
    github: "https://github.com/adityadesai/cloudsync",
  },
  {
    name: "DevBoard",
    slug: "devboard",
    description:
      "A developer dashboard that aggregates GitHub activity, CI/CD pipelines, and project metrics into a single unified view.",
    tech: ["React", "Node.js", "GraphQL", "PostgreSQL"],
    url: "https://devboard.example.com",
    github: "https://github.com/adityadesai/devboard",
  },
  {
    name: "Pixel Art Generator",
    slug: "pixel-art-generator",
    description:
      "A web-based pixel art editor with layers, animation support, and export to sprite sheets. Built for game developers and artists.",
    tech: ["TypeScript", "Canvas API", "Web Workers"],
    url: "https://pixels.example.com",
  },
];

export const experiences: Experience[] = [
  {
    company: "Acme Corp",
    slug: "acme-corp",
    role: "Senior Software Engineer",
    dates: "Jan 2024 - Present",
    bullets: [
      "Led development of a microservices platform serving 2M+ daily requests",
      "Designed and implemented real-time event processing pipeline using Kafka",
      "Mentored a team of 4 junior engineers, establishing code review practices",
      "Reduced API response times by 40% through caching and query optimization",
    ],
  },
  {
    company: "StartupXYZ",
    slug: "startupxyz",
    role: "Full Stack Developer",
    dates: "Jun 2022 - Dec 2023",
    bullets: [
      "Built the core product from 0 to 1, shipping to first 500 paying customers",
      "Implemented authentication, billing, and multi-tenant architecture",
      "Set up CI/CD pipelines and infrastructure-as-code with Terraform",
      "Worked directly with founders to define product roadmap and priorities",
    ],
  },
  {
    company: "BigTech Inc",
    slug: "bigtech-inc",
    role: "Software Engineering Intern",
    dates: "May 2021 - Aug 2021",
    bullets: [
      "Developed internal tooling that automated deployment workflows",
      "Contributed to open-source libraries used across the organization",
      "Presented technical findings to a team of 30+ engineers",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Go",
      "Rust",
      "Java",
      "SQL",
    ],
  },
  {
    name: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "HTML/CSS",
      "Vue.js",
      "Svelte",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Node.js",
      "Express",
      "FastAPI",
      "GraphQL",
      "REST APIs",
      "gRPC",
    ],
  },
  {
    name: "Infrastructure",
    skills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "Linux",
    ],
  },
  {
    name: "Databases",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "SQLite",
      "DynamoDB",
    ],
  },
  {
    name: "Tools",
    skills: [
      "Git",
      "Vim",
      "VS Code",
      "Figma",
      "Jira",
      "Notion",
    ],
  },
];

export const hobbiesText = `
  When I step away from the keyboard:

    Running       I enjoy long-distance running. Training for my next half marathon.
    Reading       Sci-fi, philosophy, and technical books. Currently reading
                  "Designing Data-Intensive Applications".
    Photography   Street photography and landscapes. I shoot on a Fuji X-T4.
    Gaming        Strategy and indie games. Big fan of Factorio and Celeste.
    Cooking       Experimenting with recipes from different cuisines.
                  My specialty is homemade pasta.
    Music         Playing guitar and discovering new artists. Mostly into
                  indie rock, jazz, and lo-fi.
`;

export const beliefsText = `
  Things I believe in:

    Build in public       Share your work early and often. Feedback is a gift.
    Ship fast, iterate    Done is better than perfect. Version 1 is just the start.
    Stay curious          The best engineers never stop learning.
    Write it down         Documentation is a love letter to your future self.
    Simplicity wins       The best code is code you don't have to write.
    Own your craft        Take pride in quality. Sweat the details.
    Be kind               Tech is built by people. Treat them well.
    Open source matters   Give back to the community that gave you so much.
`;

export const links: Link[] = [
  {
    name: "github",
    url: "https://github.com/adityadesai",
    label: "GitHub - github.com/adityadesai",
  },
  {
    name: "linkedin",
    url: "https://linkedin.com/in/adityadesai",
    label: "LinkedIn - linkedin.com/in/adityadesai",
  },
  {
    name: "email",
    url: "mailto:aditya@example.com",
    label: "Email - aditya@example.com",
  },
  {
    name: "website",
    url: "https://adityadesai.dev",
    label: "Website - adityadesai.dev",
  },
  {
    name: "twitter",
    url: "https://twitter.com/adityadesai",
    label: "Twitter/X - twitter.com/adityadesai",
  },
];
