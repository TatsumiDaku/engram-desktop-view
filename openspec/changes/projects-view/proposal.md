# Proposal: projects-view

## Intent

Provide a dedicated Projects tab that aggregates session data by project, showing project-level statistics and session lists. This addresses the need to quickly understand which projects exist, how active they are, and navigate to specific sessions within a project.

## Scope

### In Scope
- New "projects" tab in NavigationSidebar (5th nav item after home, sessions, memories, settings)
- `TabType` union addition: `"projects"`
- `useProjects` hook aggregating sessions by project with session/observation counts
- ProjectsList view: project cards showing name, session count, observation count
- Project detail view: list of sessions for selected project with ability to view observations per session
- i18n keys for en/es/pt

### Out of Scope
- Project creation/deletion/renaming (read-only view)
- Merging projects (already exists in settings)
- Project-level filtering beyond sessions view

## Capabilities

### New Capabilities
- `projects-list`: Display all unique projects derived from sessions data with aggregated stats
- `project-detail`: Show sessions and observations for a single project

### Modified Capabilities
- None (existing capabilities unchanged)

## Approach

1. **Add project aggregation**: Group existing `sessions` data by `project` field, count observations per project
2. **Create `useProjects` hook**: Derive project list from `useSessions`, compute per-project stats
3. **Add Projects page component**: Two-panel layout (list + detail)
4. **Update NavigationSidebar**: Add "projects" nav item
5. **Add i18n keys**: Follow existing `tabs.*` pattern

## UI/UX Design

```
┌─────────────────────────────────────────────────┐
│  [Sidebar]  │  Projects View                    │
│  ─────────  │  ───────────────────────────────  │
│  Home       │  [Project Card] [Project Card]    │
│  Sessions   │  ───────────────────────────────  │
│  Memories   │  | Project A          |           │
│  Projects ← │  | 5 sessions        |           │
│  Settings   │  | 23 observations   |           │
│             │  └──────────────────┘           │
│             │  ┌────────────────────────────┐ │
│             │  │ Sessions in "Project A"    │ │
│             │  │ ├─ Session 1 (12 obs)     │ │
│             │  │ └─ Session 2 (3 obs)      │ │
│             │  │ [Expand to view obs]      │ │
│             │  └────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Data Flow

```
useSessions(filter) 
    → getSessions() 
    → /sessions/recent 
    → Group by project 
    → Aggregate observation counts 
    → ProjectStats[]
```

## i18n Keys Needed

```json
{
  "tabs": {
    "projects": "Projects"
  },
  "projects": {
    "title": "Projects",
    "searchPlaceholder": "Search projects...",
    "sessions": "sessions",
    "observations": "observations",
    "empty": {
      "title": "No projects yet",
      "description": "Projects will appear here when you have sessions"
    }
  }
}
```

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Project grouping logic performance with large session counts | Low | Memoize derived project list, consider pagination |
| Duplicate project names from different sources | Medium | Use exact string match (current behavior) |

## Rollback Plan

1. Remove "projects" from `TabType` union
2. Delete `src/pages/Projects.tsx`
3. Remove `projects` nav item from NavigationSidebar
4. Remove `useProjects` hook
5. Remove i18n keys from all locale files

## Dependencies

- None (uses existing `useSessions`, `getSessions`)

## Success Criteria

- [ ] Projects tab visible and navigable from sidebar
- [ ] All unique projects from sessions displayed with correct counts
- [ ] Clicking project shows session list
- [ ] Sessions show observation count
- [ ] Can expand session to view observations
- [ ] All three languages (en/es/pt) display correctly
- [ ] TabType "projects" accepted by NavigationSidebar