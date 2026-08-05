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
  the Monash Association of Coding, where I built a jobs board used by the
  Monash student community.

  I love shipping real products — from AI companions to hackathon-winning
  fashion apps. Always looking for the next problem to solve.

  Use the quick actions or terminal commands to learn more about me.

  Contact:
    Email    adityadesai753@gmail.com
    GitHub   https://github.com/AdityaZDesai
    LinkedIn https://www.linkedin.com/in/adityazdesai
`;

export const educationText = `
  Education
  ─────────

  Monash University
  Computer Science & Business Analytics

  Combining software engineering, data, and business problem-solving to
  build products that are useful in the real world.
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
      "A jobs board built for the Monash Association of Coding community, connecting students with technology opportunities.",
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
      "Built a jobs board using Next.js and Go for the Monash student community, hosted on Azure App Services",
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

    Boxing        I love to train and watch boxing.
    Reading       Big into fantasy and sci-fi. Always looking for the next
                  great series to get lost in.
    Gaming        Playing games whenever I get the chance.
`;

export const links: Link[] = [
  {
    name: "github",
    url: "https://github.com/AdityaZDesai",
    label: "GitHub - github.com/AdityaZDesai",
  },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/in/adityazdesai",
    label: "LinkedIn - linkedin.com/in/adityazdesai",
  },
  {
    name: "email",
    url: "mailto:adityadesai753@gmail.com",
    label: "Email - adityadesai753@gmail.com",
  },
];
