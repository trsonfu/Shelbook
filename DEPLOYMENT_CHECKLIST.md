# Profile System Deployment Checklist

## Pre-Deployment Steps

### 1. Database Setup
- [ ] Open Supabase dashboard (https://app.supabase.com)
- [ ] Navigate to your project
- [ ] Go to SQL Editor
- [ ] Run `supabase/migrations/001_initial_schema.sql`
  - [ ] Verify `users` table created
  - [ ] Verify `idx_users_wallet_address` index created
  - [ ] Verify `update_updated_at_column()` function created
  - [ ] Verify trigger `update_users_updated_at` created
- [ ] Run `supabase/migrations/002_complete_schema.sql`
  - [ ] Verify `posts` table created
  - [ ] Verify `likes` table created
  - [ ] Verify `comments` table created
  - [ ] Verify `follows` table created
  - [ ] Verify all indexes created
  - [ ] Verify all triggers created

**Alternative (CLI method):**
```bash
cd r:/Shelbook
supabase db push
```

### 2. Environment Variables
- [ ] Verify `.env.local` exists
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Restart dev server if variables changed

```bash
# Check environment variables
cat .env.local

# Restart dev server
npm run dev
```

### 3. Code Verification
- [ ] All files saved
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Dev server running without errors

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Start dev server
npm run dev
```

## Testing Steps

### Test 1: New User Profile Creation

- [ ] Open browser to http://localhost:3000
- [ ] Connect wallet (should create session)
- [ ] Click profile avatar in header or bottom nav
- [ ] **Expected:** See "Welcome to Shelbook!" setup screen
- [ ] **Expected:** See wallet address displayed
- [ ] Click "Set Up Profile" button
- [ ] **Expected:** Edit modal opens
  - [ ] Fill in:
  - [ ] Display Name (e.g., "John Doe")
  - [ ] Bio (e.g., "Test user profile")
  - [ ] Avatar URL (e.g., "https://api.dicebear.com/9.x/adventurer/svg?seed=test")
- [ ] Click "Save"
- [ ] **Expected:** Modal closes
- [ ] **Expected:** Profile page shows with entered information
- [ ] **Expected:** Avatar displays (or initials if URL invalid)
- [ ] **Expected:** Display name shows as profile title
- [ ] **Expected:** Bio shows below name

**✅ PASS if:** Profile data persists and displays correctly

### Test 2: Profile Update

- [ ] While viewing own profile, click "Edit profile" button
- [ ] **Expected:** Edit modal opens with current data pre-filled
- [ ] Change display name (e.g., "Updated Name")
- [ ] Change bio (e.g., "Updated bio text")
- [ ] Change avatar URL to different image
- [ ] Click "Save"
- [ ] **Expected:** Modal closes
- [ ] **Expected:** Profile updates immediately
- [ ] **Expected:** New display name shows
- [ ] **Expected:** New bio shows
- [ ] **Expected:** New avatar shows
- [ ] Refresh page (F5)
- [ ] **Expected:** Changes persist after refresh

**✅ PASS if:** Updates are saved and persist across page reloads

### Test 3: View Another User's Profile

- [ ] Copy your profile URL (e.g., `/profile/0x...`)
- [ ] Open incognito/private window or different browser
- [ ] Connect different wallet
- [ ] Paste first user's profile URL
- [ ] Navigate to that profile
- [ ] **Expected:** See first user's profile information
- [ ] **Expected:** NO "Edit profile" button (not own profile)
- [ ] **Expected:** See "Follow" button (if follow system implemented)

**✅ PASS if:** Can view other users' profiles without edit access

### Test 4: API Direct Test

Open browser console and run:

```javascript
// Test GET (non-existent user)
const testWallet = '0x' + '1234567890'.repeat(6) + '1234567890'
fetch(`/api/users/${testWallet}`).then(r => r.json()).then(console.log)
// Expected: { user: null, walletAddress: "0x...", followersCount: 0, followingCount: 0 }

// Test PATCH (create profile)
fetch(`/api/users/${testWallet}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    display_name: 'Test User',
    bio: 'API Test',
    avatar_url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=test'
  })
}).then(r => r.json()).then(console.log)
// Expected: { success: true, user: {...}, created: true }

// Test GET (existing user)
fetch(`/api/users/${testWallet}`).then(r => r.json()).then(console.log)
// Expected: { user: { display_name: "Test User", ... }, followersCount: 0, followingCount: 0 }
```

**✅ PASS if:** All API calls return expected responses

### Test 5: Database Verification

- [ ] Open Supabase dashboard
- [ ] Go to Table Editor
- [ ] Select `users` table
- [ ] **Expected:** See newly created user records
- [ ] **Expected:** `wallet_address` column populated
- [ ] **Expected:** `display_name`, `bio`, `avatar_url` populated
- [ ] **Expected:** `created_at` and `updated_at` timestamps present
- [ ] Check if duplicate wallet addresses exist
- [ ] **Expected:** NO duplicates (UNIQUE constraint working)

**✅ PASS if:** Database records match profile data

## Debugging Common Issues

### Issue: "Welcome to Shelbook!" doesn't appear for new user

**Debug Steps:**
1. Open browser DevTools → Console
2. Look for this log: `Render check: { user: false, isOwnProfile: ..., ... }`
3. Check if `currentWalletAddress` is undefined
4. If undefined, check session in Network tab

**Fix:**
- Ensure user is logged in (wallet connected)
- Verify session cookie contains `walletAddress`
- Check `page.tsx` passes `currentWalletAddress` prop

### Issue: "Failed to update profile" error

**Debug Steps:**
1. Open browser DevTools → Console
2. Look for error message
3. Check Network tab → Failed request
4. Look at Response tab for detailed error

**Common Causes:**
- Supabase env vars not set → Check `.env.local`
- Migration not applied → Run SQL migrations
- Network error → Check Supabase dashboard status

### Issue: Profile updates don't persist

**Debug Steps:**
1. Check if save succeeds (console logs)
2. Check if API returns success
3. Refresh page and check if data loads
4. Check Supabase table directly

**Common Causes:**
- API not saving correctly → Check API logs
- Frontend not refreshing → Check `handleSaveProfile` calls `fetchProfile()`
- Cache issue → Hard refresh (Ctrl+Shift+R)

### Issue: Can edit other users' profiles

**Debug Steps:**
1. Check `isOwnProfile` calculation
2. Console log: `userId`, `currentUserId`, `currentWalletAddress`
3. Verify they don't match for other users

**Fix:**
- Ensure correct props passed to `FacebookProfile`
- Add server-side authorization (future enhancement)

## Console Logs to Monitor

When testing, you should see these console logs:

### Profile Load:
```
Profile API Response: { user: {...}, followersCount: 0, followingCount: 0 }
userId: 0x...
currentUserId: uuid...
currentWalletAddress: 0x...
```

### Profile Save:
```
Saving profile: { display_name: "...", bio: "...", avatar_url: "..." }
Request URL: /api/users/0x...
Save profile response: { success: true, user: {...}, created: false }
Profile updated successfully!
```

### Setup Screen Decision:
```
Render check: {
  user: false,
  isOwnProfile: true,
  walletAddress: "0x...",
  userId: "0x...",
  currentWalletAddress: "0x...",
  comparison: true
}
```

## Performance Checks

- [ ] Profile page loads in < 2 seconds
- [ ] API responses in < 500ms
- [ ] No N+1 query issues (check Supabase logs)
- [ ] Images load properly
- [ ] No console errors or warnings
- [ ] Smooth transitions when saving

## Security Checks

- [ ] Can only edit own profile
- [ ] Cannot edit other users' profiles
- [ ] Must be authenticated to update profile
- [ ] Wallet address correctly validates
- [ ] No XSS vulnerabilities in bio/display name

## Final Verification

- [ ] Read `IMPLEMENTATION_SUMMARY.md`
- [ ] Understand the UPSERT mechanism
- [ ] Know how to debug profile issues
- [ ] All tests passed
- [ ] No errors in console
- [ ] Database state is correct
- [ ] Code is committed to git

## Next Steps After Testing

Once all tests pass:

1. **Document any custom changes** you made
2. **Set up monitoring** for production errors
3. **Plan for avatar uploads** (if needed) using blob storage
4. **Add rate limiting** to prevent API abuse
5. **Implement server-side auth** checks
6. **Add profile validation** rules (max length, etc.)
7. **Create backup strategy** for user data

## Getting Help

If you encounter issues:

1. Check `IMPLEMENTATION_SUMMARY.md` for architecture details
2. Check `PROFILE_SETUP_GUIDE.md` for troubleshooting
3. Check `FRONTEND_PROFILE_GUIDE.md` for code examples
4. Review console logs for specific errors
5. Check Supabase logs for database errors
6. Run `tests/profile-api.test.ts` to isolate API issues

## Success Criteria

✅ **System is ready** when:
- New users see setup screen
- Profile creation works
- Profile updates work
- Data persists in database
- Other users' profiles viewable
- No console errors
- All tests pass

---

**Status:** [ ] Not Started | [ ] In Progress | [ ] Testing | [ ] Complete

**Date Started:** _____________

**Date Completed:** _____________

**Tested By:** _____________

**Notes:**
