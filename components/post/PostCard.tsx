'use client'

import { useMemo, useState } from 'react'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [showTapHeart, setShowTapHeart] = useState(false)

  // IG/FB clamp feed aspect ratio to avoid extremely tall/wide media taking over the viewport.
  // Min: 4:5 (0.8) – Max: 1.91:1
  const feedAspectRatio = useMemo(() => {
    const w = post.media_width
    const h = post.media_height
    if (!w || !h || w <= 0 || h <= 0) return 1 // square fallback
    const raw = w / h
    return Math.min(1.91, Math.max(0.8, raw))
  }, [post.media_width, post.media_height])

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleDoubleTap = () => {
    if (!isLiked) {
      void handleLike()
    }
    setShowTapHeart(true)
    window.setTimeout(() => setShowTapHeart(false), 260)
  }

  return (
    <article className="bg-white dark:bg-[#242526] rounded-lg shadow-sm border border-gray-200 dark:border-[#3e4042] overflow-hidden mb-4">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.user_id}`}>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
              {post.user?.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  alt={post.user.display_name || post.user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm text-white font-semibold">
                  {(post.user?.display_name || post.user?.username || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.user_id}`}>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:underline text-[15px]">
                {post.user?.display_name || post.user?.username || 'Unknown User'}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.created_at)}</p>
          </div>
        </div>
        <button className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] flex items-center justify-center transition-colors">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z" />
          </svg>
        </button>
      </div>

      {/* Caption - Before Media (Facebook style) */}
      {post.caption && (
        <div className="px-4 pb-3">
          <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-relaxed whitespace-pre-wrap">
            {post.caption}
          </p>
        </div>
      )}

      {/* Media */}
      <Link href={`/post/${post.id}`}>
        <div
          className="relative w-full bg-black overflow-hidden cursor-pointer"
          style={{ maxHeight: '600px' }}
          onDoubleClick={handleDoubleTap}
        >
          {post.file_type === 'image' ? (
            <img
              src={post.shelby_file_url}
              alt={post.caption || 'Post image'}
              className="w-full object-contain"
              style={{ maxHeight: '600px' }}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.svg'
              }}
            />
          ) : (
            <video
              src={post.shelby_file_url}
              controls
              className="w-full object-contain"
              style={{ maxHeight: '600px' }}
              preload="metadata"
            />
          )}

          {/* Double-tap heart micro interaction */}
          {showTapHeart && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="animate-[tapHeart_260ms_ease-out_forwards] text-pink-400 drop-shadow-[0_0_30px_rgba(244,114,182,0.9)]">
                <svg
                  className="w-20 h-20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Reactions Summary */}
      <div className="px-4 py-2 flex items-center justify-between text-sm border-b border-gray-200 dark:border-[#3e4042]">
        <div className="flex items-center gap-1">
          {likesCount > 0 && (
            <>
              <div className="flex items-center -space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white dark:border-[#242526]">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
              <span className="text-gray-600 dark:text-gray-400 ml-1">{likesCount}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          {post.comments_count && post.comments_count > 0 && (
            <Link href={`/post/${post.id}`} className="hover:underline">
              {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
            </Link>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors flex-1 justify-center ${
              isLiked ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
              />
            </svg>
            <span className="font-medium text-[15px]">Like</span>
          </button>
          
          <Link href={`/post/${post.id}`} className="flex-1">
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors text-gray-600 dark:text-gray-400 justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="font-medium text-[15px]">Comment</span>
            </button>
          </Link>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors text-gray-600 dark:text-gray-400 flex-1 justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="font-medium text-[15px]">Share</span>
          </button>
        </div>
      </div>
    </article>
  )
}
