'use client'

import { useEffect, useState } from 'react'
import PostCard from './PostCard'
import CreatePostBox from './CreatePostBox'
import FacebookStories from '@/components/story/FacebookStories'
import type { Post } from '@/types'

// Mock posts for demo purposes
const MOCK_POSTS: Post[] = [
  {
    id: 'mock-1',
    user_id: 'demo-user-1',
    shelby_file_id: 'demo-file-1',
    shelby_file_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop',
    file_type: 'image',
    media_width: 800,
    media_height: 600,
    caption: 'Beautiful sunset view from the mountains 🌄 Nothing beats nature\'s artwork!',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'demo-user-1',
      wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
      username: 'nature_lover',
      display_name: 'Alex Chen',
      avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZLDTM0F64Sfx6Hl2jlInpWXomD3XoI-qwlw&s',
      bio: 'Nature photographer',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    likes_count: 42,
    comments_count: 8,
    is_liked: false,
  },
  {
    id: 'mock-2',
    user_id: 'demo-user-2',
    shelby_file_id: 'demo-file-2',
    shelby_file_url: 'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800&h=1000&fit=crop',
    file_type: 'image',
    media_width: 800,
    media_height: 1000,
    caption: 'Just finished my latest coding project! 💻✨ Building the future one line at a time.',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'demo-user-2',
      wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12',
      username: 'dev_sarah',
      display_name: 'Sarah Johnson',
      avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZLDTM0F64Sfx6Hl2jlInpWXomD3XoI-qwlw&s',
      bio: 'Full-stack developer',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    likes_count: 127,
    comments_count: 15,
    is_liked: true,
  },
  {
    id: 'mock-3',
    user_id: 'demo-user-3',
    shelby_file_id: 'demo-file-3',
    shelby_file_url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&h=800&fit=crop',
    file_type: 'image',
    media_width: 800,
    media_height: 800,
    caption: 'Coffee and creativity ☕️📝 My favorite way to start the day!',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'demo-user-3',
      wallet_address: '0x7890abcdef1234567890abcdef1234567890abcd',
      username: 'creative_mike',
      display_name: 'Mike Rodriguez',
      avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZLDTM0F64Sfx6Hl2jlInpWXomD3XoI-qwlw&s',
      bio: 'Designer & Artist',
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    likes_count: 89,
    comments_count: 12,
    is_liked: false,
  },
]

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
        
        const fetchedPosts = data.posts || []
        
        // If no posts from API, show mock posts for demo
        if (fetchedPosts.length === 0) {
          console.log('No posts from API, showing mock posts for demo')
          setPosts(MOCK_POSTS)
        } else {
          setPosts(fetchedPosts)
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
        // Show mock posts even on error for demo purposes
        console.log('Error fetching posts, showing mock posts for demo')
        setPosts(MOCK_POSTS)
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
      
      {posts.length > 0 && posts[0].id.startsWith('mock-') && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            These are demo posts. Create your first post to see your own content!
          </p>
        </div>
      )}
    </div>
  )
}
