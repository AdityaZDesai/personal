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

  I'm a Computer Science & Business Analytics student at Monash University
  with a passion for building full-stack products and working with data at scale.

  Currently an Assistant Data Engineer at ENGIE and a Projects Officer at
  the Monash Association of Coding, where I built a jobs board with 2,200+
  daily active users.

  I love shipping real products — from AI companions to hackathon-winning
  fashion apps. Always looking for the next problem to solve.

  Feel free to explore this terminal to learn more about me.
  Type 'help' to see what commands are available.

  Contact:
    Email    adityadesai753@gmail.com
    GitHub   github.com/adityaZdesai
    LinkedIn linkedin.com/in/adityadesai
`;

export const projects: Project[] = [
  {
    name: "Harmonica",
    slug: "harmonica",
    description:
      "The best AI companion that actually listens and understands. Chat with her through iMessage, Discord, and Telegram. Features a state-of-the-art memory model (50% better than ChatGPT) and custom fine-tuned image generation.",
    tech: ["AI/ML", "Fine-tuning", "iMessage", "Discord", "Telegram"],
    url: "https://loveharmonica.com",
  },
  {
    name: "MAC Jobs Board",
    slug: "mac-jobs-board",
    description:
      "A jobs board built for the Monash Association of Coding community. Reached 1,000 daily active users at its peak, connecting students with tech opportunities.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    url: "https://jobs.monashcoding.com",
  },
  {
    name: "Weave",
    slug: "weave",
    description:
      "An AI-powered fashion app that lets users find and virtually try on clothing. Winner at UNIHACK 2025, the largest student hackathon in Australia.",
    tech: ["Next.js", "Go", "Python", "AWS", "MongoDB"],
    github: "https://github.com/jason301c/unihack-2025",
  },
];

export const experiences: Experience[] = [
  {
    company: "ENGIE",
    slug: "engie-data-engineer",
    role: "Assistant Data Engineer",
    dates: "Feb 2025 - Present",
    bullets: [
      "Using PySpark and AWS Glue to filter and perform Data Quality Checks",
      "Transforming and populating data within PowerBI Dashboards using SQL",
      "Building Glue scripts and jobs using AWS CDK and GitHub Actions",
    ],
  },
  {
    company: "Monash Association of Coding",
    slug: "mac",
    role: "Projects Officer",
    dates: "Nov 2024 - Present",
    bullets: [
      "Built a jobs board using Next.js and Go with over 2,200 daily active users, hosted on Azure App Services",
      "Used GoLang to scrape over 10,000 job listings from 4 different websites",
      "Built APIs and backends using SpringBoot and Java",
      "Created an open source project with 100+ commits, using GitHub Actions for CI/CD auto-deployment",
    ],
  },
  {
    company: "ENGIE",
    slug: "engie-it-cadet",
    role: "Information Technology Cadet",
    dates: "Dec 2023 - Feb 2024, Nov 2024 - Feb 2025",
    bullets: [
      "Assisted with an enterprise-wide laptop swap for over 400 employees",
      "Created an internal compliance tool using PowerShell scripting, now used internationally",
      "Built a PowerBI dashboard using internal APIs that can fetch up to 30,000 tickets",
      "Worked with Deskside Support and Service Desk teams to resolve internal stakeholder queries",
    ],
  },
  {
    company: "Monash Deep Neuron",
    slug: "monash-deep-neuron",
    role: "Optimised Computing Team Member & Project Lead",
    dates: "Apr 2023 - Present",
    bullets: [
      "Parallelizing code to optimise programs for high-performance computing",
      "Running HPC tasks on the M3 and NCI Gadi Supercomputers using Linux CLI and C",
      "Benchmarking weather simulation models on supercomputer infrastructure",
      "Using OpenBCI EEG headsets and machine learning to read and interpret brain waves",
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
      "Java",
      "C",
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
    ],
  },
  {
    name: "Backend",
    skills: [
      "Node.js",
      "SpringBoot",
      "REST APIs",
      "PySpark",
    ],
  },
  {
    name: "Cloud & Infrastructure",
    skills: [
      "AWS (Glue, Lambda, S3, CDK)",
      "Azure App Services",
      "Docker",
      "GitHub Actions",
      "Coolify",
      "Linux",
    ],
  },
  {
    name: "Data & Databases",
    skills: [
      "MongoDB Atlas",
      "PowerBI",
      "SQL",
    ],
  },
  {
    name: "Tools",
    skills: [
      "Git",
      "GitHub Actions",
      "PowerShell",
      "VS Code",
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
