'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { mockPosts } from '@/lib/mock/posts'

type StoryChip = {
  id: string
  label: string
  username: string
}

const baseStories: StoryChip[] = mockPosts.map((p) => ({
  id: `story_${p.id}`,
  label: p.caption || 'Story',
  username: p.user?.display_name || p.user?.username || 'user',
}))

export default function StoryBar() {
  const stories = baseStories.length
    ? baseStories
    : [
        { id: 's1', label: 'New drop', username: 'neo.art' },
        { id: 's2', label: 'Night city', username: 'void.city' },
      ]

  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    // allow tiny floating errors
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft < max - 1)
  }, [])

  useEffect(() => {
    updateScrollState()
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => updateScrollState()
    el.addEventListener('scroll', onScroll, { passive: true })

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateScrollState())
      ro.observe(el)
    } else {
      window.addEventListener('resize', updateScrollState)
    }

    return () => {
      el.removeEventListener('scroll', onScroll)
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollByCards = (dir: 'left' | 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const delta = Math.round(el.clientWidth * 0.8)
    el.scrollBy({ left: dir === 'left' ? -delta : delta, behavior: 'smooth' })
  }

  return (
    <section
      aria-label="Stories"
      className="relative w-full max-w-[680px] mx-auto overflow-hidden rounded-3xl border border-border/70 bg-surface/70 px-4 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.85)] backdrop-blur-2xl"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-gradient-to-tr from-emerald-400/70 via-sky-400/70 to-fuchsia-400/70 blur-[2px]" />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Live loops
          </p>
        </div>
        <button className="text-[11px] font-medium text-muted hover:text-foreground transition-colors">
          View all
        </button>
      </div>

      <div className="relative -mx-1">
        <div
          ref={scrollerRef}
          className="storybar-scroller flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
        >
        <div className="flex items-stretch gap-3 px-1">
          {stories.map((story, idx) => (
            <Link
              key={story.id}
              href={`/story/${story.id}`}
              className="group relative inline-flex w-32 snap-start flex-none flex-col justify-between rounded-3xl border border-border/40 bg-gradient-to-b from-surface-2/70 via-surface/10 to-transparent px-3 py-3 text-left transition-transform duration-200 ease-out hover:-translate-y-1 hover:border-border/70"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="glow-ring relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-2/80">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400/60 via-sky-400/40 to-fuchsia-400/70 text-[11px] font-semibold text-foreground shadow-[0_0_0_1px_rgba(15,23,42,0.7)]">
                    {story.username[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {story.username}
                  </p>
                  <p className="text-[11px] text-muted group-hover:text-foreground/80 transition-colors">
                    {idx === 0 ? 'Now' : '• 5 min'}
                  </p>
                </div>
              </div>
              <p className="line-clamp-2 text-[11px] leading-snug text-muted-2 group-hover:text-foreground/90 transition-colors">
                {story.label}
              </p>
              <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-surface-2/70">
                <span className="inline-block h-full w-1/3 animate-[storyProgress_6s_linear_infinite] rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-400" />
              </div>
            </Link>
          ))}
        </div>
        </div>

        <button
          type="button"
          aria-label="Scroll stories left"
          onClick={() => scrollByCards('left')}
          disabled={!canScrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-surface/80 text-foreground shadow-sm backdrop-blur transition-opacity disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Scroll stories right"
          onClick={() => scrollByCards('right')}
          disabled={!canScrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-surface/80 text-foreground shadow-sm backdrop-blur transition-opacity disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-4 -top-10 h-20 bg-gradient-to-b from-emerald-400/8 via-sky-400/0 to-transparent blur-3xl" />
      <style jsx>{`
        .storybar-scroller {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge legacy */
        }

        .storybar-scroller::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        @keyframes storyProgress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </section>
  )
}

