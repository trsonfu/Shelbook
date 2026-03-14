'use client'

import { useState, useEffect } from 'react'
import { User, Post } from '@/types'
import { formatDate } from '@/lib/utils'
import PostCard from '@/components/post/PostCard'
import Link from 'next/link'

interface ProfileProps {
  userId: string
  currentUserId: string
}

export default function Profile({ userId, currentUserId }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const isOwnProfile = userId === currentUserId

  useEffect(() => {
    fetchProfile()
    fetchPosts()
    fetchFollowStatus()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const data = await response.json()
      setUser(data.user)
      setFollowersCount(data.followersCount || 0)
      setFollowingCount(data.followingCount || 0)
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
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchFollowStatus = async () => {
    if (isOwnProfile) return

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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-strong"></div>
        <p className="mt-4 text-muted">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">User not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-24 space-y-8">
      {/* Profile Header – neo glass with floating avatar */}
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 px-5 pt-10 pb-6 shadow-[0_32px_120px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_150%_at_0%_0%,rgba(56,189,248,0.45),transparent),radial-gradient(140%_180%_at_100%_100%,rgba(244,114,182,0.4),transparent)] opacity-50" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end">
          {/* Avatar floating */}
          <div className="relative flex-shrink-0 md:-mt-16">
            <div className="glow-ring relative inline-flex items-center justify-center rounded-full bg-slate-900/70 p-[3px]">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-surface-2/80 shadow-[0_22px_70px_rgba(15,23,42,0.95)]">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar_url}
                    alt={user.display_name || user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-slate-50">
                    {(user.display_name || user.username || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="relative flex-1 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted mb-1">
                  Profile
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {user.display_name || user.username || 'Unknown User'}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {!isOwnProfile && (
                  <button
                    onClick={handleFollow}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 shadow-[0_18px_60px_rgba(16,185,129,0.6)] ${
                      isFollowing
                        ? 'bg-surface-2/80 text-foreground hover:bg-surface'
                        : 'bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 hover:brightness-110'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
                {isOwnProfile && (
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-2 rounded-full bg-surface-2/90 px-4 py-2 text-sm font-medium text-foreground shadow-[0_16px_60px_rgba(15,23,42,0.8)] transition hover:bg-surface"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                      +
                    </span>
                    Create
                  </Link>
                )}
              </div>
            </div>

            {/* Stats – pill group */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-2 text-xs backdrop-blur">
              <span className="rounded-full bg-black/40 px-3 py-1 font-medium">
                {posts.length} posts
              </span>
              <span className="rounded-full bg-black/40 px-3 py-1 font-medium">
                {followersCount} followers
              </span>
              <span className="rounded-full bg-black/40 px-3 py-1 font-medium">
                {followingCount} following
              </span>
              <span className="hidden md:inline-flex rounded-full bg-emerald-400/15 px-3 py-1 font-medium text-emerald-200">
                Joined {formatDate(user.created_at)}
              </span>
            </div>

            {/* Bio as tag bubbles */}
            <div className="space-y-3">
              {user.bio && (
                <p className="max-w-xl text-sm leading-relaxed text-slate-100">
                  {user.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-[11px] text-muted">
                <span className="rounded-full bg-black/30 px-3 py-1 font-mono uppercase tracking-[0.18em]">
                  {user.username}
                </span>
                <span className="rounded-full bg-black/30 px-3 py-1 font-mono">
                  {user.wallet_address.slice(0, 6)}...
                  {user.wallet_address.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid – mosaic style */}
      <section aria-label="Posts">
        {posts.length > 0 ? (
          <div className="grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
            {posts.map((post, index) => {
              const spanClass =
                index % 6 === 0
                  ? 'md:col-span-2 md:row-span-2'
                  : index % 6 === 3
                  ? 'md:col-span-2 md:row-span-1'
                  : 'md:col-span-1 md:row-span-1'

              return (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 ${spanClass}`}
                >
                  {post.file_type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.shelby_file_url}
                      alt={post.caption || 'Post'}
                      className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.04] group-hover:brightness-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.svg'
                      }}
                    />
                  ) : (
                    <div className="relative h-full w-full">
                      <video
                        src={post.shelby_file_url}
                        className="h-full w-full object-cover opacity-90 transition duration-300 ease-out group-hover:opacity-100"
                      />
                      <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                        VIDEO
                      </div>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between text-[11px] text-slate-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" />
                      </svg>
                      {post.likes_count || 0}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1">
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M8 12h.01M12 12h.01M16 12h.01" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                          d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72A7.963 7.963 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {post.comments_count || 0}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="glass-card flex items-center justify-center py-14 text-center">
            <p className="text-muted text-lg">No posts yet</p>
          </div>
        )}
      </section>
    </div>
  )
}
