# Changelog

All notable changes to the **Save Shield** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-17

### Added
- **19 Complete Pages**: Landing Page, Login, Register, Dashboard, Emergency Contacts, SOS Center, Live Emergency, Relay Network, Device Network, Emergency History, Emergency Details, Timeline, Context Card, Risk Assessment, Notifications, Settings, Profile, Demo/Simulation Mode, and About Page.
- **Dual-Mode System**:
  - Online SOS flow with GPS capture and cloud backend updates.
  - Offline Bluetooth Mesh Relay simulation ($A \rightarrow B \rightarrow C \rightarrow \text{Backend}$).
- **Packet Protection & Loop Prevention**: Hop limit enforcement ($10$), TTL expiry ($5\text{ min}$), visited node tracking ($A \rightarrow B \rightarrow C \rightarrow A$), and deduplication cache.
- **Rule-Based Risk Assessment Engine**: Multi-factor scoring ($0\text{--}2$: LOW, $3\text{--}5$: MEDIUM, $6+$: HIGH).
- **Database Architecture**: PostgreSQL / Supabase migration schema with RLS policies, indexing, and realtime subscriptions.
- **Local Fallback**: Full local storage persistence mode when cloud backend variables are omitted.
- **Comprehensive Testing**: Vitest suite with 35 passing unit tests covering packet validation, risk scoring, simulation mechanics, and date formatters.
- **Deployment Ready**: Included `vercel.json` rewrites, `public/_redirects` for Netlify, and `.github/workflows/ci.yml` for automated CI build verification on push.
