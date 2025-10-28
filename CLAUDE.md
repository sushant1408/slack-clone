# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Slack Clone** - a real-time team messaging and collaboration application. It's a full-featured copy of Slack with workspaces, channels, direct messaging, threading, reactions, and file uploads.

**Tech Stack:**
- **Frontend:** Next.js 15 (React 19) with TypeScript
- **Backend:** Convex (serverless real-time database and functions)
- **Authentication:** Convex Auth (password, GitHub, Google OAuth)
- **UI:** Tailwind CSS + shadcn/ui components
- **State Management:** Jotai (lightweight atoms) + React hooks
- **Rich Text:** Quill editor with emoji support

## Environment Setup

### Prerequisites

Before running the project, you need to set up accounts and obtain API keys:

1. **Convex** (Backend Database & Functions)
   - Create account at https://dashboard.convex.dev
   - Create a new project
   - Copy your deployment URL and deployment name

2. **Google OAuth** (Optional - Authentication)
   - Go to https://console.cloud.google.com
   - Create OAuth 2.0 credentials (Web application)
   - Add `http://localhost:3008/auth/callback/google` as authorized redirect URI
   - Copy Client ID and Client Secret

3. **GitHub OAuth** (Optional - Authentication)
   - Go to https://github.com/settings/developers
   - Create a new OAuth App
   - Set Authorization callback URL to `http://localhost:3008/auth/callback/github`
   - Copy Client ID and Client Secret

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then update `.env` with your actual credentials from the prerequisites above.

**Important**: Never commit `.env` to version control. The `.env.example` file shows the required variables without secrets.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3008)
npm run dev

# Start Convex backend in development mode (required for real-time features)
npx convex dev

# Build for production
npm run build

# Run production build
npm start

# Run linting
npm run lint
```

**Note:** Both `npm run dev` and `npx convex dev` should run concurrently in separate terminals during development.

## Architecture & Code Organization

### Feature-Based Module Structure

Each feature follows a consistent pattern with three main parts:

```
src/features/[feature]/
├── api/                 # Custom hooks for Convex queries/mutations
│   ├── use-get-*.ts    # Query hooks
│   ├── use-create-*.ts # Create mutations
│   ├── use-update-*.ts # Update mutations
│   └── use-delete-*.ts # Delete mutations
├── components/          # React components specific to this feature
│   └── *.tsx
└── store/              # Jotai atoms for feature state
    └── use-*.ts        # Hook wrappers around atoms
```

**Example:** Messages feature
- `api/use-get-messages.ts` - Fetches messages with pagination
- `api/use-create-message.ts` - Creates new messages
- `api/use-parent-message-id.ts` - Jotai atom for thread state
- `components/message-*.tsx` - Message UI components

### Route Structure

```
src/app/
├── (auth)/              # Public auth routes
│   ├── sign-in
│   └── sign-up
├── layout.tsx           # Root layout with providers (Convex, theme, etc.)
├── page.tsx             # Home - redirects to workspace or shows create modal
└── workspace/[workspaceId]/
    ├── page.tsx         # Workspace home
    ├── channel/[channelId]/  # Channel messages view
    └── member/[memberId]/    # 1:1 direct message conversation
```

### Core Feature Areas

- **workspaces** - Teams with unique join codes
- **channels** - Team communication channels within workspaces
- **members** - Users in workspaces (roles: admin, member)
- **messages** - Messages with threading, reactions, file attachments
- **conversations** - 1:1 direct messaging between members
- **reactions** - Emoji reactions on messages
- **auth** - Sign up, sign in, OAuth integration
- **upload** - File storage and handling

## Database Schema (Convex)

Core tables in `/convex/schema.ts`:

- `workspaces` - Workspace metadata with random join codes
- `members` - User membership with roles (admin/member)
- `channels` - Team channels
- `messages` - Messages with parent IDs for threading
- `conversations` - 1:1 conversation metadata
- `reactions` - Emoji reactions (user + message + emoji)
- `users` - Auth users (auto-managed by Convex Auth)

**Key Pattern:** Compound indexes on frequent queries (e.g., `by_workspace_id_user_id`, `by_channel_id_parent_message_id`)

## Common Patterns & Conventions

### Working with Convex Hooks

```typescript
// Import from convex API
import { api } from "@/convex/_generated/api";

