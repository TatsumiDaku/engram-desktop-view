# Proposal: compact-sessions-projects

## Intent

Add ability to compact multiple sessions into one, or compact multiple projects into one. Session compaction requires a **destructive approach** (recreate observations with new session_id) due to backend limitation where `session_id` is immutable. Project compaction uses existing `/projects/migrate` endpoint.

## Scope

### In Scope
- New "Compact" nav item in sidebar (after "Memories")
- `CompactModal` with two tabs: "Compact Sessions" and "Compact Projects"
- **Session compaction**: Select multiple sessions → create new session → migrate observations (delete originals) → delete empty sessions
- **Project compaction**: Select multiple projects → merge into new project name via `/projects/migrate`
- Preview panel showing selection counts before confirming
- Success stats after completion (en/es localization)

### Out of Scope
- Non-destructive session compaction (backend doesn't support moving observations between sessions)
- Session compaction across different projects (would require project migration + session migration)
- Auto-generated names (manual input only)

## Capabilities

### New Capabilities
- `session-compaction`: Select multiple sessions, create compacted session, migrate observations via recreate+delete, delete empty source sessions
- `project-compaction`: Select multiple projects, merge into new project via existing `/projects/migrate` API

### Modified Capabilities
- None

## Approach

### Session Compaction (Destructive)
```
1. User selects N sessions (checkboxes)
2. User enters name for new compacted session
3. On "Compact" click:
   a. Create new session via POST /sessions
   b. For each observation in selected sessions:
      - POST /observations (new obs with new session_id, same content)
      - DELETE /observations/{id} (hard delete original)
   c. DELETE /sessions/{id} for each source session (now empty)
4. Show success stats
```

**Risk**: Original observation IDs, timestamps are lost. Only content/tags preserved.

### Project Compaction
```
1. User selects N projects (checkboxes)
2. User enters target project name
3. On "Compact" click:
   - For each source project: POST /projects/migrate {from, to}
4. Show success stats
```

Uses existing `mergeProjects()` from `engramService.ts`.

## UI Design

```
┌─────────────────────────────────────────────────────────┐
│  Compact Sessions or Projects                    [X]    │
├─────────────────────────────────────────────────────────┤
│  [Compact Sessions] [Compact Projects]                  │
├─────────────────────────────────────────────────────────┤
│  Sessions View:                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [ ] Session A (project-x) - 12 obs - 2026-04-20 │   │
│  │ [x] Session B (project-x) - 8 obs  - 2026-04-21 │   │
│  │ [x] Session C (project-y) - 3 obs  - 2026-04-22 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Preview:                                               │
│  • 2 sessions selected                                  │
│  • 11 observations to compact                           │
│                                                         │
│  New session name: [________________]                   │
│                                                         │
│  ⚠️ Warning: This will recreate observations with new   │
│  session IDs. Original timestamps will be lost.        │
│                                                         │
│  [Cancel]                      [Compact Sessions → 1]   │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### Session Compaction
```
useCompactSessions(selectedSessionIds, newSessionName)
  → createSession(newSessionName)
  → getObservationsForSessions(selectedSessionIds)
  → for each obs: createObservation({...obs, sessionId: newSessionId})
  → for each obs: deleteObservation(obs.id, hard=true)
  → for each session: deleteSession(sessionId)
```

### Project Compaction
```
useCompactProjects(selectedProjectNames, targetProject)
  → for each source: mergeProjects(source, targetProject)
```

## i18n Keys

```json
{
  "tabs": { "compact": "Compact" },
  "compact": {
    "title": "Compact Sessions or Projects",
    "tabs": { "sessions": "Compact Sessions", "projects": "Compact Projects" },
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
      "deleted": "{count} sesiones eliminadas"
    }
  }
}
```

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/organisms/CompactModal.tsx` | New | Main modal with tabs for sessions/projects |
| `src/hooks/useCompactSessions.ts` | New | Session compaction logic (destructive recreate) |
| `src/hooks/useCompactProjects.ts` | New | Project compaction via existing mergeProjects |
| `src/services/engramService.ts` | Modified | Add `createSession`, `createObservation`, `deleteObservationHard`, `deleteSession` |
| `src/stores/uiStore.ts` | Modified | Add `compactModalOpen` state |
| `src/components/organisms/NavigationSidebar.tsx` | Modified | Add "Compact" nav item |
| `src/types/engram.ts` | Modified | Add `TabType` = "compact" |
| `locales/{en,es,pt}/translation.json` | Modified | Add i18n keys |

## API Endpoints Needed

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/sessions` | POST | Create new session (returns `{id}`) |
| `/observations` | POST | Create observation with new session_id |
| `/observations/{id}?hard=true` | DELETE | Hard delete original observation |
| `/sessions/{id}` | DELETE | Delete empty source session |
| `/projects/migrate` | POST | Existing - migrate project observations |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Loss of observation metadata (IDs, original timestamps) | High | Clear warning in UI before proceeding |
| Partial failure during multi-step compaction | Medium | Transaction-like pattern: fail entire operation if any step fails |
| Backend timeout with large observation sets | Low | Consider batching or background processing |
| Session deletion fails if not truly empty | Low | Verify 0 observations before delete |

## Rollback Plan

- **Sessions**: No rollback possible (original observations deleted). Recovery only via backup/restore.
- **Projects**: Manual reassignment of observations back to original projects via PATCH `/observations/{id}` with `project` field.

## Dependencies

- Existing `mergeProjects()` from `engramService.ts`
- Existing `/projects/migrate` backend endpoint

## Success Criteria

- [ ] "Compact" nav item visible in sidebar after "Memories"
- [ ] Clicking opens modal with two tabs
- [ ] Session tab: sessions grouped by project, checkboxes work, preview updates
- [ ] Session tab: warning shown about destructive operation
- [ ] Session tab: compact button creates new session, recreates observations, deletes sources
- [ ] Project tab: project list with counts, checkboxes work
- [ ] Project tab: uses existing mergeProjects for each selected project
- [ ] Success message shows correct stats in user's locale
- [ ] All three languages (en/es/pt) display correctly
