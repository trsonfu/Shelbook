'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import clsx from 'clsx'

type BottomItem = {
  key: string
  href: string | `#`
  label: string
  icon: React.ReactNode
  match?: (pathname: string) => boolean
}

function IconHome(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 28 28" fill="currentColor">
      <path d="M17.5 23.979 21.25 23.979C21.386 23.979 21.5 23.864 21.5 23.729L21.5 13.979C21.5 13.427 21.949 12.979 22.5 12.979L24.33 12.979 14.017 4.046 3.672 12.979 5.5 12.979C6.052 12.979 6.5 13.427 6.5 13.979L6.5 23.729C6.5 23.864 6.615 23.979 6.75 23.979L10.5 23.979 10.5 17.729C10.5 17.04 11.061 16.479 11.75 16.479L16.25 16.479C16.939 16.479 17.5 17.04 17.5 17.729L17.5 23.979ZM21.25 25.479 17 25.479C16.448 25.479 16 25.031 16 24.479L16 18.327C16 18.135 15.844 17.979 15.652 17.979L12.348 17.979C12.156 17.979 12 18.135 12 18.327L12 24.479C12 25.031 11.552 25.479 11 25.479L6.75 25.479C5.784 25.479 5 24.695 5 23.729L5 14.479 3.069 14.479C2.567 14.479 2.079 14.215 1.868 13.759 1.63 13.245 1.757 12.658 2.175 12.29L13.001 2.912C13.248 2.675 13.608 2.527 13.989 2.521 14.392 2.527 14.753 2.675 15.027 2.937L25.821 12.286C26.239 12.654 26.367 13.241 26.129 13.755 25.918 14.215 25.429 14.479 24.927 14.479L23 14.479 23 23.729C23 24.695 22.216 25.479 21.25 25.479Z" />
    </svg>
  )
}

function IconPlus(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function IconBell(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export default function BottomNav() {
  const pathname = usePathname()
  const { account } = useWallet()
  const { user } = useCurrentUser()

  const items: BottomItem[] = [
    {
      key: 'home',
      href: '/',
      label: 'Home',
      icon: <IconHome className="w-6 h-6" />,
      match: (p) => p === '/',
    },
    {
      key: 'create',
      href: '/',
      label: 'Create',
      icon: <IconPlus className="w-6 h-6" />,
      match: (p) => false,
    },
    {
      key: 'notifications',
      href: '#',
      label: 'Notifications',
      icon: <IconBell className="w-5 h-5" />,
    },
    {
      key: 'profile',
      href: account ? `/profile/${account.address.toString()}` : '#',
      label: 'Profile',
      icon: user?.avatar_url ? (
        <img 
          src={user.avatar_url} 
          alt={user.display_name || user.username}
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : account ? (
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
          {account.address.toString().slice(0, 2).toUpperCase()}
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
          U
        </div>
      ),
      match: (p) => account ? p.startsWith(`/profile/${account.address.toString()}`) : false,
    },
  ]

  return (
    <nav
      aria-label="Primary bottom navigation"
      className="bg-white dark:bg-[#242526] border-t border-gray-200 dark:border-[#3e4042]"
    >
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const active = item.match ? item.match(pathname) : pathname === item.href
          return (
            <Link
              key={item.key}
              href={item.href as any}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors',
                active
                  ? 'text-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span className={clsx(
                'flex items-center justify-center',
                active && 'relative'
              )}>
                {item.icon}
                {active && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}


