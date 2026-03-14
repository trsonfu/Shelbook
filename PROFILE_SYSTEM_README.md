# Profile System - Complete Implementation

> A comprehensive profile management system for the Shelbook social media platform, built with Next.js, Supabase, and the Shelby Protocol.

## 🎯 Overview

This profile system enables users to create, update, and view profiles using their Web3 wallet addresses. It features:

- ✅ **UPSERT Operations** - Create or update profiles in a single API call
- ✅ **Wallet-Based Authentication** - No email/password required
- ✅ **Facebook-Style UI** - Modern, familiar interface
- ✅ **Real-Time Updates** - Immediate UI refresh after changes
- ✅ **Graceful Onboarding** - Welcoming setup screen for new users
- ✅ **Complete Documentation** - Step-by-step guides and examples

## 📚 Documentation Guide

Start with the right document for your needs:

### For Quick Setup (5 minutes)
**→ Start here:** [`QUICK_START.md`](./QUICK_START.md)
- Get running in 5 minutes
- Apply database migrations
- Test the basic flow
- Perfect for first-time setup

### For Testing & Verification
**→ Then use:** [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)
- Complete testing checklist
- Step-by-step verification
- Debugging guides
- Quality assurance

### For Understanding How It Works
**→ Read this:** [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md)
- Complete architecture overview
- How UPSERT works
- Data flow diagrams
- Technical deep-dive

### For Visual Learners
**→ View this:** [`ARCHITECTURE_DIAGRAMS.md`](./ARCHITECTURE_DIAGRAMS.md)
- System flow diagrams
- Database schema
- Component hierarchy
- State management flow

### For Detailed Setup Instructions
**→ Reference this:** [`PROFILE_SETUP_GUIDE.md`](./PROFILE_SETUP_GUIDE.md)
- Database schema details
- API documentation
- Troubleshooting guide
- Security considerations

### For Frontend Development
**→ Use this:** [`FRONTEND_PROFILE_GUIDE.md`](./FRONTEND_PROFILE_GUIDE.md)
- Code examples
- Common patterns
- Best practices
- TypeScript types

## 🚀 Quick Start

### 1. Apply Migrations (2 minutes)

```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/001_initial_schema.sql
-- Then: supabase/migrations/002_complete_schema.sql
```

### 2. Set Environment Variables (1 minute)

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Start & Test (2 minutes)

```bash
npm run dev
# Open http://localhost:3000
# Connect wallet → Click profile → Set up profile
```

**→ Full instructions:** [`QUICK_START.md`](./QUICK_START.md)

## 📁 Project Structure

```
r:/Shelbook/
├── app/
│   ├── (main)/
│   │   └── profile/
│   │       └── [id]/
│   │           └── page.tsx              # Profile page route
│   └── api/
│       └── users/
│           └── [id]/
│               └── route.ts              # Profile API (GET, PATCH)
├── components/
│   └── profile/
│       ├── FacebookProfile.tsx           # Main profile component
│       └── ProfileEditModal.tsx          # Edit modal
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql        # Users table
│       └── 002_complete_schema.sql       # Posts, likes, comments, follows
├── lib/
│   ├── supabase.ts                       # Supabase client
│   └── auth.ts                           # Authentication helpers
├── types/
│   └── index.ts                          # TypeScript types
└── tests/
    └── profile-api.test.ts               # API test suite
```

## 🔑 Key Features

### For End Users

- **Profile Creation**: Set display name, bio, and avatar on first visit
- **Profile Editing**: Update information anytime
- **Profile Viewing**: See other users' profiles and stats
- **Wallet Integration**: No passwords, just connect wallet
- **Modern UI**: Facebook-style design that feels familiar

### For Developers

- **UPSERT API**: Single endpoint for create/update
- **Dual ID Support**: Works with wallet addresses and UUIDs
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error messages
- **Extensible**: Easy to add new fields/features

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Shelby Protocol (Aptos wallet)
- **API**: Next.js Route Handlers

## 📊 Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `wallet_address` | TEXT | Unique wallet address |
| `username` | TEXT | Unique username (auto-generated) |
| `display_name` | TEXT | User's display name |
| `avatar_url` | TEXT | Profile picture URL |
| `bio` | TEXT | User bio/description |
| `created_at` | TIMESTAMP | Account creation time |
| `updated_at` | TIMESTAMP | Last update time |

**→ Full schema:** [`supabase/migrations/`](./supabase/migrations/)

## 🔌 API Endpoints

### GET `/api/users/[id]`

Fetch user profile by wallet address or UUID.

```typescript
// Request
GET /api/users/0x1234567890123456789012345678901234567890

// Response
{
  "user": {
    "id": "uuid",
    "wallet_address": "0x...",
    "display_name": "John Doe",
    "bio": "Hello world",
    "avatar_url": "https://...",
    ...
  },
  "followersCount": 10,
  "followingCount": 5
}
```

### PATCH `/api/users/[id]`

Create or update user profile (UPSERT).

