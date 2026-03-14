'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import clsx from 'clsx'

function IconHome(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z" />
    </svg>
  )
}

function IconHomeAlt(props: { className?: string }) {
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
  const { user } = useCurrentUser()
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
            <img 
              src="/logo.png" 
              alt="Shelbook" 
              className="w-10 h-10 object-contain"
            />
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
            <IconHomeAlt className="w-7 h-7" />
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
          
          {/* Profile Avatar Button */}
          {account && (
            <Link
              href={`/profile/${account.address.toString()}`}
              className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 overflow-hidden",
                isActive(`/profile/${account.address.toString()}`) 
                  ? "border-blue-500" 
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.display_name || user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {account.address.toString().slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </Link>
          )}
          
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
