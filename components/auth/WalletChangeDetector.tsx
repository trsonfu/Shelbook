'use client'

import { useEffect, useRef } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useRouter } from 'next/navigation'

export function WalletChangeDetector() {
  const { account, connected } = useWallet()
  const router = useRouter()
  const previousWalletRef = useRef<string | null>(null)
  const isInitialMount = useRef(true)
  const hasLoggedOut = useRef(false)

  useEffect(() => {
    const checkWalletChange = async () => {
      // Handle disconnection - clear session
      if (!connected || !account) {
        if (previousWalletRef.current && !hasLoggedOut.current) {
          console.log('🔌 Wallet disconnected - logging out')
          await fetch('/api/auth/logout', { method: 'POST' })
          hasLoggedOut.current = true
        }
        previousWalletRef.current = null
        return
      }

      const currentWallet = account.address.toString()

      // Handle reconnection after disconnect - treat as new login
      if (hasLoggedOut.current && connected && account) {
        console.log('🔌 New wallet connected after disconnect')
        console.log('New wallet:', currentWallet)
        
        // Login with new wallet
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: currentWallet }),
        })

        if (response.ok) {
          console.log('✅ Authenticated with new wallet')
          hasLoggedOut.current = false
          previousWalletRef.current = currentWallet
          // Refresh the page to update all components with new session
          router.refresh()
          return
        }
      }

      // Skip on initial mount
      if (isInitialMount.current) {
        isInitialMount.current = false
        previousWalletRef.current = currentWallet
        return
      }

      // Handle wallet switch without disconnecting
      if (previousWalletRef.current && previousWalletRef.current !== currentWallet) {
        console.log('🔄 Wallet switched without disconnect!')
        console.log('Previous:', previousWalletRef.current)
        console.log('Current:', currentWallet)
        
        // Logout old session
        await fetch('/api/auth/logout', { method: 'POST' })
        
        // Login with new wallet
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: currentWallet }),
        })

        if (response.ok) {
          console.log('✅ Re-authenticated with new wallet')
          previousWalletRef.current = currentWallet
          // Refresh the page to update all components with new session
          router.refresh()
        }
      }

      previousWalletRef.current = currentWallet
    }

    checkWalletChange()
  }, [connected, account, router])

  return null
}
