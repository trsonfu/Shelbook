'use client'

import { useRouter } from 'next/navigation'
import MediaUpload from './MediaUpload'

export default function CreatePostClient() {
  const router = useRouter()

  return (
    <MediaUpload
      onUploadSuccess={() => {
        router.push('/')
      }}
      onUploadError={(error) => {
        console.error('Upload error:', error)
        alert(`Upload failed: ${error}`)
      }}
    />
  )
}
