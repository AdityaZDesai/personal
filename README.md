# Aditya Desai Portfolio

An accessible terminal-style portfolio built with Next.js, React, TypeScript, and Tailwind CSS. Visitors can explore with Unix-style commands or use the clickable quick actions and file listings.

## Development

Install dependencies and start the local server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Project Structure

- `src/app` contains the Next.js layout, page, and global styles.
- `src/components/Terminal.tsx` manages terminal state and interactions.
- `src/components/OutputLine.tsx` renders text, links, and clickable commands.
- `src/lib/content.ts` is the source of truth for portfolio content and links.
- `src/lib/filesystem.ts` builds the virtual portfolio filesystem.
- `src/lib/commands.ts` implements the supported terminal commands.
- `src/lib/sounds.ts` manages optional terminal and ambient audio.

## Updating Content

Edit `src/lib/content.ts` to update projects, experience, skills, education, or contact links. The virtual files and clickable terminal output are generated from that content.

When adding an external profile, include the full verified URL. Do not add placeholder destinations because contact actions are exposed directly to visitors.
