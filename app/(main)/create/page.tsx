import { redirect } from 'next/navigation'

export default async function CreatePostPage() {
  // Redirect to home since posting is now done via modal
  redirect('/')
}
