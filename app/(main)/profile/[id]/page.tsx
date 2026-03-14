import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import FacebookProfile from '@/components/profile/FacebookProfile'

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen py-4">
      <FacebookProfile userId={params.id} currentUserId={session.userId} />
    </div>
  )
}
