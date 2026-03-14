import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function CreatePostPage() {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  // Redirect to home since posting is now done via modal
  redirect('/')
}
