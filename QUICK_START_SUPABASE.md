# Quick Start: Supabase CLI Setup

## Setup Nhanh cho Project Hiện Tại

### Bước 1: Cài Supabase CLI

```bash
npm install -D supabase
```

### Bước 2: Init Project

```bash
npm run supabase:init
```

**Lưu ý**: Migration `001_initial_schema.sql` đã có, sẽ không bị xóa.

### Bước 3: Login

```bash
npm run supabase:login
```

### Bước 4: Link Project

1. Lấy **Reference ID** từ Supabase Dashboard:
   - Settings → General → Reference ID

2. Link:
```bash
npm run supabase:link
```

3. Chọn project từ danh sách:
   - CLI sẽ hiển thị danh sách projects
   - Dùng phím mũi tên ↑/↓ để di chuyển
   - Chọn project của bạn (ví dụ: "ThanhSong04's Project")
   - Nhấn **Enter** để chọn

4. Nhập database password:
   - Khi được hỏi `Enter your database password:`
   - Nhập password bạn đã tạo khi tạo Supabase project
   - Nhấn **Enter**

5. Xác nhận thành công:
   - Bạn sẽ thấy: `Finished supabase link.`

### Bước 5: Push Migration

```bash
npm run supabase:db:push
```

Migration `001_initial_schema.sql` sẽ được apply lên remote database.

### Bước 6: Verify

Vào Supabase Dashboard → Table Editor → Kiểm tra các tables:
- ✅ `users`
- ✅ `posts`
- ✅ `likes`
- ✅ `comments`
- ✅ `follows`

---

## Các Lệnh Thường Dùng

```bash
# Xem status local services
npm run supabase:status

# Tạo migration mới
npm run supabase:migration:new add_feature_name

# Xem danh sách migrations
npm run supabase:migration:list

# Generate TypeScript types
npm run supabase:types
```

---

## Workflow Phổ Biến

### Tạo và Push Migration Mới

```bash
# 1. Tạo migration
npm run supabase:migration:new add_new_table

# 2. Edit file trong supabase/migrations/
# ... viết SQL

# 3. Push lên remote
npm run supabase:db:push
```

### Local Development (Optional)

```bash
# Start local Supabase
npm run supabase:start

# Stop local Supabase
npm run supabase:stop

# Reset local database
npm run supabase:db:reset
```
