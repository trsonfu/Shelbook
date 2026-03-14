# Profile System Architecture Diagram

## System Flow Diagram

```mermaid
graph TD
    A[User Connects Wallet] --> B[Session Created]
    B --> C[Navigate to /profile/wallet_address]
    C --> D[ProfilePage Component]
    D --> E[GET /api/users/wallet_address]
    
    E --> F{Profile Exists?}
    
    F -->|No| G[Show Welcome Screen]
    F -->|Yes| H[Show Profile Page]
    
    G --> I[User Clicks Set Up Profile]
    I --> J[ProfileEditModal Opens]
    J --> K[User Fills Form]
    K --> L[Click Save]
    
    H --> M[User Clicks Edit Profile]
    M --> J
    
    L --> N[PATCH /api/users/wallet_address]
    N --> O{User Exists?}
    
    O -->|No| P[UPSERT: INSERT]
    O -->|Yes| Q[UPSERT: UPDATE]
    
    P --> R[Return New User]
    Q --> R
    
    R --> S[Update Frontend State]
    S --> T[Refresh Profile Data]
    T --> H
```

## Database Schema Diagram

```mermaid
erDiagram
    USERS ||--o{ POSTS : creates
    USERS ||--o{ LIKES : makes
    USERS ||--o{ COMMENTS : writes
    USERS ||--o{ FOLLOWS : follows
    USERS ||--o{ FOLLOWS : followed_by
    POSTS ||--o{ LIKES : receives
    POSTS ||--o{ COMMENTS : has
    
    USERS {
        uuid id PK
        text wallet_address UK
        text username UK
        text display_name
        text avatar_url
        text bio
        timestamp created_at
        timestamp updated_at
    }
    
    POSTS {
        uuid id PK
        uuid user_id FK
        text caption
        text media_url
        text media_type
        text blob_id
        timestamp created_at
        timestamp updated_at
    }
    
    LIKES {
        uuid id PK
        uuid user_id FK
        uuid post_id FK
        timestamp created_at
    }
    
    COMMENTS {
        uuid id PK
        uuid user_id FK
        uuid post_id FK
        text content
        timestamp created_at
        timestamp updated_at
    }
    
    FOLLOWS {
        uuid id PK
        uuid follower_id FK
        uuid following_id FK
        timestamp created_at
    }
```

## API Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Next.js
    participant API
    participant Supabase
    
    User->>Browser: Click "Set Up Profile"
    Browser->>Browser: Open ProfileEditModal
    User->>Browser: Fill form & click Save
    
    Browser->>API: PATCH /api/users/[wallet_address]
    Note over Browser,API: { display_name, bio, avatar_url }
    
    API->>API: Validate wallet address
    API->>Supabase: Check if user exists
    
    alt User doesn't exist
        API->>Supabase: INSERT new user (UPSERT)
        Supabase-->>API: Return new user
    else User exists
        API->>Supabase: UPDATE existing user (UPSERT)
        Supabase-->>API: Return updated user
    end
    
    API-->>Browser: { success: true, user: {...} }
    Browser->>Browser: Update state
    Browser->>API: GET /api/users/[wallet_address]
    API->>Supabase: Fetch user with stats
    Supabase-->>API: User + followers/following counts
    API-->>Browser: Full profile data
    Browser->>User: Show updated profile
```

## Component Hierarchy

```mermaid
graph TD
    A[ProfilePage] --> B[FacebookProfile]
    B --> C[ProfileHeader]
    B --> D[ProfileActions]
    B --> E[ProfileStats]
    B --> F[ProfilePosts]
    B --> G[ProfileEditModal]
    
    C --> C1[Cover Photo]
    C --> C2[Avatar]
    C --> C3[User Info]
    
    D --> D1[Edit Button]
    D --> D2[Follow Button]
    
    E --> E1[Followers Count]
    E --> E2[Following Count]
    E --> E3[Posts Count]
    
    F --> F1[Post Grid]
    
    G --> G1[Display Name Input]
    G --> G2[Bio Textarea]
    G --> G3[Avatar URL Input]
    G --> G4[Save Button]
    
    style B fill:#2d88ff
    style G fill:#1877f2
```

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Loading: Component Mount
    Loading --> ProfileNotFound: API returns null
    Loading --> ProfileLoaded: API returns user
    
    ProfileNotFound --> SetupScreen: Is Own Profile
    ProfileNotFound --> NotFoundScreen: Is Other User
    
    SetupScreen --> EditModal: Click Setup
    ProfileLoaded --> EditModal: Click Edit
    
    EditModal --> Saving: Click Save
    Saving --> ProfileLoaded: Success
    Saving --> Error: Failure
    
    Error --> EditModal: Retry
    ProfileLoaded --> [*]: Unmount
```

## Authentication & Authorization Flow

```mermaid
graph LR
    A[Connect Wallet] --> B[Create Session]
    B --> C[Store wallet_address in Session]
    C --> D[Navigate to Profile]
    
    D --> E{Is Own Profile?}
    E -->|Yes| F[Show Edit Button]
    E -->|No| G[Show Follow Button]
    
    F --> H[Can Edit]
    G --> I[Can View Only]
    
    style E fill:#ffd700
    style F fill:#90EE90
    style G fill:#87CEEB
```

## Data Flow: Create New Profile

```mermaid
flowchart LR
    A[User Input] --> B[Form Data]
    B --> C[PATCH Request]
    C --> D[API Handler]
    D --> E{Validate Data}
    E -->|Invalid| F[Return Error]
    E -->|Valid| G[Supabase UPSERT]
    G --> H[Check Unique Constraints]
    H -->|Conflict| I[Update Existing]
    H -->|No Conflict| J[Insert New]
    I --> K[Return User]
    J --> K
    K --> L[Update Frontend]
    L --> M[Show Profile]
    
    style G fill:#2d88ff
    style K fill:#90EE90
```

## Viewing the Diagrams

To view these Mermaid diagrams:

1. **GitHub/GitLab:** View this file on GitHub - diagrams render automatically
2. **VS Code:** Install "Markdown Preview Mermaid Support" extension
3. **Online:** Copy diagram code to https://mermaid.live/
4. **Documentation Site:** Use any docs platform that supports Mermaid (Docusaurus, VuePress, etc.)

## Understanding the Architecture

### Key Concepts

1. **UPSERT Pattern**: Single operation that creates OR updates based on unique constraint
2. **Wallet-First Design**: Profiles are keyed by wallet address, not email
3. **Optimistic UI**: UI updates immediately, then confirms with server
4. **Profile Ownership**: Determined by comparing wallet addresses
5. **Graceful Degradation**: Shows setup screen for new users, not errors

### Data Flow Principles

1. **Server Components** fetch initial data (page.tsx)
2. **Client Components** handle interactivity (FacebookProfile.tsx)
3. **API Routes** validate and persist to database
4. **State Management** keeps UI in sync with backend
5. **Session** provides authentication context

### Security Model

1. **Authentication**: Wallet signature proves identity
2. **Session**: Server-side cookie stores wallet address
3. **Authorization**: Client-side checks (future: add server-side)
4. **Validation**: API validates all inputs
5. **Constraints**: Database enforces uniqueness

## Next Steps

- Review these diagrams to understand the architecture
- Follow QUICK_START.md to set up the system
- Use DEPLOYMENT_CHECKLIST.md to test thoroughly
- Refer to IMPLEMENTATION_SUMMARY.md for details