// Query hook with pagination
const { results, status, loadMore } = usePaginatedQuery(api.messages.getMessages, {
  channelId,
  parentMessageId: null,
});

// Mutation hook
const { mutate: createMessage } = useMutation(api.messages.create);
```

### State Management with Jotai

```typescript
// Define atom in store file
import { atom, useAtom } from "jotai";
export const parentMessageIdAtom = atom<string | null>(null);

// Use hook wrapper
export const useParentMessageId = () => useAtom(parentMessageIdAtom);

// Usage in component
const [parentMessageId, setParentMessageId] = useParentMessageId();
```

### Modal Management

All modals are centralized in `src/components/modals.tsx`. Modals use Jotai atoms to prevent hydration mismatches:
- Open/close state managed by Jotai atoms
- Modal components wrapped with `useEffect` to sync state
- Used for create workspace, create channel, invite members, etc.

### Class Name Merging

```typescript
import { cn } from "@/lib/utils";

// Use cn() to merge Tailwind classes safely
<div className={cn("px-4 py-2", isActive && "bg-blue-500")} />
```

### URL State with nuqs

URL parameters managed automatically:
- Workspace ID from route: `[workspaceId]`
- Channel ID from route: `[channelId]`
- Member ID from route: `[memberId]`

## Type Safety

- **Full TypeScript with strict mode** enabled
- Convex generates types automatically in `/convex/_generated/api`
- Always import `api` from generated types, never hardcode string keys
- Path alias `@/*` maps to `./src/*`

## Key Implementation Details

### Pagination

Messages use batch-based pagination with `usePaginatedQuery`:
- Default batch size: 30 items
- Use `loadMore()` function to fetch additional pages
- Pagination works for channels, threads, and conversations

### Threading

Messages support parent-child relationships:
- `parentMessageId` field on messages table
- Threads show in a right-side panel
- Thread view shows all replies to a parent message
- State managed via `useParentMessageId()` atom

### Reactions

- One reaction per user per message per emoji
- Toggle reactions (add if not present, remove if present)
- Displayed as emoji buttons with count badges

### File Uploads

- Uses Convex storage API
- Files stored as `_storage` IDs
- Images embedded in messages with thumbnails
- Upload hook: `use-upload.ts`

### Authentication Flow

1. Unauthenticated users redirected to `/sign-in`
2. Middleware (`src/middleware.ts`) enforces auth on protected routes
3. Sign up/in pages at `/sign-in` and `/sign-up`
4. After auth, home page creates first workspace or shows create modal
5. OAuth providers (GitHub, Google) configured in Convex Auth

## Important Code References

**Utilities:**
- `src/lib/utils.ts` - `cn()` for class merging, `generateInviteCode()`
- `date-fns` - Date formatting (use `formatDistanceToNow()`, `format()`)
- `lucide-react` - Icons for UI
- `sonner` - Toast notifications (`toast.success()`, `toast.error()`)

**UI Components:**
- shadcn/ui components in `src/components/ui/`
- Radix UI primitives (Avatar, Dialog, Dropdown, Popover, etc.)
- Common patterns: Avatar for users, Dialog for modals, Dropdown for menus

**Responsive Design:**
- Mobile-first Tailwind approach
- Resizable panels for sidebar/content with `react-resizable-panels`
- Dark mode support via `next-themes`

## Configuration Files

- `/src/tsconfig.json` - TypeScript config (strict mode, ES2017 target)
- `/convex/tsconfig.json` - Convex functions (ESNext target)
- `next.config.ts` - Minimal Next.js config
- `tailwind.config.ts` - Custom colors, dark mode, CSS variables
- `components.json` - shadcn/ui config
- `eslint.config.mjs` - Extends Next.js core rules

## Development Tips

1. **When adding a new feature:** Follow the feature-based structure with api/, components/, and store/ subdirectories.

2. **When working with messages:** Remember threading is built-in via `parentMessageId`. Check if you need thread-aware queries.

3. **When fetching data:** Always use custom hooks from `api/` folder, never call Convex functions directly. This ensures consistency and caching.

4. **When managing state:** Use Jotai atoms for cross-component state (selected workspace, thread panel, etc.) and local component state for form fields.

5. **When styling:** Avoid inline styles; use Tailwind classes. Use `cn()` for conditional classes. Check existing components for patterns.

6. **For real-time updates:** Convex queries automatically update when data changes. No manual refetching needed for most cases.

7. **When handling errors:** Use `sonner` toast notifications for user feedback. Check feature API hooks for error handling patterns.

## Production Deployment

- Build runs `next build` (creates optimized bundle)
- Deploy to Vercel (recommended for Next.js) or any Node.js host
- Ensure `NEXT_PUBLIC_CONVEX_URL` environment variable is set
- Configure OAuth providers (GitHub, Google) with correct callback URLs
- Convex project must be deployed to production

## Dependencies & Libraries

### Core Framework & Runtime

- `next` (15.1.7) - React framework for production with server-side rendering, static site generation, and API routes
- `react` (19.0.0) - JavaScript library for building user interfaces with components and hooks
- `react-dom` (19.0.0) - Entry point to the DOM and server renderers for React

### Backend & Database

- `convex` (1.19.2) - Serverless backend platform providing real-time database, functions, and authentication
- `@convex-dev/auth` (0.0.80) - Convex authentication library supporting OAuth and password-based auth
- `@auth/core` (0.37.0) - Core authentication logic for integrating with OAuth providers

### UI Components & Styling

- `@radix-ui/react-avatar` (1.1.3) - Accessible avatar component for displaying user images
- `@radix-ui/react-dialog` (1.1.6) - Accessible dialog/modal component with focus management
- `@radix-ui/react-dropdown-menu` (2.1.6) - Accessible dropdown menu component
- `@radix-ui/react-popover` (1.1.6) - Accessible popover component for tooltips and dropdowns
- `@radix-ui/react-separator` (1.1.2) - Semantic separator/divider component
- `@radix-ui/react-slot` (1.1.2) - Utility for merging props and composing components
- `@radix-ui/react-tooltip` (1.1.8) - Accessible tooltip component for additional context
- `tailwindcss` (3.4.1) - Utility-first CSS framework for rapid UI development
- `tailwind-merge` (3.0.1) - Utility for merging Tailwind CSS classes without conflicts
- `tailwindcss-animate` (1.0.7) - Tailwind CSS plugin providing animation utilities
- `class-variance-authority` (0.7.1) - Type-safe component variant management for styling flexibility
- `clsx` (2.1.1) - Utility for constructing className strings conditionally

### State Management

- `jotai` (2.12.0) - Lightweight atom-based state management library for managing global and component state
- `react-use` (17.6.0) - Collection of React hooks for common use cases

### URL & Query Parameters

- `nuqs` (2.4.0) - Type-safe URL search parameters management for Next.js

### Date & Time

- `date-fns` (4.1.0) - Modern date utility library for parsing, formatting, and manipulating dates

### Rich Text & Editor

- `quill` (2.0.3) - Powerful rich text editor with support for formatting, embeds, and custom modules
- `emoji-mart` (5.6.0) - Comprehensive emoji picker component with search and categories
- `emoji-picker-react` (4.12.0) - React emoji picker with accessibility features

### Forms & Input

- `input-otp` (1.4.2) - One-time password input component for OTP authentication flows
- `cmdk` (1.0.4) - Fast command menu component for command palettes and shortcuts

### Icons

- `lucide-react` (0.475.0) - Minimal icon library providing consistent, accessible SVG icons
- `react-icons` (5.4.0) - Popular icon libraries (Font Awesome, Feather, etc.) as React components

### Layout & Resizing

- `react-resizable-panels` (2.1.7) - Resizable panel component for flexible layouts (sidebar, main content, etc.)

### Notifications & Feedback

- `sonner` (1.7.4) - Toast notification library providing elegant, accessible notifications

### Theming

- `next-themes` (0.4.4) - Dark mode and theme management for Next.js applications

### Development & Tooling

- `typescript` (5) - Static type checking for JavaScript
- `eslint` (9) - JavaScript linter for code quality and consistency
- `eslint-config-next` (15.1.7) - ESLint configuration for Next.js projects
- `@eslint/eslintrc` (3) - ESLint configuration utilities
- `@types/node` (20) - TypeScript type definitions for Node.js
- `@types/react` (19) - TypeScript type definitions for React
- `@types/react-dom` (19) - TypeScript type definitions for React DOM
- `postcss` (8) - CSS transformations plugin system for processing Tailwind CSS
