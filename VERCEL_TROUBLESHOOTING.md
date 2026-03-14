# Vercel Deployment Troubleshooting Guide

## The Issue: Can't Login on Production

### Symptom
When you connect your wallet on the production site, you see the URL `https://your-app.vercel.app/api/auth/login` or get stuck on "Authenticating..."

### Root Cause
This happens because **Supabase environment variables are not configured in Vercel**.

---

## Solution: Configure Environment Variables in Vercel

### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (⚙️) in the left sidebar
4. Click **API**
5. Copy these three values:

   - **Project URL** (under "Configuration")
     ```
     https://abcdefghij.supabase.co
     ```
   
   - **anon public key** (under "Project API keys")
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTE2NjgwMCwiZXhwIjoxOTU2NzQyODAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   
   - **service_role key** (under "Project API keys" - **SECRET!**)
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQxMTY2ODAwLCJleHAiOjE5NTY3NDI4MDB9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
     ```

### Step 2: Add Environment Variables to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **Shelbook** project
3. Click **Settings** tab
4. Click **Environment Variables** in the left menu
5. Add these three variables one by one:

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (your anon key) | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (your service role key) | Production, Preview, Development |

   For each variable:
   - Click "Add New"
   - Enter the **Key** (exactly as shown above)
   - Paste the **Value**
   - Select all environments (Production, Preview, Development)
   - Click "Save"

### Step 3: Redeploy

1. In Vercel, go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. ✅ Check "Use existing Build Cache"
5. Click **Redeploy** button

### Step 4: Verify It Works

1. Wait for deployment to finish (~1-2 minutes)
2. Visit your production URL: `https://your-app.vercel.app`
3. Try connecting your wallet
4. You should now be able to login successfully! 🎉

---

## Alternative: Check Migration Status

If login still fails after adding environment variables, ensure database tables exist:

### Check Tables in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor** in left sidebar
3. You should see these tables:
   - `users`
   - `posts`
   - `likes`
   - `comments`
   - `follows`

### If Tables Are Missing, Run Migrations

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
npx supabase login

# Link your project (get project-ref from your Supabase URL)
npx supabase link --project-ref your-project-ref

# Push migrations to create tables
npm run supabase:db:push
```

---

## Common Errors & Solutions

### Error: "Database is not configured"
- ❌ Environment variables are not set in Vercel
- ✅ Follow Steps 1-3 above

### Error: "Failed to create user account"
- ❌ Database tables don't exist
- ✅ Run migrations (see "Check Migration Status" above)

### Error: "Database connection failed"
- ❌ Invalid Supabase credentials
- ✅ Double-check you copied the full keys (they're very long!)
- ✅ Make sure Project URL doesn't have trailing slash

### Login Page Redirects to `/api/auth/login`
- ❌ API is throwing an error
- ✅ Check browser console (F12 > Console) for error messages
- ✅ Verify environment variables are set correctly
- ✅ Redeploy after adding variables

---

## Still Having Issues?

### Enable Debug Mode

1. In Vercel Dashboard > Settings > Environment Variables
2. Add: `NODE_ENV=production`
3. Redeploy
4. Check deployment logs for detailed error messages

### View Deployment Logs

1. Go to Vercel > Deployments
2. Click on the latest deployment
3. Click "Runtime Logs"
4. Look for errors related to Supabase

### Test Locally First

```bash
# Use production environment locally
cp .env.production .env.local

# Edit .env.local with your real Supabase credentials
# Then test:
npm run build
npm start
```

If it works locally but not on Vercel, the issue is definitely with environment variables in Vercel.

---

## Quick Checklist

- [ ] Supabase project created
- [ ] Database migrations pushed (`npm run supabase:db:push`)
- [ ] Tables exist in Supabase (check Table Editor)
- [ ] Environment variables added to Vercel (all 3)
- [ ] Environment variables have correct values (no `xxxxx` placeholders)
- [ ] Redeployed after adding environment variables
- [ ] No errors in browser console when trying to login

If you've checked all of these and it still doesn't work, share the error message from the browser console for more specific help!
