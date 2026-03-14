import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Feed from '@/components/post/Feed'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default async function HomePage() {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen py-4">
      <div className="max-w-[680px] mx-auto px-4">
        <Feed />
      </div>
    </div>
  )
}