```typescript
// Request
PATCH /api/users/0x1234567890123456789012345678901234567890
Content-Type: application/json

{
  "display_name": "John Doe",
  "bio": "Hello world",
  "avatar_url": "https://example.com/avatar.jpg"
}

// Response
{
  "success": true,
  "user": { /* full user object */ },
  "created": true // indicates if new profile
}
```

**→ Full API docs:** [`PROFILE_SETUP_GUIDE.md`](./PROFILE_SETUP_GUIDE.md#api-details)

## 💡 Usage Examples

### Display Profile in Component

```tsx
import FacebookProfile from '@/components/profile/FacebookProfile'

export default function ProfilePage({ params }) {
  return (
    <FacebookProfile 
      userId={params.id}
      currentUserId={session.userId}
      currentWalletAddress={session.walletAddress}
    />
  )
}
```

### Fetch Profile Data

```tsx
const response = await fetch(`/api/users/${walletAddress}`)
const data = await response.json()

if (data.user) {
  console.log('Profile:', data.user)
} else {
  console.log('User needs to set up profile')
}
```

### Update Profile

```tsx
const response = await fetch(`/api/users/${walletAddress}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    display_name: 'New Name',
    bio: 'New bio',
    avatar_url: 'https://...'
  })
})

const result = await response.json()
console.log('Saved:', result.user)
```

**→ More examples:** [`FRONTEND_PROFILE_GUIDE.md`](./FRONTEND_PROFILE_GUIDE.md)

## 🧪 Testing

### Automated Tests

```bash
# Run API tests
npx tsx tests/profile-api.test.ts
```

### Manual Testing

1. **New User Flow**
   - Connect wallet → Click profile → See setup screen → Create profile

2. **Edit Profile Flow**
   - View own profile → Click edit → Update fields → Save

3. **View Others Flow**
   - Navigate to another user's profile → View their info

**→ Full test guide:** [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Setup screen doesn't show | Check `currentWalletAddress` prop |
| Failed to update profile | Verify Supabase env vars |
| Updates don't persist | Check migrations applied |
| Can edit others' profiles | Verify `isOwnProfile` logic |

**→ Detailed troubleshooting:** [`PROFILE_SETUP_GUIDE.md`](./PROFILE_SETUP_GUIDE.md#troubleshooting)

## 🔐 Security

- **Authentication**: Wallet signature validates identity
- **Authorization**: Users can only edit their own profiles
- **Validation**: All inputs sanitized and validated
- **Rate Limiting**: Consider adding in production
- **HTTPS Only**: Always use secure connections

**Note**: Current implementation has client-side authorization checks. For production, add server-side checks.

## 🎨 Customization

### Add New Profile Fields

1. Add column to database:
```sql
ALTER TABLE users ADD COLUMN location TEXT;
```

2. Update TypeScript type:
```typescript
// types/index.ts
export interface User {
  // ... existing fields
  location?: string
}
```

3. Add to edit modal:
```tsx
// ProfileEditModal.tsx
<input
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  placeholder="Location"
/>
```

4. Update API handler:
```typescript
// app/api/users/[id]/route.ts
const { display_name, bio, avatar_url, location } = body
// ... include in upsert
```

### Customize UI

- Colors: Edit Tailwind classes in components
- Layout: Modify component structure
- Styles: Update `globals.css` for theme

## 📈 Performance

- **Database Indexes**: All foreign keys and frequently queried columns indexed
- **Query Optimization**: Single query for profile with stats
- **Caching**: Consider adding Redis for profile data
- **CDN**: Use for avatar images

## 🚀 Deployment

### Production Checklist

- [ ] Apply all migrations to production database
- [ ] Set production environment variables
- [ ] Enable RLS (Row Level Security) in Supabase
- [ ] Add rate limiting to API routes
- [ ] Set up monitoring and error tracking
- [ ] Configure CDN for static assets
- [ ] Add server-side authorization checks

## 📝 Changelog

### Version 1.0.0 (Initial Release)

- ✅ UPSERT-based profile creation/updates
- ✅ Wallet address and UUID support
- ✅ Facebook-style UI components
- ✅ Complete database schema
- ✅ Comprehensive documentation
- ✅ API test suite

## 🤝 Contributing

To add features or fix bugs:

1. Read [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) to understand architecture
2. Make changes following existing patterns
3. Update relevant documentation
4. Test using [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)
5. Submit PR with clear description

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

- Supabase for the excellent database platform
- Shelby Protocol for Web3 authentication
- Next.js team for the amazing framework

## 📞 Support

- **Documentation**: Start with [`QUICK_START.md`](./QUICK_START.md)
- **Issues**: Check [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md#debugging-common-issues)
- **Examples**: See [`FRONTEND_PROFILE_GUIDE.md`](./FRONTEND_PROFILE_GUIDE.md)
- **Architecture**: Review [`ARCHITECTURE_DIAGRAMS.md`](./ARCHITECTURE_DIAGRAMS.md)

---

**Built with ❤️ for the Shelbook community**

**Ready to start?** → [`QUICK_START.md`](./QUICK_START.md)
