# EngramDesktopView - SDD Refactoring Plan

## Phase 0 Summary

**Critical Issues Identified:**

| Issue | Location | Severity |
|-------|----------|----------|
| Dead code: SessionDetail.tsx, ClearFiltersBar.tsx, engramApiDirect.ts | src/pages/, src/components/, src/config/ | HIGH |
| `typeFilter` in uiStore never connected | uiStore.ts:17, MemoriesTab.tsx:28 | HIGH |
| TYPE_COLORS duplicated | TypeBadge.tsx:5, TimelineTab.tsx:11 | MEDIUM |
| Session parsing duplicated (3x) | engramService.ts:125-130, 221-226, 188-191 | MEDIUM |
| FTS5 term flooding (10 broad terms) | engramService.ts:17-27 | HIGH |
| window.alert() instead of toast | SettingsModal.tsx:27,44,46 | HIGH |
| No server-side pagination (fetches 500) | engramService.ts:120 | HIGH |
| Health check polls every 2s | useEngram.ts:122 | MEDIUM |
| useEngram.ts mixes 14 hooks | useEngram.ts (165 lines) | MEDIUM |
| engramService.ts mixes concerns | engramService.ts (386 lines) | MEDIUM |

---

## Missing Features Inventory

| Feature | Purpose | Problem Solved | Complexity | Priority |
|---------|---------|----------------|------------|----------|
| **Toast notification system** | Replace `window.alert()` calls | Better UX, non-blocking feedback | LOW | ALTA |
| **Server-side pagination** | Limit data fetched per request | Performance with large datasets | MEDIUM | ALTA |
| **Health status indicator** | Show API connectivity in UI | Users know when system is offline | LOW | ALTA |
| **Keyboard shortcuts** | Global hotkeys for common actions | Power user efficiency | MEDIUM | MEDIA |
| **Error boundaries** | Graceful error handling in React | App doesn't crash on errors | MEDIUM | ALTA |
| **Project switcher UI** | Quick project filtering | Multi-project workflow | MEDIUM | MEDIA |
| **Activity metrics/charts** | Visual session activity | Quick health overview | HIGH | MEDIA |
| **Session comparison** | Side-by-side session view | Analyze session differences | HIGH | BAJA |
| **Tag management UI** | Create/edit observation tags | Organize memories | MEDIUM | BAJA |
| **Real-time sync indicator** | Show when data is syncing | Clarity on data state | LOW | MEDIA |
| **Filtered observations count** | Show filtered vs total | Understand filter impact | LOW | BAJA |
| **Auto-refresh toggle** | User control over polling | Battery/resource saving | LOW | BAJA |
| **Settings validation** | Validate import/export inputs | Data integrity | MEDIUM | MEDIA |
| **Merge projects modal** | UI for merge functionality | Already exists but poorly integrated | MEDIUM | MEDIA |

---

## Refactor Needs

| Issue | Location | Fix Approach | Risk |
|-------|----------|-------------|------|
| **Dead code removal** | SessionDetail.tsx, ClearFiltersBar.tsx, engramApiDirect.ts | Delete files, update imports | LOW - these are unused |
| **Connect typeFilter to store** | uiStore.ts → MemoriesTab.tsx | Wire uiStore.typeFilter to component | LOW - local state mirrors store |
| **Extract TYPE_COLORS to shared** | TypeBadge.tsx, TimelineTab.tsx | Move to types/engram.ts as constant | LOW - pure extraction |
| **Extract session parsing utility** | engramService.ts (3 places) | Create `parseSessionFromApi()` helper | LOW - pure refactor |
| **Fix FTS5 flooding** | engramService.ts:17-27 | Use single broad search or paginated API | MEDIUM - changes data fetching behavior |
| **Create toast system** | SettingsModal.tsx | Build ToastContainer + useToast hook | MEDIUM - replaces alert() |
| **Add server-side pagination** | engramService.ts, hooks | Add limit/offset params to API calls | MEDIUM - API must support it |
| **Reduce health poll interval** | useEngram.ts:122 | Increase to 10s or add toggle | LOW - simple config change |
| **Split useEngram.ts** | hooks/useEngram.ts | Group by domain: sessions/, memories/, settings/ | MEDIUM - file restructuring |
| **Split engramService.ts** | services/engramService.ts | Group by domain: sessions/, memories/, settings/ | MEDIUM - file restructuring |
| **Error boundaries** | App.tsx, Dashboard.tsx | Wrap with ErrorBoundary component | LOW - standard React pattern |

