# Tasks: compact-sessions-projects

## Phase 1: Foundation (types, API additions to engramService, uiStore)

- [x] 1.1 Add `TabType = "compact"` to `src/types/engram.ts`
- [x] 1.2 Add `compactModalOpen: boolean` state to `src/stores/uiStore.ts`
- [x] 1.3 Add `createSession(name: string)` to `src/services/engramService.ts` (POST /sessions)
- [x] 1.4 Add `createObservation(obs: Partial<Observation>)` to `engramService.ts` (POST /observations)
- [x] 1.5 Add `deleteObservationHard(id: string)` to `engramService.ts` (DELETE /observations/{id}?hard=true)
- [x] 1.6 Add `deleteSession(id: string)` to `engramService.ts` (DELETE /sessions/{id})

## Phase 2: Core Implementation (hooks, modal)

- [x] 2.1 Create `src/hooks/useCompactSessions.ts` — select sessions → createSession → migrate obs via recreate+delete → delete empty sessions
- [x] 2.2 Create `src/hooks/useCompactProjects.ts` — select projects → call mergeProjects for each source
- [x] 2.3 Create `src/components/organisms/CompactModal.tsx` — two tabs (sessions/projects), checkboxes, preview panel, warning, success stats
- [x] 2.4 Implement session list grouped by project with observation counts
- [x] 2.5 Implement project list with session/observation counts

## Phase 3: Integration (NavigationSidebar, i18n)

- [x] 3.1 Add "Compact" nav item to `src/components/organisms/NavigationSidebar.tsx` after "Memories"
- [x] 3.2 Add i18n keys to `locales/en/translation.json` (tabs.compact, compact.title, compact.tabs.sessions/projects, compact.sessions.*, compact.projects.*, compact.success.*)
- [x] 3.3 Add i18n keys to `locales/es/translation.json`
- [x] 3.4 Add i18n keys to `locales/pt/translation.json`
- [x] 3.5 Wire compactModalOpen to modal open/close in NavigationSidebar

## Phase 4: Testing

- [x] 4.1 Write unit tests for `useCompactSessions` hook (mock createSession, createObservation, deleteObservationHard, deleteSession)
- [x] 4.2 Write unit tests for `useCompactProjects` hook (mock mergeProjects)
- [x] 4.3 Write tests for CompactModal tabs rendering and checkbox selection
- [x] 4.4 Write tests for destructive warning display on session compaction

## Implementation Order

Foundation → Hooks → Modal → Integration (sidebar, i18n) → Testing

Types and API additions (Phase 1) are prerequisites for hooks (Phase 2). Modal and hooks are independent but both needed before sidebar integration (Phase 3).