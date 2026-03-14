# Instagram Clone với Shelby

Ứng dụng Instagram clone được xây dựng với Next.js, Supabase, và Shelby.

## Công nghệ sử dụng

- **Next.js 16**: Framework React với App Router
- **Supabase**: Database và metadata storage
- **Shelby**: Wallet authentication và file storage (ảnh/video)
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

## Tính năng

- ✅ Wallet authentication với Aptos wallet (Shelby)
- ✅ Upload ảnh/video lên Shelby storage
- ✅ Lưu metadata vào Supabase
- ✅ Feed page hiển thị posts
- ✅ Post detail với comments
- ✅ User profile
- ✅ Like/Unlike posts
- ✅ Comment on posts
- ✅ Follow/Unfollow users
- ✅ Responsive design

## Cấu trúc dự án

```
instagram/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   │   └── login/         # Login page
│   ├── (main)/            # Main app routes
│   │   ├── page.tsx       # Feed page
│   │   ├── post/[id]/     # Post detail
│   │   ├── profile/[id]/  # User profile
│   │   └── create/        # Create post
│   └── api/               # API routes
│       ├── auth/          # Authentication
│       ├── upload/        # Upload to Shelby
│       ├── posts/         # Posts CRUD
│       └── users/         # User management
├── components/             # React components
│   ├── auth/              # Auth components
│   ├── post/              # Post components
│   ├── profile/           # Profile components
│   ├── upload/            # Upload components
│   └── layout/            # Layout components
├── lib/                   # Utilities
│   ├── shelby.ts          # Shelby client
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Auth utilities
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript types
└── supabase/              # Database migrations
    └── migrations/
```

## Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình environment variables

Tạo file `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Shelby
SHELBY_API_URL=https://api.shelby.xyz
SHELBY_API_KEY=your_shelby_api_key
SHELBY_NETWORK=testnet

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Setup Supabase

1. Tạo project trên [Supabase](https://supabase.com)
2. Chạy migration:

```bash
# Sử dụng Supabase CLI hoặc chạy SQL trong Supabase Dashboard
supabase db push
```

Hoặc copy nội dung từ `supabase/migrations/001_initial_schema.sql` và chạy trong SQL Editor của Supabase.

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong browser.

## Database Schema

### Users
- `id`: UUID (primary key)
- `wallet_address`: TEXT (unique)
- `username`: TEXT (unique, optional)
- `display_name`: TEXT (optional)
- `avatar_url`: TEXT (optional)
- `bio`: TEXT (optional)

### Posts
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users)
- `shelby_file_id`: TEXT
- `shelby_file_url`: TEXT
- `file_type`: TEXT ('image' | 'video')
- `caption`: TEXT (optional)

### Likes
- `id`: UUID (primary key)
- `post_id`: UUID (foreign key to posts)
- `user_id`: UUID (foreign key to users)

### Comments
- `id`: UUID (primary key)
- `post_id`: UUID (foreign key to posts)
- `user_id`: UUID (foreign key to users)
- `content`: TEXT

### Follows
- `id`: UUID (primary key)
- `follower_id`: UUID (foreign key to users)
- `following_id`: UUID (foreign key to users)

## API Routes

### Authentication
- `POST /api/auth/login` - Login với wallet address
- `GET /api/auth/login` - Check authentication status
- `POST /api/auth/logout` - Logout

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/[id]` - Get post by ID
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/like` - Like post
- `DELETE /api/posts/[id]/like` - Unlike post
- `GET /api/posts/[id]/comments` - Get comments
- `POST /api/posts/[id]/comments` - Create comment

### Users
- `GET /api/users/[id]` - Get user profile
- `GET /api/users/[id]/follow` - Check follow status
- `POST /api/users/[id]/follow` - Follow user
- `DELETE /api/users/[id]/follow` - Unfollow user

### Upload
- `POST /api/upload` - Upload file metadata to Supabase (after Shelby upload)

## Lưu ý

- Cần cài đặt [Petra Wallet](https://petra.app/) extension để kết nối wallet
- Shelby API endpoints có thể cần điều chỉnh dựa trên documentation thực tế tại docs.shelby.xyz
- Đảm bảo Supabase project đã được setup và migrations đã chạy

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

## License

MIT
