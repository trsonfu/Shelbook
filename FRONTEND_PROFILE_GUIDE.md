# Frontend Profile Integration Guide

## Quick Reference for Using the Profile System

### 1. Display a User Profile

```tsx
import FacebookProfile from '@/components/profile/FacebookProfile'

// In your page component
export default function ProfilePage({ params }) {
  const session = await getSession()
  const { id } = await params
  
  return (
    <FacebookProfile 
      userId={id}                           // Wallet address or UUID
      currentUserId={session.userId}        // Current user's UUID
      currentWalletAddress={session.walletAddress} // Current user's wallet
    />
  )
}
```

### 2. Edit Profile Modal

The `FacebookProfile` component automatically handles the edit modal. When a user views their own profile, they see an "Edit profile" button that opens the modal.

For new users, a setup screen appears automatically with a "Set Up Profile" button.

### 3. Fetch User Data (Client-Side)

```tsx
'use client'

const [user, setUser] = useState(null)

useEffect(() => {
  async function fetchProfile() {
    const response = await fetch(`/api/users/${walletAddress}`)
    const data = await response.json()
    
    if (data.user) {
      setUser(data.user)
    } else {
      // User doesn't exist yet - show setup UI
      console.log('User not found, wallet:', data.walletAddress)
    }
  }
  
  fetchProfile()
}, [walletAddress])
```

### 4. Create/Update Profile (Client-Side)

```tsx
async function saveProfile(profileData) {
  const response = await fetch(`/api/users/${walletAddress}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      display_name: profileData.displayName,
      bio: profileData.bio,
      avatar_url: profileData.avatarUrl
    })
  })
  
  const result = await response.json()
  
  if (result.success) {
    console.log('Profile saved:', result.user)
    // Refresh profile display
    setUser(result.user)
  } else {
    console.error('Failed to save:', result.error)
  }
}
```

### 5. Navigate to Profile

Use the wallet address in the URL:

```tsx
import Link from 'next/link'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

export function ProfileLink() {
  const { account } = useWallet()
  
  if (!account) return null
  
  const walletAddress = account.address.toString()
  
  return (
    <Link href={`/profile/${walletAddress}`}>
      View My Profile
    </Link>
  )
}
```

### 6. Display User Avatar

```tsx
function UserAvatar({ user }) {
  if (user?.avatar_url) {
    return (
      <img 
        src={user.avatar_url} 
        alt={user.display_name || user.username}
        className="w-10 h-10 rounded-full object-cover"
      />
    )
  }
  
  // Fallback: show initials
  const initials = user?.wallet_address?.slice(2, 4).toUpperCase() || 'U'
  
  return (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
      {initials}
    </div>
  )
}
```

### 7. Check if Profile is Own Profile

```tsx
function isOwnProfile(userId, currentUserId, currentWalletAddress) {
  return (
    userId === currentUserId ||
    userId === currentWalletAddress
  )
}

// Usage
const canEdit = isOwnProfile(profileUserId, session.userId, session.walletAddress)

{canEdit && (
  <button onClick={openEditModal}>
    Edit Profile
  </button>
)}
```

### 8. Handle Profile Not Found

```tsx
async function fetchProfile(userId) {
  const response = await fetch(`/api/users/${userId}`)
  const data = await response.json()
  
  if (!data.user) {
    // Check if this is the current user's profile
    if (data.walletAddress === currentWalletAddress) {
      // Show setup UI
      return { needsSetup: true, walletAddress: data.walletAddress }
    } else {
      // Show "User not found" message
      return { notFound: true }
    }
  }
  
  return { user: data.user }
}
```

### 9. Display Profile Information

```tsx
function ProfileInfo({ user }) {
  return (
    <div>
      <h1>{user.display_name || user.username || 'Anonymous'}</h1>
      
      {user.username && (
        <p className="text-gray-500">@{user.username}</p>
      )}
      
      {user.bio && (
        <p className="mt-2">{user.bio}</p>
      )}
      
      <p className="text-sm text-gray-400 mt-2">
        {user.wallet_address.slice(0, 10)}...{user.wallet_address.slice(-8)}
      </p>
    </div>
  )
}
```

### 10. Handle Form Submission

```tsx
function ProfileEditForm({ initialData, onSave }) {
  const [formData, setFormData] = useState({
    display_name: initialData?.display_name || '',
    bio: initialData?.bio || '',
    avatar_url: initialData?.avatar_url || ''
  })
  const [isSaving, setIsSaving] = useState(false)
  
  async function handleSubmit(e) {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.display_name}
        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
        placeholder="Display Name"
      />
      
      <textarea
        value={formData.bio}
        onChange={(e) => setFormData({...formData, bio: e.target.value})}
        placeholder="Bio"
      />
      
      <input
        type="url"
        value={formData.avatar_url}
        onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
        placeholder="Avatar URL"
      />
      
      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
```

## Common Patterns

### Pattern 1: Load Profile on Mount

```tsx
useEffect(() => {
  fetchProfile()
}, [userId])
```

### Pattern 2: Refresh After Save

```tsx
async function handleSave(data) {
  await saveProfile(data)
  await fetchProfile() // Refresh to get latest data
}
```

### Pattern 3: Optimistic Update

```tsx
async function handleSave(data) {
  // Update UI immediately
  setUser(prev => ({ ...prev, ...data }))
  
  try {
    // Save to backend
    await saveProfile(data)
  } catch (error) {
    // Revert on error
    await fetchProfile()
  }
}
```

## Error Handling

```tsx
try {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update profile')
  }
  
  return result.user
} catch (error) {
  console.error('Profile update error:', error)
  
  if (error.message.includes('unique constraint')) {
    alert('Username is already taken')
  } else if (error.message.includes('not found')) {
    alert('User not found')
  } else {
    alert('Failed to update profile. Please try again.')
  }
}
```

## TypeScript Types

```typescript
import { User } from '@/types'

interface ProfileProps {
  userId: string
  currentUserId: string
  currentWalletAddress?: string
}

interface ProfileEditData {
  display_name: string
  bio: string
  avatar_url: string
}

interface ProfileAPIResponse {
  user: User | null
  walletAddress?: string
  followersCount: number
  followingCount: number
}
```

## Best Practices

1. **Always check for null users** - A user might not have set up their profile yet
2. **Use wallet address for new profiles** - UUIDs are only for existing users
3. **Refresh after mutations** - Call `fetchProfile()` after creating/updating
4. **Handle loading states** - Show spinners during API calls
5. **Validate avatar URLs** - Check if image loads before displaying
6. **Sanitize user input** - Trim whitespace, check for empty strings
7. **Show meaningful errors** - Help users understand what went wrong
8. **Support both UUID and wallet address** - The API handles both formats

## Debugging Tips

1. Check console logs in `FacebookProfile.tsx` - It logs API responses
2. Verify session data - Ensure `walletAddress` is in the session
3. Check Network tab - Inspect API request/response payloads
4. Test with direct API calls - Use curl or Postman to isolate issues
5. Verify database state - Check Supabase dashboard for actual data
