# Shelbook

A Facebook-style social media application built with Next.js, Aptos blockchain, and Supabase.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

#### Option A: Use Supabase Cloud (Recommended for Production)
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and keys from Settings > API
3. Update your `.env.production` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
4. Run migrations:
```bash
npm run supabase:db:push
```

#### Option B: Use Local Supabase (Development)
```bash
npm run supabase:start
npm run supabase:db:push
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Prerequisites
1. **Set up your Supabase project first** (see below)
2. Have your Supabase credentials ready
3. Push your code to GitHub

### Step 1: Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name:** Shelbook (or any name)
   - **Database Password:** Choose a strong password
   - **Region:** Choose closest to your users
4. Wait for project to finish setting up (2-3 minutes)

#### Get Your Credentials
1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys" - keep this secret!)

#### Run Database Migrations
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Get project-ref from your Supabase project URL: `https://[project-ref].supabase.co`)

3. Push migrations:
   ```bash
   npm run supabase:db:push
   ```

### Step 2: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables** (CRITICAL!)
   
   In the Vercel project settings, add these environment variables:

   ```env
   # REQUIRED - Get these from Supabase Dashboard > Settings > API
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **⚠️ Without these, login will fail with "Database is not configured" error**

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

### Troubleshooting Deployment

#### "Database is not configured" Error
- ✅ Verify environment variables are set in Vercel Dashboard
- ✅ Check that values don't contain `xxxxx` or placeholders
- ✅ Ensure you copied the full key (starts with `eyJ...`)
- ✅ Redeploy after adding environment variables

#### "Failed to create user account" Error
- ✅ Make sure you ran database migrations (`npm run supabase:db:push`)
- ✅ Check Supabase project is active (not paused)
- ✅ Verify service role key has correct permissions

#### Can't Login on Production
1. Open browser DevTools (F12) > Console
2. Look for error messages
3. Check Network tab for failed API calls
4. Verify Supabase URL is accessible from your browser

### Important Notes

- ⚠️ The middleware deprecation warning can be safely ignored - it's a false positive
- ✅ Ensure all Supabase environment variables are set in Vercel before deploying
- 📝 The build will succeed even without environment variables, but the app won't work at runtime

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── (main)/            # Main app pages
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components (Header, Sidebar, etc.)
│   ├── post/             # Post-related components
│   └── profile/          # Profile components
├── lib/                  # Utilities and helpers
├── supabase/            # Database migrations
└── packages/ui/         # Shared UI components

```

## Features

- 🔐 Web3 wallet authentication (Aptos)
- 📝 Create, view, and interact with posts
- 💬 Comments and likes
- 👤 User profiles
- 🌙 Dark mode support
- 📱 Responsive mobile design
- 🎨 Facebook-style UI

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Blockchain:** Aptos
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4
- **Storage:** Shelby Protocol (decentralized)
- **UI Components:** shadcn/ui + Radix UI

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Supabase commands
npm run supabase:start      # Start local Supabase
npm run supabase:stop       # Stop local Supabase
npm run supabase:db:push    # Push migrations
```

## License

MIT
