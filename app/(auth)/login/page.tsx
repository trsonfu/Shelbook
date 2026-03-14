'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector'

export default function LoginPage() {
  const { connected, account } = useWallet()
  const router = useRouter()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleLogin = async () => {
      if (connected && account && !isLoggingIn) {
        setIsLoggingIn(true)
        setError(null)
        
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
            const errorData = await response.json().catch(() => ({ error: 'Login failed' }))
            throw new Error(errorData.error || `Login failed with status ${response.status}`)
          }

          const data = await response.json()
          
          if (data.authenticated) {
            router.push('/')
          } else {
            throw new Error('Authentication failed')
          }
        } catch (error) {
          console.error('Login error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Failed to authenticate. Please try again.'
          setError(errorMessage)
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
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Welcome to Shelbook</h1>
        <p className="text-muted text-center mb-8">
          Connect your wallet to continue
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 text-center">
              {error}
            </p>
            {error.includes('Missing') && (
              <p className="text-xs text-red-600 dark:text-red-300 text-center mt-2">
                The application is not properly configured. Please contact the administrator.
              </p>
            )}
          </div>
        )}
        
        <div className="flex justify-center">
          <XChainWalletSelector
            size="lg"
            className="brand-gradient"
          />
        </div>
        
        {isLoggingIn && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-muted">
                Authenticating...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
