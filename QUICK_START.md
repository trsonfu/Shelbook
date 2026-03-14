# Quick Start Guide - Profile System

## 🚀 Get Started in 5 Minutes

### Step 1: Apply Database Migrations (2 minutes)

1. Go to https://app.supabase.com
2. Open your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy content from `supabase/migrations/001_initial_schema.sql`
6. Paste and click **Run**
7. Wait for "Success" message
8. Click **New Query** again
9. Copy content from `supabase/migrations/002_complete_schema.sql`
10. Paste and click **Run**
11. Wait for "Success" message

**✅ Done!** Your database is ready.

### Step 2: Verify Environment Variables (1 minute)

Check that `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If missing, get them from:
1. Supabase Dashboard → Settings → API
2. Copy **Project URL** and **anon public** key

### Step 3: Start Dev Server (1 minute)

```bash
npm run dev
```

Wait for: `✓ Ready in X seconds`

### Step 4: Test It! (1 minute)

1. Open http://localhost:3000
2. Connect your wallet
3. Click profile icon (top right or bottom nav)
4. Should see "Welcome to Shelbook!" screen
5. Click "Set Up Profile"
6. Fill in:
   - **Display Name:** Your Name
   - **Bio:** Something about you
   - **Avatar URL:** https://api.dicebear.com/7.x/avataaars/svg?seed=yourname
7. Click **Save**
8. Your profile appears! 🎉

## ✅ That's It!

You now have a fully functional profile system.

## What You Can Do Now

### For Users:
- ✅ Create profile with display name, bio, and avatar
- ✅ Edit profile anytime
- ✅ View other users' profiles
- ✅ Follow/unfollow (if implemented)
- ✅ Post content linked to profile

### For Developers:
- ✅ Profile data stored in Supabase
- ✅ UPSERT API (create or update profiles)
- ✅ Works with wallet addresses
- ✅ Automatic username generation
- ✅ Real-time UI updates

## Quick Reference

### API Endpoints

```bash
# Get profile
GET /api/users/[wallet_address_or_uuid]

# Create/Update profile
PATCH /api/users/[wallet_address_or_uuid]
Body: { display_name, bio, avatar_url }
```

### Key Files

- `app/api/users/[id]/route.ts` - API logic
- `components/profile/FacebookProfile.tsx` - Profile display
- `components/profile/ProfileEditModal.tsx` - Edit UI
- `app/(main)/profile/[id]/page.tsx` - Profile page

### Database Tables

- `users` - Profile data
- `posts` - User posts
- `likes` - Post likes
- `comments` - Post comments
- `follows` - Follow relationships

## Need More Info?

Read these guides (in order):

1. **DEPLOYMENT_CHECKLIST.md** - Complete testing checklist
2. **IMPLEMENTATION_SUMMARY.md** - How everything works
3. **PROFILE_SETUP_GUIDE.md** - Detailed setup guide
4. **FRONTEND_PROFILE_GUIDE.md** - Code examples

## Troubleshooting

### "User not found" instead of setup screen
- Make sure you're logged in (wallet connected)
- Check browser console for errors

### "Failed to update profile"
- Verify Supabase environment variables
- Check that migrations were applied
- Look at Network tab in DevTools

### Profile doesn't update
- Hard refresh (Ctrl+Shift+R)
- Check console logs for errors
- Verify data in Supabase dashboard

## Test with Different Avatar URLs

Try these free avatar services:

```
# DiceBear (customizable)
https://api.dicebear.com/7.x/avataaars/svg?seed=yourname

# UI Avatars (initials)
https://ui-avatars.com/api/?name=Your+Name&size=200

# Gravatar (if you have one)
https://www.gravatar.com/avatar/youremail@example.com?s=200&d=mp
```

## What's Next?

After testing the profile system:

1. **Create posts** - Test posting with your new profile
2. **Follow users** - Test the follow system
3. **Customize design** - Adjust colors, layouts to match your brand
4. **Add features** - Cover photos, badges, verification, etc.
5. **Deploy** - Push to production when ready

## Support

Got stuck? Check:
- Browser console (F12) for errors
- `DEPLOYMENT_CHECKLIST.md` for step-by-step tests
- Supabase logs for database errors
- Network tab for API responses

---

**You're all set! Happy coding! 🚀**
