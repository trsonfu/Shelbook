'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector'
import ThemeToggle from '@/components/layout/ThemeToggle'

type BaseLinkProps = LinkProps<string>

type NavItem = {
  key: string
  label: string
  href: BaseLinkProps['href']
  icon: React.ReactNode
  match?: (pathname: string) => boolean
}

function IconInstagram(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M16 11.37a4 4 0 1 1-7.74 1.33 4 4 0 0 1 7.74-1.33Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  )
}

function IconHome(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10.5V21h14V10.5" />
    </svg>
  )
}

function IconSearch(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  )
}

function IconExplore(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
    </svg>
  )
}

function IconHeart(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function IconMenu(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  )
}

function IconMoon(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}

function NavRow(
  props: Omit<BaseLinkProps, 'href'> & {
    href: BaseLinkProps['href']
    icon: React.ReactNode
    label: string
    active?: boolean
  }
) {
  return (
    <Link
      href={props.href}
      className={clsx(
        'group/item relative flex items-center gap-0 rounded-2xl px-4 py-3 text-foreground transition',
        'hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        props.active && 'bg-surface-2',
      )}
      aria-current={props.active ? 'page' : undefined}
    >
      <span className="inline-flex w-6 h-6 items-center justify-center">{props.icon}</span>

      {/* inline label: visible when sidebar expanded */}
      <span
        className={clsx(
          'ml-4 text-[15px] leading-none whitespace-nowrap',
          props.active ? 'font-semibold' : 'font-medium',
        )}
      >
        {props.label}
      </span>

      {/* tooltip: visible when sidebar collapsed */}
      <span
        className={clsx(
          'hidden',
          'pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2',
          'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm',
          'opacity-0 translate-x-1 transition duration-150',
          'group-hover/item:opacity-100 group-hover/item:translate-x-0',
          // hide tooltip when sidebar expanded (hover/focus-within)
          'group-hover/sidebar:opacity-0 group-focus-within/sidebar:opacity-0',
        )}
      >
        {props.label}
      </span>
    </Link>
  )
}

export default function LeftSidebar() {
  const pathname = usePathname()
  const { account } = useWallet()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreWrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!moreOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }

    const onPointerDown = (e: PointerEvent) => {
      const wrap = moreWrapRef.current
      if (!wrap) return
      if (wrap.contains(e.target as Node)) return
      setMoreOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [moreOpen])

  const items: NavItem[] = [
    {
      key: 'home',
      label: 'Home',
      href: '/',
      icon: <IconHome className="w-6 h-6" />,
      match: (p) => p === '/',
    },
    // Các route dưới đây chưa được implement; dùng placeholder '#' để tránh lỗi route type
    { key: 'search', label: 'Search', href: '#', icon: <IconSearch className="w-6 h-6" /> },
    {
      key: 'explore',
      label: 'Explore',
      href: '/explore',
      icon: <IconExplore className="w-6 h-6" />,
    },
    { key: 'notifications', label: 'Notifications', href: '#', icon: <IconHeart className="w-6 h-6" /> },
    {
      key: 'create',
      label: 'Create',
      href: '/create',
      icon: <IconPlus className="w-6 h-6" />,
      match: (p) => p.startsWith('/create'),
    },
    { key: 'profile', label: 'Profile', href: '#', icon: (
      <span className="w-7 h-7 rounded-full bg-brand/40 border border-border flex items-center justify-center text-[11px] font-semibold">
        U
      </span>
    ) },
  ]

  return (
    <aside
      className={clsx(
        'group/sidebar fixed left-0 top-0 h-dvh z-40',
        'w-[244px]',
        'border-r border-border bg-surface/90 backdrop-blur',
        'px-2 py-4 overflow-x-hidden',
        'flex flex-col',
      )}
      aria-label="Primary"
    >
      {/* Top logo */}
      <div className="px-2 mb-2">
        <Link
          href="/"
          className={clsx(
            'group/item relative flex items-center rounded-2xl px-4 py-3',
            'hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          )}
          aria-label="Instagram"
        >
          <span className="inline-flex w-6 h-6 items-center justify-center">
            <IconInstagram className="w-6 h-6" />
          </span>

          <span className="ml-4 text-[15px] font-semibold tracking-tight whitespace-nowrap">
            Instagram
          </span>

          <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm opacity-0 translate-x-1 transition duration-150 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/sidebar:opacity-0 group-focus-within/sidebar:opacity-0">
            Instagram
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="mt-1 flex flex-col gap-1 px-2 flex-1">
        {items.map((it) => {
          const active = it.match ? it.match(pathname) : pathname === it.href
          return (
            <NavRow
              key={it.key}
              href={it.href}
              icon={it.icon}
              label={it.label}
              active={active}
            />
          )
        })}

        {/* More dropdown (below Create) */}
        <div ref={moreWrapRef} className="relative">
          <button
            type="button"
            className={clsx(
              'group/item relative flex w-full items-center gap-0 rounded-2xl px-4 py-3 text-foreground transition',
              'hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              moreOpen && 'bg-surface-2',
            )}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            aria-label="More"
            onClick={() => setMoreOpen((v) => !v)}
          >
            <span className="inline-flex w-6 h-6 items-center justify-center">
              <IconMenu className="w-6 h-6" />
            </span>
            <span className="ml-4 text-[15px] leading-none whitespace-nowrap font-medium">
              More
            </span>
          </button>

          {moreOpen && (
            <div
              role="menu"
              aria-label="More menu"
              className={clsx(
                'absolute left-0 right-0 bottom-full mb-2 z-50',
                'rounded-2xl border border-border bg-surface/95 shadow-[0_18px_70px_rgba(15,23,42,0.6)] backdrop-blur',
                'p-2',
              )}
            >
              <button
                type="button"
                role="menuitem"
                disabled={!account}
                onClick={() => {
                  if (!account) return
                  window.open(
                    `https://docs.shelby.xyz/apis/faucet/shelbyusd?address=${account.address}`,
                    '_blank',
                  )
                  setMoreOpen(false)
                }}
                className={clsx(
                  'w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                  'hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                  !account && 'opacity-50',
                )}
              >
                <span>Mint shelbyUSD</span>
                <span className="ml-auto text-xs tracking-widest text-muted">
                  Faucet
                </span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom: theme + Wallet connect */}
      <div className="px-2 pt-3 space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-surface-2/80 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400/40 via-sky-400/40 to-fuchsia-400/60 text-[13px]">
              <IconMoon className="h-4 w-4" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium leading-none">Appearance</span>
              <span className="text-[10px] text-muted leading-none mt-1">Toggle dark mode</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="h-px w-full bg-border" />
        <XChainWalletSelector
          size="sm"
          className={clsx(
            'w-full brand-gradient shadow-sm',
            // sidebar is always expanded → keep alignment stable to avoid layout "jump" on hover
            'justify-start',
            'overflow-hidden text-ellipsis whitespace-nowrap',
          )}
        />
      </div>
    </aside>
  )
}

