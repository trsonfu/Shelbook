import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import PostDetail from '@/components/post/PostDetail'

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return <PostDetail postId={params.id} />
}
