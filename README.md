# Spektif Agency - Trello Clone

Modern bir proje yönetimi platformu - Trello tarzı board'lar, gerçek zamanlı chat, takvim entegrasyonu ve muhasebe özellikleri.

## 🚀 Özellikler

### ✅ Mevcut Özellikler
- **🔐 Kimlik Doğrulama**: NextAuth.js ile güvenli giriş (demo + Google OAuth)
- **📋 Kanban Board'ları**: Sürükle-bırak card'ları ile liste yönetimi
- **📅 Takvim Entegrasyonu**: Card deadline'larını Trello benzeri compact görünümde takip
- **💬 Gerçek Zamanlı Chat**: Board bazlı takım iletişimi
- **📧 Inbox Sistemi**: Bildirimler ve güncellemeler
- **💰 Muhasebe Modülü**: Gelir/gider takibi ve raporlama
- **🌐 Çoklu Dil**: Türkçe, İngilizce, Lehçe desteği
- **🌙 Tema Desteği**: Açık/koyu tema geçişi
- **📱 Responsive Tasarım**: Mobil uyumlu arayüz

### 🔄 Geliştirme Aşamasında
- **⚡ WebSocket Entegrasyonu**: Canlı board güncellemeleri
- **📁 Dosya Yükleme**: Cloudflare R2 entegrasyonu
- **💳 Ödeme Sistemi**: iyzico/PayTR entegrasyonu
- **📱 Mobil Uygulama**: React Native geliştirmesi

## 🛠️ Teknoloji Stack

### Backend (NestJS)
- **Framework**: NestJS
- **Veritabanı**: SQLite + Prisma ORM
- **Kimlik Doğrulama**: JWT + NextAuth.js
- **API Dokümantasyonu**: Swagger/OpenAPI
- **WebSocket**: Socket.io (hazırlanıyor)

### Frontend (Next.js)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React hooks
- **Internationalization**: next-intl

## 📁 Proje Yapısı

```
spektif_agency/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/         # Shared configurations
└── docs/            # Dokümantasyon
```

## 🏃‍♂️ Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- Bun (paket yöneticisi)

### Kurulum

1. **Repository'yi klonlayın**
```bash
git clone <repo-url>
cd spektif_agency
```

2. **Bağımlılıkları yükleyin**
```bash
bun install
```

3. **Veritabanını hazırlayın**
```bash
cd apps/api
bunx prisma generate
bunx prisma db push
bunx prisma db seed
```

4. **Sunucuları başlatın**

Backend (Port 3001):
```bash
cd apps/api
bun run start:dev
```

Frontend (Port 8080):
```bash
cd apps/web  
bun run dev
```

### Demo Giriş Bilgileri
- **Email**: demo@spektif.com
- **Şifre**: demo123

## 📖 API Dokümantasyonu

Backend çalıştığında swagger dokümantasyonu şu adreste erişilebilir:
- **Swagger UI**: http://localhost:3001/docs

### Ana Endpoint'ler
- `GET /api/boards?organizationId=spektif-agency` - Board'ları listele
- `GET /api/cards?boardId=<boardId>` - Belirli board'daki card'ları getir
- `GET /api/chat/conversations?organizationId=spektif-agency` - Chat konuşmaları

## 🎯 Kullanım

### Dashboard
- **Ana Sayfa**: Genel proje istatistikleri ve son aktiviteler
- **Şablonlar**: Mevcut board'ları görüntüle ve yönet
- **Üyeler**: Takım üyelerini yönet
- **Müşteriler**: (Admin only) Müşteri bilgileri

### Board Özellikleri
- **Board Görünümü**: Kanban-style liste ve card yönetimi
- **Takvim**: Card deadline'larını aylık görünümde takip
- **Chat**: Board-specific takım sohbeti
- **Inbox**: Bildirimler ve mentionlar
- **Muhasebe**: Proje bazlı finansal takip

### Label ve Tarih Sistemi
- Card'lara renkli labellar ekleyin
- Deadline tarihleri belirleyin
- Değişiklikler otomatik olarak takvimde yansır

## 🔧 Geliştirme

### Kod Yapısı
- **Backend**: `/apps/api/src/` - NestJS modülleri
- **Frontend**: `/apps/web/src/` - Next.js sayfaları ve bileşenler
- **Components**: `/apps/web/src/components/` - Yeniden kullanılabilir UI bileşenleri

### Yeni Özellik Ekleme
1. Backend'de controller/service oluşturun
2. Prisma schema'yı güncelleyin
3. Frontend'de sayfa/component ekleyin
4. API entegrasyonunu gerçekleştirin

## 📋 TODO

- [ ] WebSocket entegrasyonu tamamla
- [ ] Dosya yükleme özelliği ekle
- [ ] Ödeme sistemi entegrasyonu
- [ ] Mobil uygulama geliştir
- [ ] Performans optimizasyonları
- [ ] Unit testler ekle

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit'leyin (`git commit -m 'Add amazing feature'`)
4. Push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.
