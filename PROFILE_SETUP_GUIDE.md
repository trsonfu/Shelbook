# Profile System Setup Guide

## Overview

This guide explains how to set up and use the profile system in the Shelbook application. The profile system integrates with Supabase and supports creating and updating user profiles using wallet addresses.

## Architecture

### Database Schema

The profile system uses the following tables in Supabase:

1. **users** - Stores user profile information
   - `id` (UUID, primary key)
   - `wallet_address` (TEXT, unique, indexed)
   - `username` (TEXT, unique)
   - `display_name` (TEXT)
   - `avatar_url` (TEXT)
   - `bio` (TEXT)
   - `created_at`, `updated_at` (timestamps)

2. **posts** - User posts
3. **likes** - Post likes
4. **comments** - Post comments
5. **follows** - User follow relationships

### Components

- **FacebookProfile.tsx** - Main profile display component
- **ProfileEditModal.tsx** - Modal for editing profile information
- **page.tsx** (`/profile/[id]`) - Profile page route

### API Routes

- **GET `/api/users/[id]`** - Fetch user profile by wallet address or UUID
- **PATCH `/api/users/[id]`** - Create or update user profile (upsert)

## Setup Instructions

### 1. Apply Database Migrations

Run the following migrations in your Supabase SQL editor:

```bash
# Apply the initial schema (users table)
supabase/migrations/001_initial_schema.sql

# Apply the complete schema (posts, likes, comments, follows)
supabase/migrations/002_complete_schema.sql
```

Or use the Supabase CLI:

```bash
supabase db push
```

### 2. Configure Environment Variables

Ensure you have the following environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Verify Supabase Connection

Check that your Supabase client is properly configured in `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## User Flow

### First-Time Profile Setup

1. User connects their wallet (authentication via Shelby Protocol)
2. User navigates to their profile page `/profile/[wallet_address]`
3. If no profile exists, the "Welcome to Shelbook!" setup screen appears
4. User clicks "Set Up Profile" to open the edit modal
5. User enters:
   - Display Name
   - Bio
   - Avatar URL
6. User clicks "Save"
7. System creates a new user record in Supabase (UPSERT operation)
8. Profile page refreshes and displays the new profile

### Editing Existing Profile

1. User navigates to their own profile
2. User clicks "Edit profile" button
3. Edit modal opens with current profile data pre-filled
4. User modifies fields
5. User clicks "Save"
6. System updates the user record in Supabase
7. Profile page refreshes with updated data

### Viewing Other Users' Profiles

1. User navigates to another user's profile `/profile/[wallet_address]`
2. System fetches and displays:
   - Profile information (avatar, name, bio, wallet address)
   - Followers/following counts
   - User's posts in a grid
   - Follow/Unfollow button

## API Details

### GET `/api/users/[id]`

Fetches a user profile by wallet address or UUID.

**Parameters:**
- `id` - Wallet address (starts with `0x`) or UUID

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "wallet_address": "0x...",
    "username": "user_0x...",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "bio": "Hello world",
    "created_at": "...",
    "updated_at": "..."
  },
  "followersCount": 10,
  "followingCount": 5
}
```

**Response (user not found):**
```json
{
  "error": "User not found",
  "user": null,
  "walletAddress": "0x...",
  "followersCount": 0,
  "followingCount": 0
}
```

### PATCH `/api/users/[id]`

Creates or updates a user profile (UPSERT).

**Parameters:**
- `id` - Wallet address (for new profiles) or UUID (for existing)

**Request Body:**
```json
{
  "display_name": "John Doe",
  "bio": "Hello world",
  "avatar_url": "https://...",
  "username": "johndoe" // Optional, auto-generated if not provided
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* full user object */ },
  "created": true // Indicates if this was a new profile
}
```

## Key Implementation Details

### UPSERT Logic

The PATCH endpoint uses Supabase's `upsert` method with the following configuration:

```typescript
await supabase
  .from('users')
  .upsert(
    {
      wallet_address: walletAddress,
      username: defaultUsername,
      display_name: display_name || null,
      bio: bio || null,
      avatar_url: avatar_url || null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'wallet_address', // Use wallet_address as unique constraint
      ignoreDuplicates: false, // Update if exists
    }
  )
  .select()
  .single()
```

This ensures that:
- If a user with the wallet address doesn't exist, a new record is created
- If a user with the wallet address exists, the record is updated
- The operation is atomic and handles race conditions

### Profile Ownership Detection

The system determines if a profile belongs to the current user by comparing:

1. `userId` (from URL) === `currentUserId` (from session)
2. `userId` === `currentWalletAddress` (from session)
3. `walletAddress` (from API) === `currentWalletAddress`

This supports both UUID-based and wallet address-based profile URLs.

## Troubleshooting

### Profile not showing setup screen

**Symptom:** "User not found" message instead of setup screen

**Solution:**
1. Check that `currentWalletAddress` is being passed from the page component
2. Verify session contains `walletAddress`
3. Check console logs for the ownership detection logic

### Failed to update profile

**Symptom:** Error when saving profile

**Solution:**
1. Check Supabase environment variables are set
2. Verify the `wallet_address` column has a UNIQUE constraint
3. Check browser console for detailed error messages
4. Verify the migration has been applied

### Posts not showing on profile

**Symptom:** Profile loads but posts section is empty

**Solution:**
1. Check that the `posts` table exists and has the correct schema
2. Verify `posts.user_id` foreign key references `users.id`
3. Check that posts are associated with the correct user UUID

## Testing Checklist

- [ ] New user can connect wallet and see setup screen
- [ ] New user can create profile with display name, bio, and avatar
- [ ] Profile page refreshes and shows updated data after creation
- [ ] Existing user can edit their profile
- [ ] Profile edits are saved and displayed immediately
- [ ] Viewing another user's profile shows correct information
- [ ] Follow/unfollow buttons work correctly
- [ ] Posts grid displays user's posts
- [ ] Followers/following counts are accurate
- [ ] Navigation between profiles works correctly

## Next Steps

1. Apply migrations to your Supabase database
2. Test the profile creation flow with a new wallet
3. Test the profile editing flow with an existing profile
4. Verify data persistence in Supabase dashboard
5. Test edge cases (empty fields, invalid URLs, etc.)

## Support

If you encounter any issues, check:
1. Browser console for frontend errors
2. Next.js server logs for backend errors
3. Supabase logs for database errors
4. Network tab for API request/response details
