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
1. Set up your Supabase project (see above)
2. Have your environment variables ready

### Deploy Steps

1. **Push your code to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `Shelbook` repository

3. **Configure Environment Variables**
   
   Add these in Vercel Dashboard > Settings > Environment Variables:

   **Required:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

   **Optional:**
   ```
   NEXT_PUBLIC_SHELBY_API_KEY=your-shelby-api-key
   NEXT_PUBLIC_APTOS_API_KEY=your-aptos-api-key
   OPENAI_API_KEY=your-openai-key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `your-project.vercel.app`

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
