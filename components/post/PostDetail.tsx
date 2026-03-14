'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Post, Comment } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface PostDetailProps {
  postId: string
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }
      const data = await response.json()
      setPost(data.post)
      setIsLiked(data.post.is_liked || false)
      setLikesCount(data.post.likes_count || 0)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => [...prev, data.comment])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-strong"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Post not found</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 brand-gradient rounded-lg"
        >
          Go Home
        </button>
      </div>
    )
  }

  const detailAspectRatio = (() => {
    const w = post.media_width
    const h = post.media_height
    if (!w || !h || w <= 0 || h <= 0) return 1
    return w / h
  })()

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="glass-card grid gap-0 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-border/60">
          <div className="w-10 h-10 bg-surface-2/80 border border-border rounded-full flex items-center justify-center overflow-hidden">
            {post.user?.avatar_url ? (
              <img
                src={post.user.avatar_url}
                alt={post.user.display_name || post.user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm text-muted">
                {(post.user?.display_name || post.user?.username || 'U')[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <Link href={`/profile/${post.user_id}`}>
              <h3 className="font-semibold hover:underline">
                {post.user?.display_name || post.user?.username || 'Unknown User'}
              </h3>
            </Link>
            <p className="text-sm text-muted">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* Media */}
        <div
          className="relative w-full bg-black/80 overflow-hidden"
          style={{ aspectRatio: String(detailAspectRatio), maxHeight: '80vh' }}
        >
          {post.file_type === 'image' ? (
            <img
              src={post.shelby_file_url}
              alt={post.caption || 'Post image'}
              className="h-full w-full object-contain"
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
              className="h-full w-full object-contain"
              preload="metadata"
            />
          )}
        </div>

        {/* Actions and Caption */}
        <div className="px-4 py-4 flex flex-col gap-4 border-t border-border/60 md:border-t-0 md:border-l">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`transition-colors ${
                isLiked ? 'text-pink-400' : 'text-muted hover:text-pink-400'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {likesCount > 0 && (
            <p className="font-semibold text-xs tracking-wide text-muted-2">
              {likesCount} likes
            </p>
          )}

          {post.caption && (
            <div className="mb-1 text-sm leading-snug">
              <Link href={`/profile/${post.user_id}`}>
                <span className="font-semibold hover:underline">
                  {post.user?.display_name || post.user?.username || 'Unknown User'}
                </span>
              </Link>
              <span className="ml-2 text-foreground/90">{post.caption}</span>
            </div>
          )}

          {/* Comments */}
          <div className="mt-2 flex-1 space-y-3">
            {comments.length > 0 && (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Link href={`/profile/${comment.user_id}`}>
                      <span className="font-semibold hover:underline text-sm">
                        {comment.user?.display_name || comment.user?.username || 'Unknown User'}
                      </span>
                    </Link>
                    <span className="text-sm text-foreground/90">{comment.content}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Form */}
            <form
              onSubmit={handleSubmitComment}
              className="flex gap-2 pt-3 border-t border-border/60 sticky bottom-0 bg-surface/95 backdrop-blur"
            >
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-border/70 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent bg-surface text-sm"
                disabled={submittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-xs font-medium"
              >
                {submittingComment ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
