# Technical Design: compact-sessions-projects

## Context

This change adds the ability to compact sessions and projects. Session compaction is **destructive** due to a backend limitation where `session_id` is immutable. Project compaction uses the existing `/projects/migrate` endpoint.

---

## Technical Approach

### Session Compaction: Destructive Recreate Pattern

The backend does not support updating an observation's `session_id`. Sessions are identified by their `session_id`, and this field cannot be modified post-creation.

**Workaround**: Recreate observations with new session_id, then delete originals.

```
1. Create new session (POST /sessions) → returns new session_id
2. For each observation in selected sessions:
   a. Create new observation (POST /observations) with new session_id, same content/tags
   b. Hard delete original observation (DELETE /observations/{id}?hard=true)
3. Delete source sessions (DELETE /sessions/{id}) — now empty
```

**Trade-off**: Original observation IDs and timestamps are lost. Only content, type, scope, and topicKey are preserved.

### Project Compaction: Non-destructive Merge

Uses existing `mergeProjects(source, target)` from `engramService.ts`, which calls `POST /projects/migrate`.

---

## Architecture Decisions

### 1. Transaction-like Session Compaction

Session compaction follows a "all-or-nothing" approach for observation migration:
- If recreation fails → abort remaining operations, keep source sessions intact
- If deletion fails after recreation → continue attempting deletions, report partial success

**Rationale**: The destructive nature means we must be conservative. If we can't create the new observation, we shouldn't delete the original.

### 2. Tab-based Modal with Shared State

`CompactModal` contains two tabs (sessions/projects) sharing the modal container. Each tab manages its own selection state internally.

**Pattern**: Follows existing `MergeProjectsModal` structure with modal-level open state in `uiStore`.

### 3. Hooks-based Business Logic

- `useCompactSessions()`: Handles the full recreate+delete flow
- `useCompactProjects()`: Wraps `mergeProjects` mutation, iterates over selected sources

**Rationale**: Consistent with existing hooks pattern in `useEngram.ts`. Enables testability and separation of concerns.

### 4. API Methods Added to engramService

New methods added to support session compaction:
- `createSession(name: string): Promise<{id: string}>` — POST /sessions
- `createObservation(obs: Partial<Observation>): Promise<Observation>` — POST /observations
- `deleteObservationHard(id: string): Promise<void>` — DELETE /observations/{id}?hard=true
- `deleteSession(id: string): Promise<void>` — DELETE /sessions/{id}

**Note**: `mergeProjects` already exists in `engramService.ts`.

### 5. UI State in Zustand (uiStore)

Add `compactModalOpen: boolean` to `UIState`. Follows pattern for `mergeProjectsModalOpen`, `settingsModalOpen`, etc.

---

## Data Flow

### Session Compaction

```
User selects sessions → enters name → clicks Compact
        │
        ▼
useCompactSessions.execute(selectedIds, newName)
        │
        ├─► createSession(newName) ──► newSessionId
        │
        ├─► getAllObservations() ──► filter by sessionId in [selectedIds]
        │
        ├─► For each observation:
        │       createObservation({...obs, sessionId: newSessionId})
        │       deleteObservationHard(obs.id)
        │
        ├─► For each source session:
        │       deleteSession(sessionId)
        │
        ▼
Display success stats (sessions merged, observations preserved, sessions deleted)
```

### Project Compaction

```
User selects projects → enters target name → clicks Compact
        │
        ▼
useCompactProjects.execute(selectedProjects, targetProject)
        │
        ├─► For each source project:
        │       mergeProjects(source, targetProject)
        │
        ▼
Display success stats (projects migrated)
```

---

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `src/components/organisms/CompactModal.tsx` | Main modal with Sessions/Projects tabs |
| `src/hooks/useCompactSessions.ts` | Session compaction logic (recreate+delete) |
| `src/hooks/useCompactProjects.ts` | Project compaction via mergeProjects |

### Modified Files

| File | Change |
|------|--------|
| `src/types/engram.ts` | Add `"compact"` to `TabType` union |
| `src/stores/uiStore.ts` | Add `compactModalOpen` state and setter |
| `src/services/engramService.ts` | Add `createSession`, `createObservation`, `deleteObservationHard`, `deleteSession` |
| `src/components/organisms/NavigationSidebar.tsx` | Add "Compact" nav item after "Memories" |
| `src/locales/es.json` | Add i18n keys for compact feature |
| `src/locales/en.json` | Add i18n keys for compact feature |
| `src/locales/pt.json` | Add i18n keys for compact feature |

---

## API Endpoints

| Endpoint | Method | Purpose | New/Existing |
|----------|--------|---------|--------------|
| `/sessions` | POST | Create new session | New |
| `/observations` | POST | Create observation (recreated in new session) | Existing |
| `/observations/{id}?hard=true` | DELETE | Hard delete original observation | New |
| `/sessions/{id}` | DELETE | Delete empty source session | Existing (deleteEmptySession) |
| `/projects/migrate` | POST | Migrate project observations | Existing |

