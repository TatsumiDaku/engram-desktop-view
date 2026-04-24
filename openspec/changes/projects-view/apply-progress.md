# Apply Progress: projects-view deletion feature

## Completed Tasks

### Phase 1: Project/Session Deletion Feature

- [x] 1.1 Add i18n keys for deletion (en/es/pt)
  - Added `projects.deleteProject`, `projects.deleteConfirm`, `projects.deleteMessage`, `projects.deleteSessions`, `projects.selectAll`, `projects.deselectAll`, `projects.deleteSelected`, `projects.selected`, `projects.noSessionsToDelete`

- [x] 1.2 Add session selection state to ProjectsTab
  - Added `selectedSessions` state (Set<string>)
  - Added `deleteError` state for error display
  - Added helper functions: `toggleSessionSelection`, `selectAllEmptySessions`, `deselectAllSessions`

- [x] 1.3 Add session multi-select with checkboxes
  - Added checkbox to each session row in project detail panel
  - Checkboxes disabled for sessions with observations > 0
  - Visual highlight for selected sessions

- [x] 1.4 Add selection controls (select all/deselect all)
  - "Select All" button appears when there are empty sessions
  - "Deselect All" button appears when selections exist
  - Selection count indicator shown when items are selected

- [x] 1.5 Add delete selected sessions functionality
  - `handleDeleteSelectedSessions` function with confirmation dialog
  - Uses existing `useDeleteEmptySession` hook
  - Refetches data after deletion

- [x] 1.6 Add project deletion (conditional)
  - Project is deletable only if ALL sessions have 0 observations
  - `isProjectDeletable` computed from `selectedProjectData.sessions.every(s => s.observationCount === 0)`
  - `handleDeleteProject` deletes all sessions in project sequentially
  - Confirmation dialog with localized message

- [x] 1.7 Add error display
  - Fixed position error notification for delete failures
  - Dismiss button to clear error

- [x] 1.8 Clear selections when changing projects
  - `setSelectedSessions(new Set())` called when selecting new project

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/locales/en.json` | Modified | Added 10 new i18n keys for deletion feature |
| `src/locales/es.json` | Modified | Added 10 new i18n keys for deletion feature |
| `src/locales/pt.json` | Modified | Added 10 new i18n keys for deletion feature |
| `src/pages/ProjectsTab.tsx` | Modified | Added session selection, multi-select, bulk delete, project delete |

## Implementation Notes

### Project Deletion Logic
- A project is considered **deletable** only when ALL its sessions have `observationCount === 0`
- When deleting a project, all its sessions are deleted sequentially using the existing `deleteEmptySession` API
- After deletion, the view resets to no project selected

### Session Selection Logic  
- Only sessions with `observationCount === 0` can be selected for deletion
- Sessions with observations > 0 have disabled checkboxes
- "Select All" only selects empty sessions (sessions with 0 observations)
- After deleting selected sessions, the selection is cleared

### API Usage
- Uses existing `useDeleteEmptySession()` hook from `useEngram.ts`
- Uses existing `deleteEmptySession()` service function from `engramService.ts`
- No new API endpoints required

## Deviations from Design
- None — implementation follows the spec

## Issues Found
- None

## Remaining Tasks
- None — feature implementation complete
