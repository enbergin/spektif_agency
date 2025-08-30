# Spektif Agency - Teknik Dokümantasyon

Bu dokümantasyon, Spektif Agency projesinin teknik altyapısını, mimariyi ve geliştirme rehberlerini içerir.

## 📐 Mimari Genel Bakış

### Monorepo Yapısı
```
spektif_agency/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/        # Kimlik doğrulama
│   │   │   ├── boards/      # Board yönetimi
│   │   │   ├── cards/       # Card operasyonları
│   │   │   ├── chat/        # Chat sistemi
│   │   │   ├── organizations/ # Organizasyon yönetimi
│   │   │   └── prisma/      # Veritabanı servisi
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/         # App Router sayfaları
│       │   ├── components/  # UI bileşenleri
│       │   ├── lib/         # Utility fonksiyonlar
│       │   └── hooks/       # Custom React hooks
│       └── package.json
├── packages/
│   ├── eslint-config/       # Paylaşılan ESLint config
│   └── typescript-config/   # Paylaşılan TypeScript config
└── package.json            # Root workspace config
```

## 🗄️ Veritabanı Şeması

### Temel Modeller

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // İlişkiler
  orgMembers    OrgMember[]
  createdBoards Board[]
  cards         Card[]
  comments      Comment[]
  chatParticipants ChatParticipant[]
  sentMessages  Message[]
}
```

#### Organization
```prisma
model Organization {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // İlişkiler
  members     OrgMember[]
  boards      Board[]
  conversations Conversation[]
}
```

#### Board & Lists & Cards
```prisma
model Board {
  id             String    @id @default(cuid())
  title          String
  description    String?
  organizationId String
  createdBy      String
  position       Int       @default(0)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  // İlişkiler
  organization   Organization @relation(fields: [organizationId], references: [id])
  creator        User         @relation(fields: [createdBy], references: [id])
  lists          List[]
  members        BoardMember[]
}

model List {
  id        String   @id @default(cuid())
  title     String
  boardId   String
  position  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  board     Board    @relation(fields: [boardId], references: [id])
  cards     Card[]
}

model Card {
  id          String    @id @default(cuid())
  title       String
  description String?
  listId      String
  assignedTo  String?
  position    Int       @default(0)
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  list        List      @relation(fields: [listId], references: [id])
  assignee    User?     @relation(fields: [assignedTo], references: [id])
  labels      Label[]
  comments    Comment[]
}
```

### İlişkiler ve İndeksler
- **Compound İndeksler**: Board üyelikleri, organizasyon üyelikleri
- **Foreign Key Constraints**: Referential integrity koruması
- **Cascade Operations**: Silme işlemlerinde otomatik temizlik

## 🔐 Kimlik Doğrulama Sistemi

### NextAuth.js Konfigürasyonu
```typescript
// apps/web/src/lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    CredentialsProvider({
      // Demo kullanıcı girişi
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        // Kullanıcı doğrulama mantığı
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // JWT token'a custom alanlar ekleme
    },
    session: async ({ session, token }) => {
      // Session objesini düzenleme
    }
  }
}
```

### JWT Token Yapısı
```typescript
interface JWTToken {
  sub: string          // User ID
  email: string        // User email
  name: string         // User name
  role: Role           // User role (ADMIN/USER)
  organizationId: string // Primary organization
  accessToken: string  // Backend API token
  iat: number         // Issued at
  exp: number         // Expires at
}
```

## 🎨 Frontend Mimarisi

### Next.js App Router Yapısı
```
src/app/
├── [locale]/              # Çoklu dil desteği
│   ├── auth/
│   │   └── login/         # Giriş sayfası
│   ├── dashboard/         # Ana dashboard
│   └── org/
│       └── [orgId]/
│           ├── boards/    # Board listesi
│           └── board/
│               └── [boardId]/
│                   ├── page.tsx      # Board ana sayfası
│                   ├── calendar/     # Board takvimi
│                   ├── chat/         # Board chat'i
│                   ├── inbox/        # Board inbox'ı
│                   └── accounting/   # Board muhasebesi
```

### State Management Stratejisi
- **Server State**: React Query/SWR kullanımı planlanıyor
- **Client State**: React useState/useReducer
- **Global State**: Context API minimal kullanım
- **Form State**: React Hook Form

### UI Component Sistemi
```typescript
// Shadcn/ui tabanlı component library
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Custom business components
import { BoardCard } from '@/components/board/board-card'
import { DraggableCard } from '@/components/board/draggable-card'
import { CalendarView } from '@/components/calendar/calendar-view'
```

## 🔄 API Tasarımı

### RESTful Endpoint'ler

#### Boards API
```typescript
// GET /api/boards?organizationId=<id>
interface BoardsResponse {
  id: string
  title: string
  description?: string
  lists?: List[]
  members?: BoardMember[]
  totalCards?: number
}

// POST /api/boards
interface CreateBoardRequest {
  title: string
  description?: string
  organizationId: string
}
```

#### Cards API
```typescript
// GET /api/cards?boardId=<id>
interface CardsResponse {
  id: string
  title: string
  description?: string
  dueDate?: string
  labels?: Label[]
  list?: {
    id: string
    title: string
    board?: {
      id: string
      title: string
    }
  }
}

