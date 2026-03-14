'use client'

import Link from 'next/link'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { mockPosts } from '@/lib/mock/posts'

function IconPlus(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="11" fill="white" />
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type StoryItem = {
  id: string
  username: string
  imageUrl: string
}

export default function FacebookStories() {
  const { account } = useWallet()
  const { user } = useCurrentUser()

  const stories: StoryItem[] = mockPosts.slice(0, 5).map((p, i) => ({
    id: `story_${p.id}`,
    username: p.user?.display_name || p.user?.username || `User ${i + 1}`,
    imageUrl: p.shelby_file_url || '',
  }))

  return (
    <div className="bg-white dark:bg-[#242526] rounded-lg shadow-sm border border-gray-200 dark:border-[#3e4042] p-4 mb-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {/* Create Story Card */}
        <Link href="/create">
          <div className="relative flex-shrink-0 w-28 h-48 rounded-lg overflow-hidden cursor-pointer group">
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
        </Link>

        {/* Existing Stories */}
        {stories.map((story, index) => (
          <Link key={story.id} href={`/story/${story.id}`}>
            <div className="relative flex-shrink-0 w-28 h-48 rounded-lg overflow-hidden cursor-pointer group">
              {/* Story Image */}
              <div className="absolute inset-0">
                {story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.username}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
                )}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

              {/* Profile Ring & Avatar */}
              <div className="absolute top-3 left-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#242526] p-0.5">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                      {story.username.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-semibold text-white drop-shadow-lg line-clamp-2">
                  {story.username}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
