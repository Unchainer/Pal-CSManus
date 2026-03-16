# Palé CMS - Project TODO

## Phase 1: Foundation & Database (Week 1-2)

- [x] Define Drizzle schema (users, media, players, campaigns, sync_logs, notifications)
- [x] Generate and apply database migrations
- [x] Create database helper functions in server/db.ts
- [ ] Setup S3 storage helpers for media upload
- [ ] Create vitest tests for database operations

## Phase 2: Landing Page (Week 1-2)

- [x] Design landing page layout and visual identity
- [x] Create Hero section with CMS overview
- [x] Implement Features showcase section
- [x] Add Technical Architecture section
- [x] Create Roadmap section (3-month timeline)
- [x] Add Call-to-Action buttons (GitHub, Documentation)
- [ ] Optimize for SEO and performance
- [x] Test responsive design on mobile/tablet/desktop

## Phase 3: Authentication & Dashboard Shell (Week 2-3)

- [x] Verify Manus OAuth integration
- [x] Create DashboardLayout component with sidebar
- [x] Implement navigation menu (Biblioteca, Players, Campanhas, Relatórios, Configurações, Perfil)
- [x] Setup route structure in App.tsx
- [x] Create loading states and auth guards
- [ ] Add user profile dropdown in header
- [ ] Test authentication flow end-to-end

## Phase 4: Media Library Module (Week 3-4)

- [ ] Create media.upload tRPC procedure
- [ ] Implement file validation (type, size)
- [ ] Setup S3 upload with progress tracking
- [ ] Create Biblioteca page component
- [ ] Implement drag-drop upload UI
- [ ] Build media grid with thumbnails
- [ ] Add media metadata display (size, duration, upload date)
- [ ] Implement media deletion with confirmation
- [ ] Add search and filter functionality
- [ ] Create vitest tests for media operations

## Phase 5: Players Management Module (Week 4-5)

- [ ] Create players.register tRPC procedure
- [ ] Implement pairing code generation (6-char unique codes)
- [ ] Create Players page component
- [ ] Build player card UI with status indicator
- [ ] Implement player registration form
- [ ] Add real-time status updates (online/offline)
- [ ] Create player deletion functionality
- [ ] Add location field for player organization
- [ ] Implement "Manage Campaigns" button for each player
- [ ] Create vitest tests for player operations

## Phase 6: Campaigns Module (Week 5-6)

- [ ] Create campaigns.create tRPC procedure
- [ ] Implement campaigns.list and campaigns.getById
- [ ] Create campaigns.update and campaigns.delete procedures
- [ ] Create Campanhas page component
- [ ] Build campaign creation form with media selection
- [ ] Implement campaign scheduling (date/time picker)
- [ ] Add campaign calendar view
- [ ] Implement campaign activation/deactivation toggle
- [ ] Create campaign-to-player assignment functionality
- [ ] Add campaign status indicators
- [ ] Create vitest tests for campaign operations

## Phase 7: Reports & Analytics Module (Week 6-7)

- [ ] Create reports.getPlayerStatus tRPC procedure
- [ ] Implement reports.getSyncHistory procedure
- [ ] Create reports.getCampaignAnalytics procedure
- [ ] Create Relatórios page component
- [ ] Build player status dashboard with metrics
- [ ] Add sync history timeline visualization
- [ ] Implement campaign performance charts
- [ ] Add export functionality (CSV/PDF)
- [ ] Create vitest tests for reports

## Phase 8: Settings & User Profile (Week 7)

- [ ] Create settings.updatePreferences tRPC procedure
- [ ] Create Configurações page component
- [ ] Build user profile page with edit form
- [ ] Implement profile picture upload
- [ ] Add account settings (email, name)
- [ ] Create password/security settings
- [ ] Add notification preferences
- [ ] Implement logout functionality
- [ ] Create vitest tests for settings

## Phase 9: Notifications & Alerts (Week 7-8)

- [ ] Integrate Manus Notifications API
- [ ] Create notifications.sendToPlayers procedure
- [ ] Implement notifications.sendToOwner procedure
- [ ] Setup push notification triggers:
  - [ ] When campaign is assigned to player
  - [ ] When media is updated
  - [ ] When player goes offline
  - [ ] When sync error occurs
- [ ] Create notification history in database
- [ ] Add notification center UI in dashboard
- [ ] Create vitest tests for notifications

## Phase 10: Real-time Synchronization (Week 8)

- [ ] Create player sync endpoint (/api/player/sync)
- [ ] Implement WiFi polling mechanism (30-second intervals)
- [ ] Build sync delta calculation logic
- [ ] Add sync status logging to database
- [ ] Implement retry logic for failed syncs
- [ ] Create sync status indicators in Players module
- [ ] Add sync history view
- [ ] Create vitest tests for sync operations

## Phase 11: GitHub Repository Setup (Week 8)

- [ ] Initialize GitHub repository
- [ ] Create comprehensive README.md
- [ ] Add ARCHITECTURE.md documentation
- [ ] Create CONTRIBUTING.md guidelines
- [ ] Setup GitHub Actions for CI/CD
- [ ] Add issue templates
- [ ] Create project board with milestones
- [ ] Add deployment documentation
- [ ] Create API documentation

## Phase 12: Testing & Quality Assurance (Week 8-9)

- [ ] Write comprehensive vitest tests for all modules
- [ ] Achieve minimum 80% code coverage
- [ ] Perform manual E2E testing
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test responsive design on various devices
- [ ] Performance testing and optimization
- [ ] Security audit (XSS, CSRF, injection)
- [ ] Load testing with multiple concurrent users

## Phase 13: Deployment & Launch (Week 9)

- [ ] Prepare production environment
- [ ] Setup monitoring and alerting
- [ ] Create deployment documentation
- [ ] Perform final testing in staging
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Create user documentation
- [ ] Setup support channels

## Phase 14: Post-Launch & Optimization (Week 9+)

- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Optimize performance based on real usage
- [ ] Plan mobile app development (Month 2-3)
- [ ] Implement analytics tracking
- [ ] Create admin dashboard for platform metrics

---

## Completed Items

✅ **Completed in MVP Sprint 1:**
- ARCHITECTURE.md with full technical documentation
- Database schema with 8 tables and migrations
- Database helper functions for all modules
- Landing page with hero, features, architecture, roadmap
- Dashboard with 6 modules (Biblioteca, Players, Campanhas, Relatórios, Configurações, Perfil)
- README.md with comprehensive documentation
- Manus OAuth integration verified
- DashboardLayout with sidebar navigation
