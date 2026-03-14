'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import clsx from 'clsx'

function IconHome(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 28 28" fill="currentColor">
      <path d="M17.5 23.979 21.25 23.979C21.386 23.979 21.5 23.864 21.5 23.729L21.5 13.979C21.5 13.427 21.949 12.979 22.5 12.979L24.33 12.979 14.017 4.046 3.672 12.979 5.5 12.979C6.052 12.979 6.5 13.427 6.5 13.979L6.5 23.729C6.5 23.864 6.615 23.979 6.75 23.979L10.5 23.979 10.5 17.729C10.5 17.04 11.061 16.479 11.75 16.479L16.25 16.479C16.939 16.479 17.5 17.04 17.5 17.729L17.5 23.979ZM21.25 25.479 17 25.479C16.448 25.479 16 25.031 16 24.479L16 18.327C16 18.135 15.844 17.979 15.652 17.979L12.348 17.979C12.156 17.979 12 18.135 12 18.327L12 24.479C12 25.031 11.552 25.479 11 25.479L6.75 25.479C5.784 25.479 5 24.695 5 23.729L5 14.479 3.069 14.479C2.567 14.479 2.079 14.215 1.868 13.759 1.63 13.245 1.757 12.658 2.175 12.29L13.001 2.912C13.248 2.675 13.608 2.527 13.989 2.521 14.392 2.527 14.753 2.675 15.027 2.937L25.821 12.286C26.239 12.654 26.367 13.241 26.129 13.755 25.918 14.215 25.429 14.479 24.927 14.479L23 14.479 23 23.729C23 24.695 22.216 25.479 21.25 25.479Z" />
    </svg>
  )
}

function IconUsers(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  )
}

function IconVideo(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.5 8.5 16 12l-5.5 3.5v-7Z" />
      <path fillRule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm11-9a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" clipRule="evenodd" />
    </svg>
  )
}

function IconChevronDown(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  )
}

export default function FacebookLeftSidebar() {
  const pathname = usePathname()
  const { account } = useWallet()
  const { user } = useCurrentUser()

  const navItems = [
    {
      icon: <IconHome className="w-7 h-7" />,
      label: 'Home',
      href: '/',
      active: pathname === '/',
    },
    {
      icon: <IconUsers className="w-7 h-7" />,
      label: 'Friends',
      href: '#',
      active: false,
    },
    {
      icon: <IconVideo className="w-7 h-7" />,
      label: 'Watch',
      href: '#',
      active: false,
    },
  ]

  return (
    <aside className="hidden lg:block fixed left-0 top-14 w-72 h-[calc(100vh-3.5rem)] overflow-y-auto px-2 py-4 scrollbar-thin">
      <nav className="space-y-1">
        {/* User Profile Link */}
        {account && (
          <Link
            href={`/profile/${account.address.toString()}` as any}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
          >
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.display_name || user.username}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {account.address.toString().slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-gray-900 dark:text-gray-100 text-[15px] truncate">
              {user?.display_name || user?.username || `${account.address.toString().slice(0, 6)}...${account.address.toString().slice(-4)}`}
            </span>
          </Link>
        )}

        {/* Navigation Items */}
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href as any}
            className={clsx(
              "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
              item.active
                ? "bg-gray-100 dark:bg-[#3a3b3c]"
                : "hover:bg-gray-100 dark:hover:bg-[#3a3b3c]"
            )}
          >
            <div className={clsx(
              "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
              item.active ? "text-blue-500" : "text-gray-600 dark:text-gray-400"
            )}>
              {item.icon}
            </div>
            <span className={clsx(
              "font-medium text-[15px] truncate",
              item.active 
                ? "text-gray-900 dark:text-gray-100" 
                : "text-gray-700 dark:text-gray-300"
            )}>
              {item.label}
            </span>
          </Link>
        ))}

        {/* See More Button */}
        <button className="flex items-center gap-3 px-2 py-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors">
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#4e4f50] flex items-center justify-center flex-shrink-0">
            <IconChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300 text-[15px]">
            See more
          </span>
        </button>
      </nav>

      {/* Shortcuts Section */}
      <div className="mt-6 pt-4 border-t border-gray-300 dark:border-[#3e4042]">
        <div className="px-2 mb-2">
          <h3 className="text-gray-600 dark:text-gray-400 font-semibold text-[15px]">
            Your shortcuts
          </h3>
        </div>
        
        <div className="space-y-1">
          <Link
            href="/create"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl flex-shrink-0">
              +
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300 text-[15px]">
              Create Post
            </span>
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-6 px-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>Privacy · Terms · Advertising · Ad Choices</p>
        <p>Shelbook © 2026</p>
      </div>
    </aside>
  )
}
