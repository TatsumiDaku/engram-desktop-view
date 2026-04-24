# Tasks: redesign-minimalist-professional

## Phase 1: CSS Foundation

- [x] 1.1 Update globals.css with CSS variables for new color palette
- [x] 1.2 Update tailwind.config.js colors to use var() references (already done)
- [x] 1.3 Add darkMode: 'class' to tailwind config (already done)
- [x] 1.4 Verify CSS vars

## Phase 2: HomeTab Redesign

- [x] 2.1 Simplify hero section (remove shadow-glow effects)
- [x] 2.2 Replace inline HSL with semantic class names
- [x] 2.3 Replace emoji with simple text or SVG icon

## Phase 3: Navigation Sidebar

- [x] 3.1 Create NavigationSidebar.tsx with 5 nav items (Home, Sessions, Memories, Search, Settings)
- [x] 3.2 Create useSidebar.ts hook for collapse state
- [x] 3.3 Update Dashboard.tsx to use NavigationSidebar instead of TabBar
- [ ] 3.4 Remove old TabBar.tsx (file delete not available)

## Phase 4: Page HSL Cleanup

- [x] 4.1 SessionsTab.tsx - replace all hsl(263,70%,58%) with primary color classes
- [x] 4.2 grep for remaining HSL(263 patterns across src/
- [x] 4.3 Update all inline HSL to use CSS vars (TopicsTab, TimelineTab, MemoriesTab, EmptySessionsTab, PromptsTab, SyncIndicator, SessionCompare)

## Phase 5: LogPanel & Polish

- [ ] 5.1 Minimize LogPanel to bottom bar (LogPanel already has minimize behavior)
- [ ] 5.2 Update any remaining component styling
- [ ] 5.3 Run dev server to verify

## Notes

- TabBar.tsx still exists but is no longer used (Dashboard uses NavigationSidebar)
- LogPanel.tsx already has minimize-to-button behavior - may not need changes
