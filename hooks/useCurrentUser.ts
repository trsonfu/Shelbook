'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import type { User } from '@/types'

export function useCurrentUser() {
  const { account, connected } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (!connected || !account) {
        setUser(null)
        return
      }

      setLoading(true)
      try {
        const walletAddress = account.address.toString()
        const response = await fetch(`/api/users/${walletAddress}`)
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [connected, account])

  return { user, loading }
}
