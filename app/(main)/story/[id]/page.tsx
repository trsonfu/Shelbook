import { redirect } from 'next/navigation'
import { mockPosts } from '@/lib/mock/posts'

export default async function StoryViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const story = mockPosts.find((p) => `story_${p.id}` === id) ?? mockPosts[0]

  if (!story) {
    redirect('/')
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-2xl">
      <div className="absolute inset-x-0 top-0 px-4 pt-10">
        <div className="mx-auto h-1.5 max-w-md overflow-hidden rounded-full bg-surface-2/70">
          <span className="inline-block h-full w-1/3 animate-[storyBar_8s_linear_forwards] rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-400" />
        </div>
      </div>

      <article className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[2rem] border border-border/70 bg-surface/90 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(120%_150%_at_0%_0%,rgba(56,189,248,0.45),transparent),radial-gradient(140%_180%_at_100%_100%,rgba(244,114,182,0.4),transparent)] opacity-40" />

        <header className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="glow-ring relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-2/80">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400/70 via-sky-400/50 to-fuchsia-400/70 text-xs font-semibold text-foreground">
                {(story.user?.display_name || story.user?.username || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {story.user?.display_name || story.user?.username || 'Unknown'}
              </p>
              <p className="text-[11px] text-muted">Just now · Liquid story</p>
            </div>
          </div>
        </header>

        <main className="relative z-0 flex h-full flex-col justify-center px-4 pb-16 pt-2">
          <div className="relative mx-auto mb-3 flex w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl bg-surface-2/80">
            {story.file_type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={story.shelby_file_url}
                alt={story.caption || 'Story image'}
                className="h-full w-full object-contain"
              />
            ) : (
              <video
                src={story.shelby_file_url}
                className="h-full w-full object-contain"
                autoPlay
                loop
                muted
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,23,42,0.1),transparent_60%)]" />
          </div>

          {story.caption && (
            <p className="mx-auto max-w-xs text-[13px] leading-relaxed text-foreground/90">
              {story.caption}
            </p>
          )}
        </main>

        <footer className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-3">
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
            <span className="rounded-full bg-surface-2/70 px-3 py-1 backdrop-blur">
              Tap to pause · Swipe to exit
            </span>
            <span className="rounded-full bg-surface-2/70 px-3 py-1 backdrop-blur">
              Next •
            </span>
          </div>
        </footer>
      </article>
    </div>
  )
}