// PATCH /api/cards/:id
interface UpdateCardRequest {
  title?: string
  description?: string
  dueDate?: string
  labels?: string[]
}
```

### Error Handling
```typescript
// Standart error response format
interface APIError {
  statusCode: number
  message: string | string[]
  error: string
  timestamp: string
  path: string
}

// HTTP Status Codes
// 200: Success
// 400: Bad Request
// 401: Unauthorized
// 403: Forbidden
// 404: Not Found
// 500: Internal Server Error
```

## 📡 Gerçek Zamanlı Özellikler

### WebSocket Mimarisi (Planlanan)
```typescript
// Socket.io events
interface SocketEvents {
  // Board events
  'board:updated': (data: BoardUpdate) => void
  'card:moved': (data: CardMove) => void
  'card:created': (data: Card) => void
  
  // Chat events
  'message:sent': (data: Message) => void
  'user:typing': (data: TypingIndicator) => void
  
  // Notification events
  'notification:received': (data: Notification) => void
}
```

### Optimistic Updates
- Card taşıma işlemlerinde anında UI güncellemesi
- Hata durumunda rollback mekanizması
- Conflict resolution stratejileri

## 🎨 Styling ve Tema Sistemi

### Tailwind CSS Konfigürasyonu
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FFEB3B',
          accent: '#FDD835',
          secondary: '#FF9800'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
```

### Dark Mode Implementation
```typescript
// Context tabanlı tema yönetimi
interface ThemeContext {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// CSS variables kullanımı
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
}
```

## 🌐 Çoklu Dil Desteği

### next-intl Konfigürasyonu
```typescript
// i18n.ts
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['tr', 'en', 'pl']
export const defaultLocale = 'tr'

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale)) notFound()
  
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
```

### Çeviri Dosya Yapısı
```json
// messages/tr.json
{
  "nav": {
    "dashboard": "Dashboard",
    "boards": "Board'lar",
    "calendar": "Takvim",
    "chat": "Chat"
  },
  "boards": {
    "title": "Board'lar",
    "description": "Projelerinizi organize edin",
    "newBoard": "Yeni Board"
  }
}
```

## 🔍 SEO ve Performans

### Meta Tags ve OpenGraph
```typescript
// layout.tsx
export const metadata: Metadata = {
  title: 'Spektif Agency - Proje Yönetimi',
  description: 'Modern proje yönetimi platformu',
  openGraph: {
    title: 'Spektif Agency',
    description: 'Trello benzeri proje yönetimi',
    images: ['/og-image.png']
  }
}
```

### Performance Optimizations
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports
- **Bundle Analysis**: @next/bundle-analyzer
- **Caching Strategy**: ISR ve SWR

## 🧪 Test Stratejisi

### Test Pyramid
```
E2E Tests (Cypress/Playwright)
├── Critical user journeys
├── Authentication flow
└── Board operations

Integration Tests (Jest + Testing Library)
├── API endpoints
├── Component interactions
└── Database operations

Unit Tests (Jest)
├── Business logic
├── Utility functions
└── Custom hooks
```

### Test Konfigürasyonu
```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ]
}
```

## 🚀 Deployment Stratejisi

### Production Environment
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=file:./dev.db
      - JWT_SECRET=${JWT_SECRET}
  
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: bun install
      - name: Run tests
        run: bun test
      - name: Build
        run: bun run build
      - name: Deploy
        run: # Deployment commands
```

## 📊 Monitoring ve Analytics

### Error Tracking
- **Frontend**: Sentry.io integration planned
- **Backend**: Winston logger + structured logging
- **Database**: Query performance monitoring

### Analytics
- **User Behavior**: Mixpanel/Google Analytics
- **Performance**: Web Vitals tracking
- **Business Metrics**: Custom dashboard

## 🔒 Güvenlik Önlemleri

### Backend Security
- **CORS Configuration**: Specific origins only
- **Rate Limiting**: Express rate limit middleware
- **Input Validation**: Class-validator decorators
- **SQL Injection Prevention**: Prisma ORM
- **XSS Protection**: Helmet.js headers

### Frontend Security
- **CSP Headers**: Content Security Policy
- **CSRF Protection**: NextAuth.js built-in
- **Secure Cookies**: httpOnly, secure flags
- **Input Sanitization**: DOMPurify

## 📈 Gelecek Geliştirmeler

### Yakın Dönem (1-2 ay)
- [ ] WebSocket entegrasyonu
- [ ] Dosya yükleme (Cloudflare R2)
- [ ] Ödeme sistemi (iyzico/PayTR)
- [ ] Mobil responsive iyileştirmeleri

### Orta Dönem (3-6 ay)
- [ ] React Native mobil uygulaması
- [ ] Advanced reporting dashboard
- [ ] Team performance analytics
- [ ] Third-party integrations (Slack, Discord)

### Uzun Dönem (6+ ay)
- [ ] AI-powered task suggestions
- [ ] Automation workflows
- [ ] Multi-tenant SaaS architecture
- [ ] Enterprise features (SSO, LDAP)

## 📚 Kaynak ve Referanslar

### Kullanılan Teknolojiler
- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework  
- [Prisma](https://prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI components

### Geliştirme Araçları
- [Bun](https://bun.sh/) - Package manager & runtime
- [TypeScript](https://typescriptlang.org/) - Type safety
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

Bu dokümantasyon projenin gelişimi ile birlikte güncellenecektir.
