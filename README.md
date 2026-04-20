# null.log

A log of things reverse-engineered, broken, rebuilt, or worth writing down. 
This is a custom-built, server-side rendered Next.js blog that features a fully integrated **in-browser Vim editor** for creating and editing content.

## Features

- **Next.js 16 (App Router)**: Fast, server-rendered pages with optimal SEO.
- **In-Browser Vim**: Write your posts, notes, and projects directly in the browser using a custom CodeMirror 6 Vim implementation. Just press `Ctrl+Shift+A` to toggle Admin mode and start writing!
- **Supabase Backend**: All content is persisted to a Supabase PostgreSQL database.
- **Terminal Aesthetics**: Monospace typography, hacker-style UI, grep-style search, and dynamic code block rendering.
- **Markdown Support**: Custom lightweight markdown renderer that supports code blocks, copy-to-clipboard functionality, and typography styling without heavy dependencies.

## Tech Stack

- Framework: [Next.js](https://nextjs.org/) (React 19)
- Styling: Vanilla CSS (`globals.css`)
- Database: [Supabase](https://supabase.com/)
- Editor: CodeMirror 6 + `@replit/codemirror-vim`

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Admin Mode

To create or edit content, you must enter Admin Mode:
1. Press `Ctrl + Shift + A` (or click the subtle gear icon `⚙` in the footer).
2. The `⚡ admin` badge will appear.
3. Click the `+ new post` or `edit in vim` buttons that are now visible.
4. Save your work in the editor by typing `:w`, `:wq`, or just `:q` to quit without saving.
