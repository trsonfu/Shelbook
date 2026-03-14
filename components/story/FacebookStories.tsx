'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import CreateStoryModal from './CreateStoryModal'

function IconPlus(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="11" fill="white" />
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type Story = {
  id: string
  user_id: string
  shelby_file_url: string
  file_type: string
  caption?: string
  created_at: string
  user?: {
    username: string
    display_name?: string
    avatar_url?: string
  }
}

export default function FacebookStories() {
  const { account } = useWallet()
  const { user } = useCurrentUser()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-[#242526] rounded-lg shadow-sm border border-gray-200 dark:border-[#3e4042] p-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {/* Create Story Card */}
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-shrink-0"
          >
            <div className="relative w-28 h-48 rounded-lg overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-gray-200 dark:bg-[#3a3b3c] flex items-center justify-center">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.display_name || user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {account ? account.address.toString().slice(0, 2).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#242526] p-2 group-hover:bg-gray-50 dark:group-hover:bg-[#3a3b3c] transition-colors">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#242526] flex items-center justify-center border-4 border-white dark:border-[#242526]">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <IconPlus className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 text-center mt-3">
                  Create story
                </p>
              </div>
            </div>
          </button>

          {/* Real Stories */}
          {stories.map((story) => (
            <Link key={story.id} href={`/story/${story.id}`}>
              <div className="relative flex-shrink-0 w-28 h-48 rounded-lg overflow-hidden cursor-pointer group">
                {/* Story Image/Video */}
                <div className="absolute inset-0">
                  {story.file_type === 'image' ? (
                    <img
                      src={story.shelby_file_url}
                      alt={story.user?.display_name || story.user?.username}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={story.shelby_file_url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

                {/* Profile Ring & Avatar */}
                <div className="absolute top-3 left-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#242526] p-0.5">
                      {story.user?.avatar_url ? (
                        <img
                          src={story.user.avatar_url}
                          alt={story.user.display_name || story.user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {(story.user?.display_name || story.user?.username || 'U').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-semibold text-white drop-shadow-lg line-clamp-2">
                    {story.user?.display_name || story.user?.username || 'User'}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {/* Loading State */}
          {loading && stories.length === 0 && (
            <div className="flex-shrink-0 w-28 h-48 rounded-lg bg-gray-200 dark:bg-[#3a3b3c] animate-pulse" />
          )}
        </div>
      </div>

      <CreateStoryModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchStories}
      />
    </>
  )
}
