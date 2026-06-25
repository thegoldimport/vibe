# VibeAgencies on Replit

Quick guide to deploying the VibeAgencies platform to Replit.

## 1. Import Repository
- Create a new Repl and select "Import from GitHub".
- Paste the repository URL: `https://github.com/thegoldimport/vibe`

## 2. Configure Environment Variables
Use the **Secrets** tool in Replit to add the following variables (see `Replit.env.example` for details):
- `DATABASE_URL`: Use Replit's built-in PostgreSQL or an external Supabase instance.
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_ANON_KEY`: Your Supabase anon key.
- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI audits).
- `JWT_SECRET`: A random secure string for JWT signing.

## 3. System Dependencies
The `replit.nix` file is pre-configured to include:
- Node.js 20
- Playwright browsers (needed for the AI Audit engine)

If Playwright requires additional system libraries, you can add them to `deps` in `replit.nix`.

## 4. Initial Setup
Run the following commands in the Replit shell:
```bash
npm install
# If using Supabase, apply the migrations found in /supabase/migration.sql
```

## 5. Running the App
- **Development**: Click the **Run** button (configured to `npm run dev`).
- **Production Deployment**: Replit's Deployment tool will use `npm run build && npm start`.

## 6. Known Issues
- **Playwright on Replit**: If the audit crawler fails due to missing libraries, ensure `playwright-driver.browsers` is in `replit.nix`. You may also need to run `npx playwright install-deps` once in the shell.
