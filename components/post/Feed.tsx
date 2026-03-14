'use client'

import { useEffect, useState } from 'react'
import PostCard from './PostCard'
import CreatePostBox from './CreatePostBox'
import FacebookStories from '@/components/story/FacebookStories'
import type { Post } from '@/types'

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/posts')
        
        const data = await response.json()
        
        // Handle both error responses and successful responses
        if (data.error) {
          console.warn('Posts API warning:', data.error)
        }
        
        setPosts(data.posts || [])
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err instanceof Error ? err.message : 'Failed to load posts')
        setPosts([]) // Set empty posts on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div>
        <FacebookStories />
        <CreatePostBox />
        <div className="text-center py-12 bg-white dark:bg-[#242526] rounded-lg shadow-sm border border-gray-200 dark:border-[#3e4042]">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No posts yet</p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Be the first to share something!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stories Section */}
      <FacebookStories />

      {/* Create Post Box */}
      <CreatePostBox />

      {/* Posts Feed */}
      <section aria-label="Feed">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  )
}
