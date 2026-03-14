import Feed from '@/components/post/Feed'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default async function HomePage() {
  return (
    <div className="min-h-screen py-4">
      <div className="max-w-[680px] mx-auto px-4">
        <Feed />
      </div>
    </div>
  )
}
