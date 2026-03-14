'use client'

import { useState, useEffect } from 'react'
import { User, Post } from '@/types'
import Link from 'next/link'
import CreatePostModal from '@/components/post/CreatePostModal'
import ProfileEditModal from '@/components/profile/ProfileEditModal'

interface FacebookProfileProps {
  userId: string
  currentUserId: string
  currentWalletAddress?: string
}

function IconEdit(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  )
}

function IconFriends(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}

function IconPlus(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  )
}

export default function FacebookProfile({ userId, currentUserId, currentWalletAddress }: FacebookProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  
  // Check if this is the user's own profile by comparing both UUID and wallet address
  const isOwnProfile = userId === currentUserId || 
                       (currentWalletAddress && userId === currentWalletAddress) ||
                       (walletAddress && currentWalletAddress && walletAddress === currentWalletAddress)

  useEffect(() => {
    fetchProfile()
    fetchPosts()
    fetchFollowStatus()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      
      console.log('Profile API Response:', data)
      console.log('userId:', userId)
      console.log('currentUserId:', currentUserId)
      console.log('currentWalletAddress:', currentWalletAddress)
      
      if (data.user) {
        setUser(data.user)
        setFollowersCount(data.followersCount || 0)
        setFollowingCount(data.followingCount || 0)
      } else if (data.walletAddress) {
        // User not found but we have wallet address
        console.log('Setting walletAddress from API:', data.walletAddress)
        setWalletAddress(data.walletAddress)
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?userId=${userId}`)
      if (!response.ok) {
        return
      }
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchFollowStatus = async () => {
    if (isOwnProfile || !user) return

    try {
      const response = await fetch(`/api/users/${userId}/follow`)
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing || false)
      }
    } catch (error) {
      console.error('Error fetching follow status:', error)
    }
  }

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setIsFollowing(!isFollowing)
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  const handleSaveProfile = async (data: { display_name: string; bio: string; avatar_url: string }) => {
    try {
      console.log('Saving profile:', data)
      console.log('Request URL:', `/api/users/${userId}`)

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log('Save profile response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile')
      }

      // Update local state with the new user data
      setUser(result.user)
      setWalletAddress(result.user.wallet_address)
      setIsEditModalOpen(false)
      
      // Optionally refetch to ensure we have the latest data
      await fetchProfile()
      
      console.log('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(error instanceof Error ? error.message : 'Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    )
  }

  // Show setup profile UI if user doesn't exist but it's their own profile
  console.log('Render check:', { 
    user: !!user, 
    isOwnProfile, 
    walletAddress,
    userId,
    currentWalletAddress,
    comparison: userId === currentWalletAddress 
  })
  
  // Check if it's own profile even without walletAddress state (use direct comparison)
  const isDefinitelyOwnProfile = userId === currentUserId || 
                                  (currentWalletAddress && userId === currentWalletAddress) ||
                                  (walletAddress && currentWalletAddress && walletAddress === currentWalletAddress)
  
  if (!user && isDefinitelyOwnProfile) {
    return (
      <>
        <div className="max-w-[600px] mx-auto px-4 py-12">
          <div className="bg-white dark:bg-[#242526] rounded-lg shadow-lg p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
              {(walletAddress || userId).slice(2, 4).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Shelbook!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Let's set up your profile to get started
            </p>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Set Up Profile
            </button>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-[#3a3b3c] rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Wallet:</strong> {(walletAddress || userId).slice(0, 10)}...{(walletAddress || userId).slice(-8)}
              </p>
            </div>
          </div>
        </div>

        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
          initialData={{}}
        />
      </>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">User not found</p>
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          This user hasn't set up their profile yet
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-[1100px] mx-auto">
        {/* Cover Photo + Profile Info */}
        <div className="bg-white dark:bg-[#242526] rounded-b-lg shadow-sm">
          {/* Cover Photo */}
          <div className="relative h-[348px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
            {/* Optional: Add cover photo here */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Profile Info Section */}
          <div className="px-4 pb-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-10 md:-mt-8">
              {/* Avatar + Name */}
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="w-40 h-40 rounded-full border-4 border-white dark:border-[#242526] bg-blue-500 flex items-center justify-center overflow-hidden shadow-lg">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name || user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-white">
                        {(user.display_name || user.username || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name + Stats */}
                <div className="pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {user.display_name || user.username || 'Unknown User'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 md:mt-0 md:pb-4">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      <IconPlus className="w-5 h-5" />
                      Add to story
                    </button>
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-[#4e4f50] text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors"
                    >
                      <IconEdit className="w-5 h-5" />
                      Edit profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-colors ${
                        isFollowing
                          ? 'bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-[#4e4f50] text-gray-900 dark:text-gray-100'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <IconFriends className="w-5 h-5" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-[#4e4f50] text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors">
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                {user.bio}
              </div>
            )}

            {/* Tabs */}
            <div className="mt-4 border-t border-gray-300 dark:border-[#3e4042]">
              <div className="flex gap-1">
                <button className="px-4 py-3 font-semibold text-blue-500 border-b-2 border-blue-500">
                  Posts
                </button>
                <button className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-t-lg">
                  About
                </button>
                <button className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-t-lg">
                  Friends
                </button>
                <button className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-t-lg">
                  Photos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-4">
          {isOwnProfile && (
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow-sm border border-gray-200 dark:border-[#3e4042] p-4 mb-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user.display_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-left">What's on your mind?</span>
              </button>
            </div>
          )}

          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="group relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-800"
                >
                  {post.file_type === 'image' ? (
                    <img
                      src={post.shelby_file_url}
                      alt={post.caption || 'Post'}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <video
                      src={post.shelby_file_url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white font-semibold">
                      <span className="flex items-center gap-1">
                        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" />
                        </svg>
                        {post.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments_count || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow-sm border border-gray-200 dark:border-[#3e4042] p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No posts yet</p>
              {isOwnProfile && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Create your first post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <>
          <CreatePostModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false)
              fetchPosts()
            }}
          />
          <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveProfile}
            initialData={{
              display_name: user?.display_name,
              bio: user?.bio,
              avatar_url: user?.avatar_url,
            }}
          />
        </>
      )}
    </>
  )
}
