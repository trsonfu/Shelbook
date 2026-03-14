import { getSession } from '@/lib/auth'
import FacebookProfile from '@/components/profile/FacebookProfile'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()

  // Await params to get the id
  const { id } = await params

  // Use wallet address from session (can be undefined for unauthenticated users)
  const currentWalletAddress = session?.walletAddress
  const currentUserId = session?.userId

  return (
    <div className="min-h-screen py-4">
      <FacebookProfile 
        userId={id} 
        currentUserId={currentUserId}
        currentWalletAddress={currentWalletAddress}
      />
    </div>
  )
}
