# Palé CMS - Plataforma Profissional de Digital Signage

**Palé CMS** é uma plataforma de gerenciamento de conteúdo para Digital Signage que permite distribuir vídeos e imagens para múltiplas telas em tempo real, com sincronização WiFi impecável e dashboard intuitivo.

## 🎯 Visão Geral

O Palé CMS resolve o desafio de gerenciar conteúdo multimídia em múltiplos dispositivos (TVs, displays, painéis) de forma centralizada. Com autenticação segura, biblioteca de mídia, criação de campanhas e sincronização automática, você tem controle total sobre o que é exibido em cada tela.

### Funcionalidades Principais

- **Biblioteca de Mídia**: Upload de vídeos até 500MB (MP4, WebM, MOV) e imagens (JPEG, PNG, WebP)
- **Gerenciamento de Players**: Cadastre dispositivos com código de pareamento único
- **Campanhas & Playlists**: Crie campanhas com múltiplos vídeos e agendamento por data/hora
- **Sincronização WiFi**: Sincronização automática a cada 30 segundos com retry inteligente
- **Relatórios & Analytics**: Dashboard com métricas em tempo real (players online, campanhas ativas)
- **Notificações Push**: Alertas automáticos quando players ficam offline ou novas campanhas são atribuídas
- **Autenticação OAuth**: Login seguro via Manus OAuth

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 8.0+ ou TiDB compatível
- Variáveis de ambiente configuradas (veja `.env.example`)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/pale-cms.git
cd pale-cms

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute as migrações do banco de dados
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Inicie o servidor de desenvolvimento
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
pale-cms/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Dashboard.tsx       # Dashboard principal
│   │   │   └── dashboard/          # Módulos do dashboard
│   │   │       ├── Biblioteca.tsx
│   │   │       ├── Players.tsx
│   │   │       ├── Campanhas.tsx
│   │   │       ├── Relatorios.tsx
│   │   │       ├── Configuracoes.tsx
│   │   │       └── Perfil.tsx
│   │   ├── components/             # Componentes reutilizáveis
│   │   ├── lib/trpc.ts            # Cliente tRPC
│   │   └── App.tsx                 # Router principal
│   └── index.html
├── server/                          # Backend Node.js
│   ├── routers.ts                  # tRPC procedures
│   ├── db.ts                       # Query helpers
│   ├── storage.ts                  # S3 helpers
│   └── _core/                      # Framework core
├── drizzle/                         # Schema e migrações
│   ├── schema.ts                   # Definição das tabelas
│   └── migrations/                 # SQL migrations
├── shared/                          # Código compartilhado
├── ARCHITECTURE.md                  # Documentação técnica
├── README.md                        # Este arquivo
└── package.json
```

---

## 🏗️ Arquitetura Técnica

### Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|--------------|
| **Frontend** | React 19 + Tailwind CSS 4 | Componentes reativos, design system moderno |
| **Backend** | Node.js + Express + tRPC | Type-safe RPC, performance, escalabilidade |
| **Banco de Dados** | MySQL/TiDB | Transações ACID, relacionamentos complexos |
| **Autenticação** | Manus OAuth | Segurança integrada, sem gerenciamento de senhas |
| **Storage** | S3 (Manus) | Armazenamento escalável para vídeos/imagens |
| **Sincronização** | WebSockets + Polling | Real-time para dashboard, polling para players |

### Fluxo de Dados

```
Dashboard (React)
    ↓ [tRPC mutation]
Backend (Express + tRPC)
    ↓ [Validação]
Database (MySQL)
    ↓ [Trigger notification]
Notifications API
    ↓ [Push para players]
Players (PWA)
    ↓ [Polling a cada 30s]
Backend (/api/player/sync)
    ↓ [Delta sync]
Player Cache
    ↓ [Playback]
```

---

## 📊 Modelo de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Autenticação e perfil de usuários |
| `media` | Biblioteca de vídeos/imagens |
| `players` | Registro de dispositivos TV/display |
| `campaigns` | Playlists de conteúdo |
| `campaignMedia` | Relacionamento many-to-many (ordenação) |
| `playerCampaigns` | Atribuição de campanhas a players |
| `syncLogs` | Histórico de sincronização WiFi |
| `notifications` | Histórico de notificações push |

Veja `ARCHITECTURE.md` para detalhes completos do schema.

---

## 🔐 Segurança

- **Autenticação**: OAuth via Manus, sem gerenciamento de senhas
- **Autorização**: Role-based access control (admin/user)
- **Validação**: Todas as entradas validadas no backend
- **HTTPS**: Comunicação criptografada
- **CORS**: Configurado para aceitar apenas origens autorizadas
- **Rate Limiting**: Proteção contra abuso de API

---

## 🧪 Testes

```bash
# Executar testes unitários
pnpm test

# Executar com cobertura
pnpm test -- --coverage

# Modo watch
pnpm test -- --watch
```

Todos os módulos devem ter testes com mínimo 80% de cobertura.

---

## 📈 Roadmap (3 meses)

### Mês 1: MVP Web ✅
- [x] Landing page institucional
- [x] Autenticação OAuth
- [x] Dashboard com sidebar
- [x] Módulo Biblioteca (upload, grid)
- [x] Módulo Players (cadastro, pareamento)
- [x] Módulo Campanhas (criação, agendamento)
- [x] Relatórios básicos
- [x] Perfil de usuário

### Mês 2-3: App Mobile + Sincronização
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

## 🚢 Deployment

### Preparação para Produção

```bash
# Build do frontend
pnpm build

# Build do backend
pnpm build:server

# Verificar tipos
pnpm check

# Executar testes
pnpm test
```

### Variáveis de Ambiente Obrigatórias

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/pale_cms

# OAuth
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Segurança
JWT_SECRET=seu_jwt_secret_aleatorio

# Storage S3
AWS_ACCESS_KEY_ID=sua_chave
AWS_SECRET_ACCESS_KEY=seu_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=seu_bucket

# Notificações
BUILT_IN_FORGE_API_KEY=sua_chave_api
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

---

## 📚 Documentação

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura técnica completa
- **[API Documentation](./docs/API.md)** - Referência de endpoints tRPC
- **[Database Schema](./docs/SCHEMA.md)** - Modelo de dados detalhado
- **[Contributing Guide](./CONTRIBUTING.md)** - Guia para contribuidores

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia [CONTRIBUTING.md](./CONTRIBUTING.md) para entender nosso processo de desenvolvimento.

### Processo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para detalhes.

---

## 💬 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/pale-cms/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/pale-cms/discussions)
- **Email**: suporte@paleproducoes.com

---

## 🎓 Aprendizados e Boas Práticas

### Frontend

- React 19 com hooks modernos
- tRPC para type-safe API calls
- Tailwind CSS 4 para styling
- Componentes shadcn/ui para UI consistente
- Wouter para roteamento leve

### Backend

- Express 4 com tRPC para RPC type-safe
- Drizzle ORM para database access
- Validação com Zod
- Middleware para autenticação e autorização
- Error handling robusto

### Database

- MySQL com transações ACID
- Drizzle migrations para versionamento de schema
- Índices otimizados para queries frequentes
- Soft deletes para dados críticos

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ usando Manus AI, React, Node.js e muito café.

---

**Última atualização:** Março 2026  
**Versão:** 1.0.0  
**Status:** MVP em desenvolvimento
