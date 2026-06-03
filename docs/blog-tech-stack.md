# Blog Website Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Tailwind CSS v4
- Local mock data for the first version

## UI And State

- Component-driven layout with reusable cards, buttons, inputs, and editor panels
- React state first, then context or a lightweight store only if the app grows
- Optional markdown or rich text editor depending on the final content format

## Content And Data

- Start with local JSON or in-memory seed data
- Move to a backend API when posts need persistence
- Use a simple post schema that supports drafts, published posts, and AI-generated drafts

## AI Layer

- Separate AI service or API wrapper for draft generation
- Prompt templates for title, outline, and full draft generation
- Regeneration endpoints for specific sections

## Future Backend Options

- Node.js with Express or NestJS
- PostgreSQL for persistent blog content
- Prisma or another ORM for data access
- Authentication if multi-author publishing is added later