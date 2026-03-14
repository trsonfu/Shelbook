'use client'

import { useState, useRef } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { encodeFile } from '@/utils/encodeFile'
import { useSubmitFileToChain } from '@/hooks/useSubmitFileToChain'
import { useUploadFile } from '@/hooks/useUploadFile'

interface CreateStoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

function IconClose(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )
}

function IconPhoto(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 12c.83 0 1.5-.67 1.5-1.5S9.83 9 9 9s-1.5.67-1.5 1.5S8.17 12 9 12zm6.5 5.5L12 13l-3 4h10l-3.5-4.5z" />
    </svg>
  )
}

export default function CreateStoryModal({ isOpen, onClose, onSuccess }: CreateStoryModalProps) {
  const { account } = useWallet()
  const { uploadFileToRcp } = useUploadFile()
  const { submitFileToChain } = useSubmitFileToChain()
  const router = useRouter()

  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStage, setUploadStage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      setError('Please select an image or video file')
      return
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB')
      return
    }

    setFile(selectedFile)
    setError(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file || !account) {
      setError('Please connect your wallet and select a file')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStage('')
    setError(null)

    try {
      const fileType = file.type.startsWith('image/') ? 'image' : 'video'
      const timestamp = Date.now()
      const uniqueBlobName = `story-${timestamp}-${file.name}`

      setUploadStage('Encoding file...')
      setUploadProgress(10)
      const commitments = await encodeFile(file)

      setUploadStage('Submitting to blockchain...')
      setUploadProgress(30)
      await submitFileToChain(commitments, file, uniqueBlobName)

      setUploadStage('Uploading to Shelby RPC...')
      setUploadProgress(60)
      await uploadFileToRcp(file, uniqueBlobName)

      const shelbyApiUrl = process.env.NEXT_PUBLIC_SHELBY_API_URL || 'https://api.shelbynet.shelby.xyz'
      const fileUrl = `${shelbyApiUrl}/v1/blobs/${account.address.toString()}/${uniqueBlobName}`
      const fileId = `${account.address.toString()}/${uniqueBlobName}`

      setUploadStage('Saving story...')
      setUploadProgress(90)

      let width = 0
      let height = 0

      if (fileType === 'image') {
        const img = new Image()
        await new Promise((resolve) => {
          img.onload = () => {
            width = img.width
            height = img.height
            resolve(null)
          }
          img.src = preview || ''
        })
      }

      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shelbyFileId: fileId,
          shelbyFileUrl: fileUrl,
          fileType,
          caption: caption.trim() || undefined,
          mediaWidth: width || undefined,
          mediaHeight: height || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save story')
      }

      setUploadProgress(100)
      setUploadStage('Story created!')

      setTimeout(() => {
        onSuccess?.()
        onClose()
        router.refresh()
      }, 500)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setFile(null)
      setPreview(null)
      setCaption('')
      setError(null)
      setUploadProgress(0)
      setUploadStage('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#242526] rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative border-b border-gray-200 dark:border-[#3e4042] px-4 py-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Create Story
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="absolute right-4 top-3 w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <IconClose className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Info Text */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              📱 Your story will be visible for 24 hours
            </p>
          </div>

          {/* File Preview */}
          {preview ? (
            <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-[#3a3b3c]">
              {file?.type.startsWith('image/') ? (
                <img src={preview} alt="Preview" className="w-full max-h-[400px] object-contain" />
              ) : (
                <video src={preview} controls className="w-full max-h-[400px]" />
              )}
              {!isUploading && (
                <button
                  onClick={() => {
                    setFile(null)
                    setPreview(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-[#242526] shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
                >
                  <IconClose className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              )}
              
              {/* Caption Input Overlay */}
              <div className="mt-3">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption... (optional)"
                  disabled={isUploading}
                  maxLength={150}
                  className="w-full p-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-[#242526] border border-gray-300 dark:border-[#3e4042] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm"
                  rows={2}
                />
              </div>
            </div>
          ) : (
            /* Upload Button */
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full aspect-[9/16] max-h-[500px] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 dark:border-[#3e4042] rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
            >
              <IconPhoto className="w-16 h-16 text-gray-400" />
              <div className="text-center">
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Select photo or video
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Max 100MB
                </p>
              </div>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{uploadStage}</span>
                <span className="text-blue-500 font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-[#3a3b3c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-[#3e4042] p-4">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-[#3a3b3c] disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {isUploading ? 'Posting Story...' : 'Share to Story'}
          </button>
        </div>
      </div>
    </div>
  )
}
