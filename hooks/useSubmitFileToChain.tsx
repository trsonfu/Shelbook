import {
  type InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  type BlobCommitments,
  expectedTotalChunksets,
  ShelbyBlobClient,
} from "@shelby-protocol/sdk/browser";
import { useCallback, useState } from "react";
import { getAptosClient } from "@/utils/client";

interface UseSubmitFileToChainReturn {
  submitFileToChain: (
    commitment: BlobCommitments,
    file: File,
    uniqueBlobName: string
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export const useSubmitFileToChain = (): UseSubmitFileToChainReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account, wallet, signAndSubmitTransaction } = useWallet();

  const submitFileToChain = useCallback(
    async (commitment: BlobCommitments, file: File, uniqueBlobName: string) => {
      if (!account || !wallet) {
        throw new Error("Account and wallet are required");
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // Use high-level API from SDK (recommended by Shelby docs)
        const expirationMicros = Date.now() * 1000 + 30 * 24 * 60 * 60 * 1000000; // 30 days

        const payload = ShelbyBlobClient.createRegisterBlobPayload({
          account: account.address,
          blobName: uniqueBlobName,
          blobMerkleRoot: commitment.blob_merkle_root,
          numChunksets: expectedTotalChunksets(commitment.raw_data_size),
          expirationMicros,
          blobSize: commitment.raw_data_size,
          encoding: 0, // ClayCode_16Total_10Data_13Helper (default)
          // Future: Add useSponsoredUsdVariant: true for USD sponsorship
        });

        // Wallet adapter handles transaction submission
        const transaction: InputTransactionData = {
          data: payload,
          options: {
            maxGasAmount: 200000, // Required for blob registration
          },
        };

        const transactionSubmitted = await signAndSubmitTransaction(transaction);

        // Wait for transaction confirmation
        await getAptosClient().waitForTransaction({
          transactionHash: transactionSubmitted.hash,
        });
      } catch (err) {
        // Handle specific error cases
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        
        if (errorMessage.includes("INSUFFICIENT_BALANCE")) {
          const userFriendlyError = 
            "Insufficient APT balance for transaction fees. " +
            "Please fund your wallet with APT tokens from the Shelby faucet: " +
            "https://faucet.shelby.xyz";
          setError(userFriendlyError);
          throw new Error(userFriendlyError);
        }
        
        setError(errorMessage);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [account, wallet, signAndSubmitTransaction],
  );

  return {
    submitFileToChain,
    isSubmitting,
    error,
  };
};
