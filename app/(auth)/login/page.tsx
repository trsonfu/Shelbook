'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector'

export default function LoginPage() {
  const { connected, account } = useWallet()
  const router = useRouter()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    const handleLogin = async () => {
      if (connected && account && !isLoggingIn) {
        setIsLoggingIn(true)
        
        try {
          // Call backend to create/get user and set proper session
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress: account.address.toString(),
            }),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const data = await response.json()
          
          if (data.authenticated) {
            router.push('/')
          }
        } catch (error) {
          console.error('Login error:', error)
          setIsLoggingIn(false)
        }
      }
    }

    handleLogin()
  }, [connected, account, router, isLoggingIn])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card max-w-md w-full p-8">
        <div className="h-1.5 w-14 rounded-full bg-brand mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Welcome</h1>
        <p className="text-muted text-center mb-8">
          Connect your wallet to continue
        </p>
        <div className="flex justify-center">
          <XChainWalletSelector
            size="lg"
            className="brand-gradient"
          />
        </div>
        {isLoggingIn && (
          <p className="text-center text-xs text-muted mt-4">
            Authenticating...
          </p>
        )}
      </div>
    </div>
  )
}
