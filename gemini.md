# Loanchy - Technical Overview

This document provides a technical overview of the Loanchy project, intended for development and maintenance purposes.

## Project Structure

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: React Context API, [React Hook Form](https://react-hook-form.com/) for forms
- **Data Fetching/Backend**: [Supabase](https://supabase.com/) (Storage, Authentication)
- **Package Manager**: npm

## Key Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## Architectural Notes

- The application follows a standard Next.js SSR.
- Reusable UI components are located in `src/components`.
- Supabase configuration and utility functions are in `src/lib/supabase.ts`.
- Global styles and Tailwind CSS configuration are in `src/app/globals.css` and `tailwind.config.ts` respectively.
- The application is a Progressive Web App (PWA), with configuration in `public/manifest.json`.

## Implementation standard.

- DO NOT over engineer things. Start with the simplest implementation.
- Always keep the performance and security as a first priority.
- Ask for any clarification rather just guessing things if you are not clear about anything.