---

## Component Design

### CompactModal Structure

```
<Modal>
  <Tabs>
    <TabSessions> — Checkbox list grouped by project
    <TabProjects> — Checkbox list with counts
  </Tabs>
  
  <PreviewPanel>
    Sessions: {count} selected, {obsCount} observations
    Projects: {count} selected
  </PreviewPanel>
  
  <NameInput> — Target session/project name
  
  {Sessions tab: <DestructiveWarning>}
  
  <Actions>
    <Cancel>
    <CompactButton> — disabled until valid selection + name
  </Actions>
  
  {Success: <StatsDisplay>}
</Modal>
```

### Session Tab Specifics

- Sessions grouped by project (Map<project, Session[]>)
- Each row: checkbox + session name + observation count + date
- Preview shows: "X sessions selected, Y observations to compact"
- Destructive warning prominently displayed above action buttons
- Button text: "Compact (X → 1)" showing the consolidation

### Project Tab Specifics

- Flat list of projects (no grouping)
- Each row: checkbox + project name + session count + observation count
- Preview shows: "X projects selected"
- NO destructive warning (merge is non-destructive)
- Button text: "Compact Projects"

---

## i18n Keys Structure

```json
{
  "tabs": {
    "compact": "Compact"
  },
  "compact": {
    "title": "Compact Sessions or Projects",
    "tabs": {
      "sessions": "Compact Sessions",
      "projects": "Compact Projects"
    },
    "sessions": {
      "title": "Compact Sessions",
      "selectSessions": "Select sessions to compact",
      "selectedCount": "{count} session(s) selected",
      "observationCount": "{count} observations",
      "newSessionName": "Name for compacted session",
      "namePlaceholder": "e.g., Week 16 Review",
      "warning": "This will recreate observations with new session IDs. Original timestamps will be lost.",
      "button": "Compact ({count} → 1)"
    },
    "projects": {
      "title": "Compact Projects",
      "selectProjects": "Select projects to compact",
      "selectedCount": "{count} project(s) selected",
      "sessionCount": "{count} sessions",
      "observationCount": "{count} observations",
      "targetProject": "Target project name",
      "targetPlaceholder": "e.g., main-project",
      "button": "Compact Projects"
    },
    "success": {
      "title": "✅ Compactación exitosa",
      "sessions": "{count} sesiones → 1 sesión",
      "observations": "{count} observaciones preservadas",
      "deleted": "{count} sesiones eliminadas",
      "projects": "{count} proyectos compactados"
    }
  }
}
```

---

## Testing Strategy

### Unit Tests

1. **`useCompactSessions` hook tests**
   - Mock `createSession`, `getAllObservations`, `createObservation`, `deleteObservationHard`, `deleteSession`
   - Test successful compaction flow
   - Test failure handling at recreation step (should not delete originals)
   - Test partial deletion scenario

2. **`useCompactProjects` hook tests**
   - Mock `mergeProjects`
   - Test single project migration
   - Test multiple projects migration
   - Test API failure handling

3. **`CompactModal` component tests**
   - Test tab switching
   - Test session list rendering (grouped by project)
   - Test project list rendering (with counts)
   - Test checkbox selection updates preview
   - Test destructive warning visibility on sessions tab
   - Test NO warning on projects tab
   - Test button disabled state (empty selection or empty name)
   - Test success stats display

### Integration Tests

1. Full session compaction flow (if API mocking allows)
2. Full project compaction flow

### Edge Cases

- Selecting all sessions in one project
- Selecting sessions from multiple projects
- Empty session (0 observations) selected — verify delete succeeds
- Very large observation counts (stress test)

---

## Open Questions

1. **Observation count estimation**: The preview needs to show observation count before compaction. Currently, `Session` type has `observationCount` field. Should we trust this or fetch real-time counts?

2. **Session deletion verification**: Before deleting source sessions, should we verify they're actually empty (0 observations)? The spec mentions this as a risk.

3. **Project compaction target exists**: If target project name matches an existing project, does the API merge into it or create new? Need to verify behavior.

4. **Concurrent compaction prevention**: Should we disable the compact button while another compaction is in progress to prevent race conditions?

5. **Navigation during compaction**: If user navigates away during active compaction, should we warn about potential data loss?

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Observation metadata loss (IDs, timestamps) | Clear warning in UI before proceeding |
| Partial failure during compaction | Fail-safe: abort if recreation fails, continue deletions if deletion fails |
| Large datasets causing timeout | Consider batching observations in chunks of 100 |
| Session deletion with remaining observations | Verify empty before delete |

---

## Dependencies

- `engramService.ts`: `createSession`, `createObservation`, `deleteObservationHard`, `deleteSession` (new), `mergeProjects` (existing)
- `useEngram.ts`: Pattern for hook structure (useMutation, useQueryClient)
- `MergeProjectsModal.tsx`: UI pattern for modal structure
- `uiStore.ts`: State management pattern for modal open/close
- `NavigationSidebar.tsx`: Nav item pattern