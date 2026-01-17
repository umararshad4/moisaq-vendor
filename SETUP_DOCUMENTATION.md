# Next.js Project Setup - Complete Documentation

## Overview

This project is a production-ready Next.js 16 application with modern tooling including TypeScript, Tailwind CSS, shadcn/ui, ESLint, Prettier, and TanStack Query.

## Tech Stack

- **Next.js**: 16.1.3 (App Router, Turbopack)
- **React**: 19.2.3
- **TypeScript**: 5.x (strict mode)
- **Tailwind CSS**: 4.x (latest)
- **shadcn/ui**: Component library
- **ESLint**: 9.x with Next.js config
- **Prettier**: 3.x with Tailwind plugin
- **TanStack Query**: Latest with DevTools

## Setup Commands Used

### 1. Next.js Foundation

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git --use-npm --no-react-compiler
```

### 2. Prettier Setup

```bash
npm install -D prettier eslint-config-prettier prettier-plugin-tailwindcss
```

### 3. shadcn/ui Setup

```bash
npx shadcn@latest init --yes --defaults
```

### 4. TanStack Query Setup

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## Project Structure

```
next-setup/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS + shadcn/ui variables
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   └── providers.tsx       # TanStack Query providers
│   ├── components/
│   │   ├── devtools.tsx        # React Query DevTools
│   │   └── ui/                 # shadcn/ui components (add via CLI)
│   ├── hooks/
│   │   └── use-posts.ts        # Example TanStack Query hook
│   └── lib/
│       └── utils.ts            # shadcn/ui utilities
├── components.json              # shadcn/ui configuration
├── .prettierrc                # Prettier configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Building
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Key Configuration Files

### .prettierrc

Configured with Tailwind plugin for automatic class sorting:

- Semi-colons enabled
- Trailing commas (ES5)
- Double quotes
- Tab width: 2
- Automatic Tailwind class sorting

### eslint.config.mjs

Configured with:

- Next.js core web vitals
- TypeScript rules
- Prettier integration (prevents conflicts)

### components.json (shadcn/ui)

- Style: New York
- Base color: Zinc
- CSS variables enabled
- Import aliases configured (@/components, @/lib, etc.)

### src/app/providers.tsx (TanStack Query)

Proper Next.js SSR setup:

- Server-side query client for SSR
- Browser query client with singleton pattern
- Default staleTime: 60s (prevents refetch on hydration)
- Optimized for App Router

## How to Use Each Tool

### Tailwind CSS 4

Already configured with PostCSS. Use utility classes in your components:

```tsx
<button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Click me
</button>
```

**Note**: Classes are automatically sorted by Prettier plugin when you format.

### shadcn/ui Components

Add components using the CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Use in your code:

```tsx
import { Button } from "@/components/ui/button";

<Button>Click me</Button>;
```

### TanStack Query

Use the custom hooks pattern:

```tsx
// Create a hook in src/hooks/
import { useQuery } from "@tanstack/react-query";

async function fetchData() {
  const res = await fetch("/api/data");
  return res.json();
}

export function useData() {
  return useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  });
}

// Use in component
import { useData } from "@/hooks/use-data";

export function MyComponent() {
  const { data, isLoading, error } = useData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

### DevTools

React Query DevTools is automatically available in development:

- Click the icon in bottom-right corner
- View query cache, mutations, and inspector
- Debug your data fetching logic

### ESLint

Run linter manually:

```bash
npm run lint
```

VS Code integration is automatic with the extension.

### Prettier

Format all files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

## Development Workflow

1. **Start dev server**:

   ```bash
   npm run dev
   ```

2. **Add shadcn/ui components as needed**:

   ```bash
   npx shadcn@latest add <component-name>
   ```

3. **Create TanStack Query hooks**:
   - Place in `src/hooks/` directory
   - Follow the pattern in `use-posts.ts`
   - Use descriptive query keys

4. **Format code before committing**:
   ```bash
   npm run format
   npm run lint
   ```

## Best Practices

### TanStack Query

- Use descriptive query keys (e.g., `["posts", { page: 1 }]`)
- Set appropriate staleTime for your data
- Handle loading and error states
- Use QueryClient for server-side prefetching when needed

### shadcn/ui

- Copy components when you need to customize them
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Customize theme in `src/app/globals.css` CSS variables

### Tailwind CSS

- Let Prettier sort classes automatically
- Use responsive prefixes (`sm:`, `md:`, `lg:`)
- Leverage dark mode with `dark:` prefix

### TypeScript

- Always type your props and return values
- Use strict mode (enabled by default)
- Avoid `any` type

## Troubleshooting

### Build Issues

If you encounter build issues, try:

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Prettier Conflicts

Make sure `eslint-config-prettier` is last in your ESLint config to disable conflicting rules.

### TanStack Query Hydration Issues

The provider setup in `src/app/providers.tsx` handles most hydration issues. If you still see problems, ensure:

- QueryClient is not recreated on every render
- staleTime is set above 0
- Using proper async/await patterns in query functions

## Next Steps

1. Customize the theme in `src/app/globals.css`
2. Add your first shadcn/ui component: `npx shadcn@latest add button`
3. Create API routes or fetch from external APIs
4. Set up your database (PostgreSQL, MongoDB, etc.)
5. Configure authentication (NextAuth.js, Clerk, etc.)
6. Deploy to Vercel or other platform

## Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [ESLint Docs](https://eslint.org/docs/latest/)
- [Prettier Docs](https://prettier.io/docs/en/)

## Support

For issues or questions, refer to the official documentation of each tool or check the GitHub repositories.