---

## Phase 1: Base Refactor

### What
- Architecture cleanup and dead code removal
- Establish shared utilities
- Create toast notification system
- Add error boundaries

### Files

| File | Action |
|------|--------|
| src/pages/SessionDetail.tsx | DELETE - dead code |
| src/components/molecules/ClearFiltersBar.tsx | DELETE - dead code |
| src/config/engramApiDirect.ts | DELETE - dead code |
| src/types/engram.ts | ADD: TYPE_COLORS constant |
| src/components/atoms/TypeBadge.tsx | REFACTOR: use shared TYPE_COLORS |
| src/pages/TimelineTab.tsx | REFACTOR: use shared TYPE_COLORS |
| src/services/engramService.ts | ADD: parseSession helper, fix FTS5 flooding |
| src/hooks/useEngram.ts | REFACTOR: split into sub-hooks |
| src/components/Toast.tsx | CREATE: Toast component |
| src/hooks/useToast.ts | CREATE: toast hook |
| src/components/ErrorBoundary.tsx | CREATE: error boundary |
| src/App.tsx | ADD: error boundaries |

### Risks
- **Breaking**: Deleting dead code is safe, but verify no dynamic imports exist
- **Breaking**: TYPE_COLORS change requires type consistency
- **Medium**: FTS5 fix may change which observations are returned (dedup logic)

### Validation
```bash
# Verify dead code removed
grep -r "SessionDetail\|ClearFiltersBar\|engramApiDirect" src/

# Verify TYPE_COLORS shared
grep "TYPE_COLORS" src/types/engram.ts src/components/atoms/TypeBadge.tsx

# Build and run
npm run build && npm run dev
```

---

## Phase 2: Core Features

### What
- Toast notification system replaces all alert() calls
- Health status indicator in header
- typeFilter properly wired to uiStore
- Reduced health polling interval
- Error boundaries for all major sections

### Files

| File | Action |
|------|--------|
| src/components/organisms/SettingsModal.tsx | REPLACE: alert() → useToast() |
| src/components/organisms/Header.tsx | ADD: health status indicator |
| src/stores/uiStore.ts | VERIFY: typeFilter wired |
| src/pages/MemoriesTab.tsx | REFACTOR: use uiStore.typeFilter |
| src/components/Toast.tsx | IMPROVE: toast queue, positioning |
| src/pages/Dashboard.tsx | ADD: error boundaries per tab |

### Risks
- **Low**: Toast system is additive improvement
- **Low**: Health indicator is visual only

### Validation
- Settings modal: export/import should show toast, not alert
- Health indicator shows online/offline status
- Tab errors don't crash entire app

---

## Phase 3: Management Features

### What
- Project switcher dropdown in header
- Settings modal improvements (validation, feedback)
- Merge projects modal workflow polish
- Export/import with progress indication

### Files

| File | Action |
|------|--------|
| src/components/organisms/Header.tsx | ADD: project switcher |
| src/components/organisms/SettingsModal.tsx | IMPROVE: validation, progress states |
| src/components/organisms/MergeProjectsModal.tsx | IMPROVE: workflow, validation |
| src/hooks/useEngram.ts | SPLIT: extract project-related hooks |

### Risks
- **Medium**: Project switching requires filter reset logic
- **Low**: Modal improvements are additive

### Validation
- Can switch between projects
- Export shows progress, success toast
- Import validates JSON, error toast on failure

---

## Phase 4: Polish

