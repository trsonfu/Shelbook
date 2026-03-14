'use client'

import Link from 'next/link'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector'
import { Button } from '@shelby-protocol/ui/components/button'

export default function Navbar() {
  const { connected, account } = useWallet()

  const onMintShelbyUsd = () => {
    if (!account) {
      return
    }
    window.open(
      `https://docs.shelby.xyz/apis/faucet/shelbyusd?address=${account.address}`,
      '_blank',
    )
  }

  return (
    <nav className="bg-surface/90 backdrop-blur border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight text-brand-strong">
            Instagram
          </Link>

          {/* Navigation Links */}
          {connected && account && (
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              <Link
                href="/create"
                className="text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {connected && account && (
              <Button
                disabled={!connected}
                onClick={onMintShelbyUsd}
                size="sm"
                className="brand-gradient shadow-sm"
              >
                Mint shelbyUSD
              </Button>
            )}
            <XChainWalletSelector
              size="sm"
              className="brand-gradient shadow-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
