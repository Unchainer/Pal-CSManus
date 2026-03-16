# Arquitetura Técnica - Palé CMS (Digital Signage)

## 1. Visão Geral do Sistema

O **Palé CMS** é uma plataforma profissional de gerenciamento de conteúdo para Digital Signage, permitindo que usuários gerenciem bibliotecas de mídia, criem campanhas de conteúdo e distribuam para múltiplos dispositivos (players) conectados via WiFi.

### Objetivos Arquiteturais

- **Escalabilidade:** Suportar centenas de players sincronizados simultaneamente
- **Confiabilidade:** Garantir sincronização WiFi robusta com retry automático
- **Performance:** Dashboard responsivo com status em tempo real
- **Segurança:** Autenticação OAuth, autorização por role, proteção de dados
- **Manutenibilidade:** Código limpo, bem documentado, testável

---

## 2. Stack Tecnológico

| Camada | Tecnologia | Justificativa |
|--------|-----------|--------------|
| **Frontend** | React 19 + Tailwind CSS 4 | Componentes reativos, design system moderno |
| **Backend** | Node.js + Express 4 + tRPC 11 | Type-safe RPC, performance, escalabilidade |
| **Banco de Dados** | MySQL/TiDB | Transações ACID, relacionamentos complexos |
| **Autenticação** | Manus OAuth | Segurança integrada, sem gerenciamento de senhas |
| **Storage** | S3 (Manus) | Armazenamento escalável para vídeos/imagens |
| **Notificações** | Manus Notifications API | Push para players e alertas para proprietário |
| **Sincronização** | WebSockets + Polling | Real-time para dashboard, polling para players |

---

## 3. Arquitetura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (Public)                    │
│  - Hero Section                                             │
│  - Features Showcase                                        │
│  - Technical Architecture                                   │
│  - Roadmap & CTA                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 DASHBOARD (Authenticated)                   │
├─────────────────────────────────────────────────────────────┤
│ Sidebar Navigation:                                         │
│ ├─ Biblioteca (Media Management)                           │
│ ├─ Players (Device Management)                             │
│ ├─ Campanhas (Campaign Management)                         │
│ ├─ Relatórios (Analytics & Reports)                        │
│ ├─ Configurações (Settings)                                │
│ └─ Perfil (User Profile)                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (tRPC + Express)                       │
├─────────────────────────────────────────────────────────────┤
│ Routers:                                                    │
│ ├─ auth (OAuth, logout)                                    │
│ ├─ media (upload, list, delete)                            │
│ ├─ players (register, pair, status, assign campaigns)      │
│ ├─ campaigns (create, schedule, activate, list)            │
│ ├─ reports (analytics, sync status)                        │
│ ├─ settings (user preferences)                             │
│ ├─ notifications (push, alerts)                            │
│ └─ system (owner notifications)                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         DATABASE (MySQL) + STORAGE (S3)                     │
├─────────────────────────────────────────────────────────────┤
│ Tables:                                                     │
│ ├─ users (authentication & roles)                          │
│ ├─ media (video/image metadata)                            │
│ ├─ players (device registry)                               │
│ ├─ campaigns (playlists & scheduling)                      │
│ ├─ campaign_media (many-to-many)                           │
│ ├─ player_campaigns (assignment)                           │
│ ├─ sync_logs (WiFi sync history)                           │
│ └─ notifications (push history)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Fluxo de Dados e Sincronização

### 4.1 Fluxo de Upload de Mídia

```
User (Dashboard)
    ↓ [Upload file via drag-drop]
Frontend (client/src/pages/Biblioteca.tsx)
    ↓ [tRPC mutation: media.upload]
Backend (server/routers.ts)
    ↓ [Validate file size, type]
S3 Storage (manus-upload-file --webdev)
    ↓ [Store video/image]
Database (media table)
    ↓ [Save metadata: url, size, duration, thumbnail]
Dashboard
    ↓ [Display in grid with thumbnail]
```

### 4.2 Fluxo de Criação de Campanha

