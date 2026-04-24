# Design: projects-view

## Technical Approach

Derive a project-aggregated view from existing `useSessions` data. The `useProjects` hook will group sessions by their `project` field, computing per-project session counts and total observation counts. The UI follows the existing two-panel pattern (list + detail) used in other tabs.

## Architecture Decisions

### Decision: Two-panel layout for ProjectsTab

**Choice**: Left panel shows project cards in a grid; right panel shows session list for selected project
**Alternatives considered**: Modal-based detail view, single-column list with inline expansion
**Rationale**: Matches the accordion pattern already used in SessionsTab. Project count is typically smaller than session count, so a grid works well.

### Decision: useProjects as a derived hook (not a new API call)

**Choice**: Group sessions in-memory using `useMemo` on top of `useSessions`
**Alternatives considered**: New service method in engramService, new API endpoint
**Rationale**: No backend changes required. Sessions already contain project and observationCount fields. Deriving in the hook keeps logic co-located and cache-friendly.

### Decision: Folder icon for projects nav item

**Choice**: SVG folder icon, placed 4th (before settings)
**Alternatives considered**: Grid/collection icon
**Rationale**: Projects conceptually map to folders. Consistent with sidebar icon style (stroke icons, h-5 w-5).

## Data Flow

```
useSessions() → getSessions() → API /sessions/recent → Session[]
    ↓
useMemo(groupByProject) → ProjectSummary[]
    ↓
ProjectsTab state → selectedProject → filteredSessions
```

**ProjectSummary type**:
```typescript
interface ProjectSummary {
  name: string;
  sessionCount: number;
  observationCount: number;
  sessions: Session[];
}
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/ProjectsTab.tsx` | Create | Two-panel projects view |
| `src/hooks/useEngram.ts` | Modify | Add `useProjects` hook |
| `src/types/engram.ts` | Modify | Add `"projects"` to `TabType` |
| `src/components/organisms/NavigationSidebar.tsx` | Modify | Add nav item for projects |
| `src/pages/Dashboard.tsx` | Modify | Render ProjectsTab when activeTab === "projects" |
| `src/locales/en.json` | Modify | Add i18n keys for en |
| `src/locales/es.json` | Modify | Add i18n keys for es |
| `src/locales/pt.json` | Modify | Add i18n keys for pt |

## Interface: useProjects Hook

```typescript
export interface ProjectSummary {
  name: string;
  sessionCount: number;
  observationCount: number;
  sessions: Session[];
}

export const useProjects = () => {
  const { data, isLoading } = useSessions();
  return useMemo(() => {
    const sessions = data?.sessions ?? [];
    const map = new Map<string, Session[]>();
    for (const session of sessions) {
      const list = map.get(session.project) ?? [];
      list.push(session);
      map.set(session.project, list);
    }
    const projects: ProjectSummary[] = Array.from(map.entries())
      .map(([name, sessions]) => ({
        name,
        sessionCount: sessions.length,
        observationCount: sessions.reduce((sum, s) => sum + s.observationCount, 0),
        sessions,
      }))
      .sort((a, b) => b.sessionCount - a.sessionCount);
    return { projects, isLoading };
  }, [data, isLoading]);
};
```

## Interface: ProjectsTab Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Projects View                                │
│  ─────────  │  ─────────────────────────────────────────   │
│  Home       │  [Project Card] [Project Card]                │
│  Sessions   │  ┌──────────────────┐ ┌──────────────────┐     │
│  Memories   │  │ Project A       │ │ Project B        │     │
│  Projects ← │  │ 5 sessions      │ │ 3 sessions       │     │
│  Settings   │  │ 23 observations │ │ 12 observations  │     │
│             │  └──────────────────┘ └──────────────────┘     │
│             │                                               │
│             │  ┌─────────────────────────────────────────┐  │
│             │  │ Sessions in "Project A"                  │  │
│             │  │ ├─ Session 1 (12 obs)                  │  │
│             │  │ └─ Session 2 (3 obs)                   │  │
│             │  └─────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## i18n Keys

```json
{
  "tabs": { "projects": "Projects" },
  "projects": {
    "title": "Projects",
    "sessions": "sessions",
    "observations": "observations",
    "empty": {
      "title": "No projects yet",
      "description": "Projects will appear here when you have sessions"
    }
  }
}
```

## Open Questions

- [ ] Should search/filter be added to the project list?
- [ ] Should the right panel default to the most-recently-active project?

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | `useProjects` grouping logic | Test with mock sessions array |
| Integration | ProjectsTab renders correctly | Render with react-testing-library |
| E2E | Navigation to projects tab | Playwright click flow |

## Rollback

1. Remove `"projects"` from `TabType`
2. Delete `src/pages/ProjectsTab.tsx`
3. Remove `useProjects` from `useEngram.ts`
4. Remove nav item from `NavigationSidebar`
5. Remove `activeTab === "projects"` branch from `Dashboard`
6. Remove i18n keys from locale files