### What
- Keyboard shortcuts (?, /, Esc)
- Auto-refresh toggle for health/sessions
- Performance: virtualized lists for large datasets
- Client-side pagination "Load more" improvement
- Activity charts on Home tab

### Files

| File | Action |
|------|--------|
| src/hooks/useKeyboardShortcuts.ts | CREATE |
| src/components/organisms/Header.tsx | ADD: shortcut hint, refresh toggle |
| src/pages/SessionsTab.tsx | IMPROVE: virtualized grid |
| src/pages/MemoriesTab.tsx | IMPROVE: virtualized list |
| src/pages/HomeTab.tsx | ADD: activity chart placeholder |
| src/stores/uiStore.ts | ADD: autoRefresh setting |

### Risks
- **Medium**: Virtualization adds complexity
- **Low**: Keyboard shortcuts may conflict with accessibility

### Validation
- Press `?` shows shortcut help
- Press `/` focuses search
- Large session lists scroll smoothly

---

## Phase 5: Advanced

### What
- Session comparison view
- Tag management UI
- Real-time sync indicator
- Advanced search with filters
- Export formats (JSON, Markdown, CSV)

### Files

| File | Action |
|------|--------|
| src/pages/SessionCompare.tsx | CREATE |
| src/pages/TagsManagement.tsx | CREATE |
| src/components/organisms/SyncIndicator.tsx | CREATE |
| src/services/engramService.ts | ADD: advanced search, export formats |
| src/hooks/useEngram.ts | SPLIT: remaining hooks |

### Risks
- **High**: Session comparison is complex feature
- **Medium**: Tag management requires API support

### Validation
- Can select 2 sessions and compare
- Tags can be created, edited, deleted
- Sync indicator shows real-time status

---

## Technical Debt Priorities

| Priority | Issue | Blocking |
|----------|-------|----------|
| 1 | **Fix FTS5 flooding** | Performance issues with large datasets |
| 2 | **Add server-side pagination** | Cannot scale beyond 500 sessions |
| 3 | **Remove dead code** | codebase confusion, maintenance burden |
| 4 | **Create toast system** | Poor UX, breaks accessibility |
| 5 | **Add error boundaries** | App crashes on any error |
| 6 | **Connect typeFilter** | Filter state not persisted |
| 7 | **Reduce health poll** | Unnecessary network traffic |

---

## Implementation Order

1. **First**: Phase 1 (Base Refactor) - Clean codebase
2. **Then**: Phase 2 (Core Features) - UX improvements, health indicator
3. **Next**: Phase 3 (Management) - Project switcher, modal polish
4. **After**: Phase 4 (Polish) - Performance, keyboard shortcuts
5. **Finally**: Phase 5 (Advanced) - If time/resources allow

**Critical Path**: Phases 1-2 are required before any feature work due to technical debt

---

## Open Questions

1. **Pagination**: Does the Engram backend support `limit/offset` parameters? If not, server-side pagination requires API changes first.

2. **FTS5 Strategy**: Should `getAllObservations` use a single broad search with client-side filtering, or is there a dedicated endpoint for paginated observations?

3. **Health Check**: Is the 2s polling intentional for real-time features, or should it be increased to 10-30s?

4. **SessionDetail.tsx**: This page exists but is never routed. Was it intended for a "session click → detail view" feature? Should we implement routing or delete it?

5. **Project Filter**: The `projectFilter` in uiStore exists but MemoriesTab uses local state. Should we unify all filters in the store?

6. **Type Colors**: Should these be themeable (light/dark mode affects colors)?

---

## Estimated Timeline

| Phase | Effort | Risk |
|-------|--------|------|
| Phase 1: Base Refactor | 2-3 days | LOW |
| Phase 2: Core Features | 1-2 days | LOW |
| Phase 3: Management | 2-3 days | MEDIUM |
| Phase 4: Polish | 2-3 days | MEDIUM |
| Phase 5: Advanced | 3-5 days | HIGH |

**Total**: ~10-16 days estimated
