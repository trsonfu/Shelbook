'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import clsx from 'clsx'

function IconHome(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.464 1.286C10.294.803 11.092.5 12 .5c.908 0 1.706.303 2.536.786.795.462 1.7 1.142 2.815 2.015l2.232 1.744c1.52 1.19 2.377 1.862 2.955 2.553.549.656.922 1.284 1.112 1.984.203.744.203 1.54.203 2.6v.956c0 1.557 0 2.698-.095 3.6-.099.933-.306 1.645-.727 2.268-.29.43-.64.805-1.046 1.118-.588.453-1.258.73-2.03.913-.906.214-2.036.214-3.574.214h-.612c-.87 0-1.607 0-2.205-.044-.617-.045-1.14-.14-1.635-.38a4 4 0 0 1-1.753-1.753c-.24-.495-.335-1.018-.38-1.635-.044-.598-.044-1.335-.044-2.205v-2.205c0-.87 0-1.607-.044-2.205-.045-.617-.14-1.14-.38-1.635a4 4 0 0 0-1.753-1.753c-.495-.24-1.018-.335-1.635-.38C7.607 7 6.87 7 6 7H5.388c-1.538 0-2.668 0-3.574.214-.772.183-1.442.46-2.03.913a4.998 4.998 0 0 0-1.046 1.118c-.421.623-.628 1.335-.727 2.268C-2.084 12.302-2.084 13.443-2.084 15v.956c0 1.06 0 1.856.203 2.6.19.7.563 1.328 1.112 1.984.578.691 1.435 1.363 2.955 2.553l2.232 1.744c1.115.873 2.02 1.553 2.815 2.015.83.483 1.628.786 2.536.786.908 0 1.706-.303 2.536-.786.795-.462 1.7-1.142 2.815-2.015l2.232-1.744c1.52-1.19 2.377-1.862 2.955-2.553a5.002 5.002 0 0 0 1.112-1.984c.203-.744.203-1.54.203-2.6V15c0-1.557 0-2.698-.095-3.6-.099-.933-.306-1.645-.727-2.268a4.998 4.998 0 0 0-1.046-1.118c-.588-.453-1.258-.73-2.03-.913C17.332 7 16.202 7 14.664 7h-.612c-.87 0-1.607 0-2.205.044-.617.045-1.14.14-1.635.38a4 4 0 0 1-1.753 1.753c-.495.24-1.018.335-1.635.38C6.207 9.6 5.47 9.6 4.6 9.6v2.205c0 .87 0 1.607.044 2.205.045.617.14 1.14.38 1.635a4 4 0 0 0 1.753 1.753c.495.24 1.018.335 1.635.38.598.044 1.335.044 2.205.044h2.205c.87 0 1.607 0 2.205-.044.617-.045 1.14-.14 1.635-.38a4 4 0 0 0 1.753-1.753c.24-.495.335-1.018.38-1.635.044-.598.044-1.335.044-2.205V9.6c.87 0 1.607 0 2.205-.044.617-.045 1.14-.14 1.635-.38a4 4 0 0 0 1.753-1.753c.24-.495.335-1.018.38-1.635.044-.598.044-1.335.044-2.205V1.378c-1.115-.873-2.02-1.553-2.815-2.015C13.706.803 12.908.5 12 .5c-.908 0-1.706.303-2.536.786z" />
    </svg>
  )
}

function IconExplore(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
    </svg>
  )
}

function IconUsers(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-7 7.5a7.5 7.5 0 1 1 15 0v.5H3.5v-.5a7.5 7.5 0 0 1 7.5-7.5Zm-6-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 3a4 4 0 0 1 4-4H13a4 4 0 0 1 4 4v1H0v-1a4 4 0 0 1 4-4Z" />
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

function IconStorefront(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.588 3.227A3.125 3.125 0 0 1 4.58 1h14.84c1.38 0 2.597.905 2.993 2.227l.816 2.719a6.47 6.47 0 0 1 .272 1.854A5.183 5.183 0 0 1 22 11.5v4.25c0 .414.336.75.75.75s.75.336.75.75v2.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V18h-15v2.25a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-2.75c0-.414.336-.75.75-.75s.75-.336.75-.75V11.5a5.183 5.183 0 0 1-1.5-3.7c0-.638.092-1.265.272-1.854l.816-2.719Z" />
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

  const navItems = [
    {
      icon: <IconHome className="w-7 h-7" />,
      label: 'Home',
      href: '/',
      active: pathname === '/',
    },
    {
      icon: <IconExplore className="w-7 h-7" />,
      label: 'Explore',
      href: '/explore',
      active: pathname.startsWith('/explore'),
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
    {
      icon: <IconStorefront className="w-7 h-7" />,
      label: 'Marketplace',
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
            href={`/profile/${account.address.toString()}`}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {account.address.toString().slice(0, 2).toUpperCase()}
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100 text-[15px] truncate">
              {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
            </span>
          </Link>
        )}

        {/* Navigation Items */}
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
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