```
User (Dashboard)
    ↓ [Create campaign + select media + schedule]
Frontend (client/src/pages/Campanhas.tsx)
    ↓ [tRPC mutation: campaigns.create]
Backend (server/routers.ts)
    ↓ [Validate campaign data, create records]
Database
    ├─ campaigns table (name, schedule, status)
    ├─ campaign_media table (ordering)
    └─ player_campaigns table (assignment)
    ↓ [Trigger notification to assigned players]
Notifications API
    ↓ [Send push to players]
Players (via WiFi polling)
    ↓ [Fetch updated campaign]
Player Cache
    ↓ [Download media, prepare playback]
```

### 4.3 Fluxo de Sincronização WiFi

```
Player Device (PWA)
    ↓ [Every 30 seconds: check for updates]
Backend (/api/player/sync endpoint)
    ↓ [Compare player's campaign_id with latest]
Database
    ↓ [Query new campaigns, media changes]
Backend
    ↓ [Return delta: new media URLs, order changes]
Player Device
    ├─ [Download new media to local cache]
    ├─ [Update playback order]
    └─ [Log sync timestamp]
Backend
    ↓ [Update sync_logs table]
Dashboard (Real-time)
    ↓ [Display "Last synced: 30 seconds ago"]
```

---

## 5. Modelo de Dados (Drizzle Schema)

### 5.1 Tabelas Principais

```typescript
// users - Core authentication
users {
  id: int (PK)
  openId: varchar (unique, from OAuth)
  name: text
  email: varchar
  role: enum['user', 'admin']
  avatar_url: text (profile picture)
  createdAt: timestamp
  updatedAt: timestamp
}

// media - Video/Image library
media {
  id: int (PK)
  user_id: int (FK → users)
  filename: varchar
  url: text (S3 CDN URL)
  file_key: text (S3 key)
  mime_type: varchar
  size_bytes: int
  duration_seconds: int (for videos)
  thumbnail_url: text
  status: enum['uploading', 'ready', 'failed']
  createdAt: timestamp
}

// players - Device registry
players {
  id: int (PK)
  user_id: int (FK → users)
  name: varchar (e.g., "Tela Recepção")
  pairing_code: varchar (unique, 6 chars)
  device_id: varchar (unique, from player device)
  status: enum['online', 'offline', 'pairing']
  last_sync: timestamp
  current_campaign_id: int (FK → campaigns)
  location: text
  createdAt: timestamp
}

// campaigns - Playlists
campaigns {
  id: int (PK)
  user_id: int (FK → users)
  name: varchar
  description: text
  status: enum['draft', 'active', 'paused', 'archived']
  scheduled_start: timestamp
  scheduled_end: timestamp
  loop: boolean (repeat playlist)
  created_at: timestamp
}

// campaign_media - Many-to-many with ordering
campaign_media {
  id: int (PK)
  campaign_id: int (FK → campaigns)
  media_id: int (FK → media)
  order: int (playback sequence)
  duration_override: int (seconds, optional)
}

// player_campaigns - Assignment
player_campaigns {
  id: int (PK)
  player_id: int (FK → players)
  campaign_id: int (FK → campaigns)
  assigned_at: timestamp
  status: enum['pending', 'synced', 'playing']
}

// sync_logs - Audit trail
sync_logs {
  id: int (PK)
  player_id: int (FK → players)
  campaign_id: int (FK → campaigns)
  sync_timestamp: timestamp
  status: enum['success', 'failed', 'partial']
  error_message: text
}

// notifications - Push history
notifications {
  id: int (PK)
  player_id: int (FK → players)
  type: enum['campaign_assigned', 'content_updated', 'offline_alert']
  title: varchar
  message: text
  sent_at: timestamp
  read_at: timestamp
}
```

---

## 6. Padrões de Segurança e Autorização

### 6.1 Autenticação

- **OAuth via Manus:** Usuários fazem login via Manus OAuth
- **Session Cookie:** JWT armazenado em HttpOnly cookie
- **Context Injection:** `ctx.user` disponível em todas as procedures

### 6.2 Autorização

```typescript
// Apenas proprietário pode ver relatórios globais
adminProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
});

// Usuários só acessam seus próprios dados
protectedProcedure.input(z.object({ mediaId: z.number() })).query(async ({ ctx, input }) => {
  const media = await db.getMediaById(input.mediaId);
  if (media.user_id !== ctx.user.id) throw new TRPCError({ code: 'FORBIDDEN' });
  return media;
});
```

### 6.3 Validação de Arquivo

