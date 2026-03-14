// User types
export interface User {
  id: string
  wallet_address: string
  username?: string
  display_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

// Post types
export interface Post {
  id: string
  user_id: string
  shelby_file_id: string
  shelby_file_url: string
  file_type: 'image' | 'video'
  /**
   * Media intrinsic size (px). IG/FB always keep an intrinsic aspect-ratio to avoid stretching
   * and to prevent layout shift while media is loading.
   */
  media_width?: number
  media_height?: number
  caption?: string
  created_at: string
  updated_at: string
  user?: User
  likes_count?: number
  comments_count?: number
  is_liked?: boolean
}

// Like types
export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

// Comment types
export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: User
}

// Follow types
export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

// Auth types
export interface AuthSession {
  walletAddress: string
  authenticated: boolean
  expiresAt?: number
}

// Upload types
export interface UploadResponse {
  file_id: string
  file_url: string
  file_type: 'image' | 'video'
  metadata?: Record<string, any>
}
