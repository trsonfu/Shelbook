'use client'

import { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import CreatePostModal from './CreatePostModal'

function IconPhoto(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 12c.83 0 1.5-.67 1.5-1.5S9.83 9 9 9s-1.5.67-1.5 1.5S8.17 12 9 12zm6.5 5.5L12 13l-3 4h10l-3.5-4.5z" />
    </svg>
  )
}

function IconSmile(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  )
}

export default function CreatePostBox() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { account } = useWallet()
  const { user } = useCurrentUser()

  return (
    <>
      <div className="bg-white dark:bg-[#242526] rounded-lg shadow-sm border border-gray-200 dark:border-[#3e4042] p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          {user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.display_name || user.username}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {account ? account.address.toString().slice(0, 2).toUpperCase() : 'U'}
            </div>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] transition-colors text-gray-500 dark:text-gray-400 text-[15px]"
          >
            What's on your mind?
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-[#3e4042] pt-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors flex-1 justify-center"
            >
              <IconPhoto className="w-6 h-6 text-red-500" />
              <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">
                Photo/video
              </span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors flex-1 justify-center"
            >
              <IconSmile className="w-6 h-6 text-yellow-500" />
              <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">
                Feeling/activity
              </span>
            </button>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          window.location.reload()
        }}
      />
    </>
  )
}