- **Tipos permitidos:** MP4, WebM, MOV, JPEG, PNG, WebP
- **Tamanho máximo:** 500MB
- **Validação no backend:** Sempre validar, nunca confiar no cliente

---

## 7. Estratégia de Cache e Performance

### 7.1 Cache no Frontend

- **React Query:** Caching automático de queries tRPC com stale-while-revalidate
- **Lazy Loading:** Imagens carregadas sob demanda com Intersection Observer
- **Code Splitting:** Rotas carregadas dinamicamente

### 7.2 Cache no Backend

- **Media Metadata:** Cachear lista de mídia por 5 minutos (Redis)
- **Player Status:** Cachear status online/offline por 30 segundos
- **Campaign Schedule:** Cachear campanhas ativas por 1 minuto

### 7.3 Cache no Player (PWA)

- **Service Worker:** Cache de mídia para offline playback
- **Local Storage:** Última campanha conhecida
- **IndexedDB:** Histórico de sincronização

---

## 8. Notificações e Alertas

### 8.1 Notificações para Players

**Trigger:** Quando campanha é atribuída ou conteúdo é atualizado

```typescript
// Backend: Quando campanha é criada/atualizada
await notifyPlayers({
  playerIds: [1, 2, 3],
  title: "Nova Campanha",
  message: "Campanha 'Promoção Verão' foi atribuída",
  action: "sync", // Player faz polling imediato
});
```

### 8.2 Alertas para Proprietário

**Triggers:**
- Player fica offline por mais de 5 minutos
- Nova campanha criada
- Erro de sincronização em múltiplos players
- Espaço em disco baixo no player

```typescript
// Backend: Quando player fica offline
await notifyOwner({
  title: "⚠️ Player Offline",
  content: "Tela Recepção (v2) está offline há 10 minutos",
});
```

---

## 9. Roadmap de Desenvolvimento (3 meses)

### Mês 1: MVP Web
- [x] Landing page institucional
- [x] Autenticação OAuth
- [x] Dashboard com sidebar
- [x] Módulo Biblioteca (upload, grid)
- [x] Módulo Players (cadastro, pareamento)
- [x] Módulo Campanhas (criação, agendamento)
- [x] Relatórios básicos
- [x] Perfil de usuário

### Mês 2: App Mobile + Sincronização
- [ ] PWA player para Smart TVs
- [ ] Sincronização WiFi com polling
- [ ] Cache local de mídia
- [ ] Notificações push para players
- [ ] Testes de sincronização em múltiplos dispositivos

### Mês 3: Testes, Deploy e Otimizações
- [ ] Testes E2E (Cypress/Playwright)
- [ ] Otimizações de performance
- [ ] Documentação de API
- [ ] Deploy em produção
- [ ] Monitoramento e alertas

---

## 10. Princípios de Design e Implementação

### 10.1 SOLID Principles

- **Single Responsibility:** Cada router, componente e função tem uma responsabilidade
- **Open/Closed:** Extensível para novos tipos de mídia, novos tipos de notificação
- **Liskov Substitution:** Interfaces consistentes para diferentes tipos de players
- **Interface Segregation:** tRPC procedures específicas, não genéricas
- **Dependency Inversion:** Database helpers injetados, não hardcoded

### 10.2 Design Patterns

- **Repository Pattern:** `server/db.ts` para acesso a dados
- **Middleware Pattern:** tRPC middlewares para auth, validation
- **Observer Pattern:** Notificações push para players
- **Cache-Aside Pattern:** Redis para dados quentes

### 10.3 Frontend Excellence

- **Responsive Design:** Mobile-first, suporta tablets e desktops
- **Accessibility:** WCAG 2.1 AA, navegação por teclado, ARIA labels
- **Performance:** Core Web Vitals otimizados, lazy loading, code splitting
- **UX:** Feedback visual claro, loading states, empty states

---

## 11. Próximos Passos

1. **Inicializar schema Drizzle** com tabelas definidas
2. **Criar procedures tRPC** para cada módulo
3. **Desenvolver componentes React** com shadcn/ui
4. **Implementar sincronização WiFi** com polling
5. **Adicionar notificações** via Manus Notifications API
6. **Documentar API** com exemplos de uso
7. **Preparar para app mobile** (PWA + React Native)

---

**Autor:** Manus AI | **Data:** Março 2026 | **Versão:** 1.0
