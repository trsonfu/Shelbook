'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useState, useRef } from 'react'
import { encodeFile } from '@/utils/encodeFile'
import { useSubmitFileToChain } from '@/hooks/useSubmitFileToChain'
import { useUploadFile } from '@/hooks/useUploadFile'
import { getShelbyClient } from '@/utils/client'

interface MediaUploadProps {
  onUploadSuccess?: (data: { fileId: string; fileUrl: string; fileType: 'image' | 'video' }) => void
  onUploadError?: (error: string) => void
}

export default function MediaUpload({ onUploadSuccess, onUploadError }: MediaUploadProps) {
  const { account, wallet } = useWallet()
  const { uploadFileToRcp } = useUploadFile()
  const { submitFileToChain } = useSubmitFileToChain()
  
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStage, setUploadStage] = useState<string>('')
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      onUploadError?.('Please select an image or video file')
      return
    }

    // Validate file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      onUploadError?.('File size must be less than 100MB')
      return
    }

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const fakeEvent = {
        target: { files: [droppedFile] }
      } as any
      handleFileSelect(fakeEvent)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!file || !account || !wallet) {
      onUploadError?.('Please connect your wallet first')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStage('')

    try {
      // Determine file type
      const fileType = file.type.startsWith('image/') ? 'image' : 'video'

      // Generate unique blob name to avoid conflicts (timestamp-originalname.ext)
      const timestamp = Date.now()
      const uniqueBlobName = `${timestamp}-${file.name}`

      // Step 1: Encode the file
      setUploadStage('Encoding file...')
      setUploadProgress(10)
      const commitments = await encodeFile(file)

      // Step 2: Submit the file to the chain
      setUploadStage('Submitting transaction to chain...')
      setUploadProgress(30)
      await submitFileToChain(commitments, file, uniqueBlobName)

      // Step 3: Upload the file to the RPC
      setUploadStage('Uploading file to Shelby RPC...')
      setUploadProgress(60)
      await uploadFileToRcp(file, uniqueBlobName)

      // Step 4: Get the blob URL
      setUploadStage('Getting file URL...')
      setUploadProgress(80)
      const shelbyApiUrl = process.env.NEXT_PUBLIC_SHELBY_API_URL || 'https://api.shelbynet.shelby.xyz'
      const fileUrl = `${shelbyApiUrl}/v1/blobs/${account.address.toString()}/${uniqueBlobName}`
      const fileId = `${account.address.toString()}/${uniqueBlobName}`

      // Step 5: Save metadata to Supabase
      setUploadStage('Saving post metadata...')
      setUploadProgress(90)
      const formData = new FormData()
      formData.append('shelbyFileId', fileId)
      formData.append('shelbyFileUrl', fileUrl)
      formData.append('fileType', fileType)
      if (caption) {
        formData.append('caption', caption)
      }

      const saveResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save post metadata')
      }

      setUploadProgress(100)
      setUploadStage('Upload complete!')

      // Call success callback
      onUploadSuccess?.({
        fileId,
        fileUrl,
        fileType,
      })

      // Reset form
      setFile(null)
      setPreview(null)
      setCaption('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      onUploadError?.(error.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadStage('')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-7 glass-card">
      <h2 className="text-xl md:text-2xl font-semibold mb-1 tracking-tight">
        Create new post
      </h2>
      <p className="mb-6 text-xs text-muted uppercase tracking-[0.18em]">
        Image · Video · Shelby blob
      </p>

      {/* File Upload Area */}
      <div
        className="border border-dashed border-border/70 rounded-2xl p-6 md:p-8 text-center cursor-pointer hover:border-brand-strong transition-colors mb-4 bg-surface-2/80"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            {file?.type.startsWith('image/') ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-96 mx-auto rounded-xl"
              />
            ) : (
              <video
                src={preview}
                controls
                className="max-h-96 mx-auto rounded-xl"
              />
            )}
            <p className="text-xs text-muted-2">{file?.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
                setPreview(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-muted-2"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-3 text-sm text-muted">
              Click to upload or drag and drop
            </p>
            <p className="text-[11px] text-muted-2 mt-1">
              PNG, JPG, GIF, MP4 up to 100MB
            </p>
          </div>
        )}
      </div>

      {/* Caption Input */}
      {file && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-[0.16em]">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full px-4 py-3 border border-border/70 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent resize-none bg-surface text-sm"
            rows={4}
          />
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted mb-2">
            <span className="font-medium">Uploading...</span>
            <span className="font-semibold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-400 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted mt-1">
            {uploadStage || 'Preparing upload...'}
          </p>
        </div>
      )}

      {/* Wallet Connection Warning */}
      {!account && (
        <div className="mb-4 p-4 bg-surface-2/80 border border-border/70 rounded-2xl">
          <p className="text-xs text-muted">
            Please connect your wallet to upload files
          </p>
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={isUploading || !account}
          className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 rounded-xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium tracking-wide"
        >
          {isUploading ? 'Uploading...' : 'Upload Post'}
        </button>
      )}
    </div>
  )
}
