# null.log — Deploy to Netlify

## Option 1 — Drag & Drop (fastest)
1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the page
3. Done — live in ~10 seconds

## Option 2 — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir . --prod
```

## Option 3 — GitHub + Netlify (recommended for ongoing use)
1. Push this folder to a GitHub repo
2. Go to https://app.netlify.com → "Add new site" → "Import from Git"
3. Select your repo
4. Build command: (leave empty)
5. Publish directory: `.`
6. Click Deploy

## Customise before deploying
Open `index.html` and edit the `DATA` object near the top of the script:
- `DATA.posts` — your blog posts
- `DATA.notes` — your short TIL notes  
- `DATA.projects` — your projects table

Also search for `null` / `null.log` to update the brand name to your own.

## Custom domain
After deploy, go to Site settings → Domain management → Add custom domain.
