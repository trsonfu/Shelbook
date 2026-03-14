'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector'
import clsx from 'clsx'

function IconHome(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.464 1.286C10.294.803 11.092.5 12 .5c.908 0 1.706.303 2.536.786.795.462 1.7 1.142 2.815 2.015l2.232 1.744c1.52 1.19 2.377 1.862 2.955 2.553.549.656.922 1.284 1.112 1.984.203.744.203 1.54.203 2.6v.956c0 1.557 0 2.698-.095 3.6-.099.933-.306 1.645-.727 2.268-.29.43-.64.805-1.046 1.118-.588.453-1.258.73-2.03.913-.906.214-2.036.214-3.574.214h-.612c-.87 0-1.607 0-2.205-.044-.617-.045-1.14-.14-1.635-.38a4 4 0 0 1-1.753-1.753c-.24-.495-.335-1.018-.38-1.635-.044-.598-.044-1.335-.044-2.205v-2.205c0-.87 0-1.607-.044-2.205-.045-.617-.14-1.14-.38-1.635a4 4 0 0 0-1.753-1.753c-.495-.24-1.018-.335-1.635-.38C7.607 7 6.87 7 6 7H5.388c-1.538 0-2.668 0-3.574.214-.772.183-1.442.46-2.03.913a4.998 4.998 0 0 0-1.046 1.118c-.421.623-.628 1.335-.727 2.268C-2.084 12.302-2.084 13.443-2.084 15v.956c0 1.06 0 1.856.203 2.6.19.7.563 1.328 1.112 1.984.578.691 1.435 1.363 2.955 2.553l2.232 1.744c1.115.873 2.02 1.553 2.815 2.015.83.483 1.628.786 2.536.786.908 0 1.706-.303 2.536-.786.795-.462 1.7-1.142 2.815-2.015l2.232-1.744c1.52-1.19 2.377-1.862 2.955-2.553a5.002 5.002 0 0 0 1.112-1.984c.203-.744.203-1.54.203-2.6V15c0-1.557 0-2.698-.095-3.6-.099-.933-.306-1.645-.727-2.268a4.998 4.998 0 0 0-1.046-1.118c-.588-.453-1.258-.73-2.03-.913C17.332 7 16.202 7 14.664 7h-.612c-.87 0-1.607 0-2.205.044-.617.045-1.14.14-1.635.38a4 4 0 0 1-1.753 1.753c-.495.24-1.018.335-1.635.38C6.207 9.6 5.47 9.6 4.6 9.6v2.205c0 .87 0 1.607.044 2.205.045.617.14 1.14.38 1.635a4 4 0 0 0 1.753 1.753c.495.24 1.018.335 1.635.38.598.044 1.335.044 2.205.044h2.205c.87 0 1.607 0 2.205-.044.617-.045 1.14-.14 1.635-.38a4 4 0 0 0 1.753-1.753c.24-.495.335-1.018.38-1.635.044-.598.044-1.335.044-2.205V9.6c.87 0 1.607 0 2.205-.044.617-.045 1.14-.14 1.635-.38a4 4 0 0 0 1.753-1.753c.24-.495.335-1.018.38-1.635.044-.598.044-1.335.044-2.205V1.378c-1.115-.873-2.02-1.553-2.815-2.015C13.706.803 12.908.5 12 .5c-.908 0-1.706.303-2.536.786z" />
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

function IconExplore(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
    </svg>
  )
}

function IconPlus(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function IconBell(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.996a7.49 7.49 0 0 1 7.496 7.25l.004.25v4.097l1.38 3.156a1.25 1.25 0 0 1-1.145 1.75L15 18.502a3 3 0 0 1-5.995.177L9 18.499H4.265a1.25 1.25 0 0 1-1.145-1.75l1.38-3.156V9.496a7.5 7.5 0 0 1 7.5-7.5Zm1 16.5h-2a1 1 0 0 0 1.993.117L13 18.496Z" />
    </svg>
  )
}

function IconMenu(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z" />
    </svg>
  )
}

function IconSearch(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  )
}

export default function FacebookHeader() {
  const pathname = usePathname()
  const { account } = useWallet()
  const [searchFocused, setSearchFocused] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-[#3e4042] shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-2 flex-1 min-w-0 max-w-xs">
          <Link href="/" className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
          </Link>
          
          <div className={clsx(
            "relative flex-1 hidden sm:block",
            searchFocused && "flex-1"
          )}>
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Shelbook"
              className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-100 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Center: Navigation Icons */}
        <nav className="hidden md:flex items-center justify-center gap-2 flex-1 max-w-xl">
          <Link
            href="/"
            className={clsx(
              "relative flex items-center justify-center w-28 h-12 rounded-lg transition-colors",
              isActive('/') 
                ? "text-blue-500" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]"
            )}
          >
            <IconHome className="w-6 h-6" />
            {isActive('/') && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </Link>
          
          <Link
            href="#"
            className="flex items-center justify-center w-28 h-12 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
          >
            <IconUsers className="w-6 h-6" />
          </Link>
          
          <Link
            href="/explore"
            className={clsx(
              "relative flex items-center justify-center w-28 h-12 rounded-lg transition-colors",
              isActive('/explore') 
                ? "text-blue-500" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]"
            )}
          >
            <IconExplore className="w-6 h-6" />
            {isActive('/explore') && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </Link>
        </nav>

        {/* Right: Actions & Profile */}
        <div className="flex items-center justify-end gap-2 flex-1">
          <Link
            href="/create"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-[#4e4f50] transition-colors"
          >
            <IconPlus className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </Link>
          
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-[#4e4f50] transition-colors">
            <IconBell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          <div className="hidden sm:block">
            <XChainWalletSelector size="sm" />
          </div>
          
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-[#4e4f50] transition-colors md:hidden">
            <IconMenu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>
    </header>
  )
}
