'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

function IconSearch(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  )
}

function IconMoreHoriz(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z" />
    </svg>
  )
}

function IconCircle(props: { className?: string; online?: boolean }) {
  return (
    <div className={props.className}>
      <div className={`w-2.5 h-2.5 rounded-full ${props.online ? 'bg-green-500' : 'bg-gray-400'}`} />
    </div>
  )
}

type Contact = {
  id: string
  name: string
  online: boolean
}

export default function FacebookRightSidebar() {
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    // Mock contacts - in real app, fetch from API
    setContacts([
      { id: '1', name: 'Alice Chen', online: true },
      { id: '2', name: 'Bob Smith', online: true },
      { id: '3', name: 'Carol White', online: false },
      { id: '4', name: 'David Lee', online: true },
      { id: '5', name: 'Emma Wilson', online: false },
      { id: '6', name: 'Frank Zhang', online: true },
      { id: '7', name: 'Grace Park', online: false },
      { id: '8', name: 'Henry Adams', online: true },
    ])
  }, [])

  return (
    <aside className="hidden xl:block fixed right-0 top-14 w-80 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-4 scrollbar-thin">
      {/* Sponsored Section */}
      <div className="mb-4">
        <h3 className="text-gray-600 dark:text-gray-400 font-semibold text-[15px] mb-3">
          Sponsored
        </h3>
        
        <Link
          href="#"
          className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
        >
          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
              Discover Web3 Storage
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              shelby.xyz
            </p>
          </div>
        </Link>
      </div>

      <div className="border-t border-gray-300 dark:border-[#3e4042] my-4" />

      {/* Contacts Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 dark:text-gray-400 font-semibold text-[15px]">
            Contacts
          </h3>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-[#4e4f50] flex items-center justify-center transition-colors">
              <IconSearch className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-[#4e4f50] flex items-center justify-center transition-colors">
              <IconMoreHoriz className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              className="flex items-center gap-3 px-2 py-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
            >
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <IconCircle 
                  online={contact.online}
                  className="absolute bottom-0 right-0 w-3 h-3 bg-white dark:bg-[#242526] rounded-full flex items-center justify-center"
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {contact.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Group Conversations */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 dark:text-gray-400 font-semibold text-[15px]">
            Group conversations
          </h3>
        </div>

        <div className="space-y-1">
          <button className="flex items-center gap-3 px-2 py-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              DEV
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              Dev Team Chat
            </span>
          </button>

          <button className="flex items-center gap-3 px-2 py-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              WEB3
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              Web3 Enthusiasts
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
