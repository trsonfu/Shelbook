'use client'

import Link from 'next/link'
import { mockPosts } from '@/lib/mock/posts'

export default function ExploreGrid() {
  const items = [...mockPosts, ...mockPosts].map((p, idx) => ({
    ...p,
    _id: `${p.id}_${idx}`,
  }))

  if (items.length === 0) {
    return (
      <div className="glass-card flex items-center justify-center py-12 text-sm text-muted">
        Nothing to explore yet.
      </div>
    )
  }

  return (
    <section
      aria-label="Explore"
      className="grid auto-rows-[200px] grid-cols-2 gap-1 md:auto-rows-[250px] md:grid-cols-3 lg:grid-cols-4"
    >
      {items.map((post, index) => {
        const spanClass =
          index % 7 === 0
            ? 'md:col-span-2 md:row-span-2'
            : index % 7 === 3
            ? 'md:col-span-2 md:row-span-1'
            : 'md:col-span-1 md:row-span-1'

        return (
          <Link
            key={post._id}
            href={`/post/${post.id}`}
            className={`group relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${spanClass}`}
          >
            <div className="relative h-full w-full">
              {post.file_type === 'image' ? (
                <img
                  src={post.shelby_file_url}
                  alt={post.caption || 'Post'}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <video
                  src={post.shelby_file_url}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  muted
                  loop
                />
              )}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="flex items-center gap-4 text-white font-semibold">
                <span className="flex items-center gap-1">
                  <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" />
                  </svg>
                  {post.likes_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comments_count || 0}
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </section>
  )
}

