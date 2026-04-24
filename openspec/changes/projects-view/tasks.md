# Tasks: projects-view

## Phase 1: Type & Hook Foundation

- [x] 1.1 Add `"projects"` to `TabType` union in `src/types/engram.ts`
- [x] 1.2 Create `useProjects` hook in `src/hooks/useEngram.ts` — derive from useSessions, group by project field, compute sessionCount and observationCount per project using useMemo

## Phase 2: Navigation Update

- [x] 2.1 Add "projects" nav item to `src/components/organisms/NavigationSidebar.tsx` — folder SVG icon, labelKey "tabs.projects", placed before settings
- [x] 2.2 Update `src/pages/Dashboard.tsx` to render `ProjectsTab` when `activeTab === "projects"`

## Phase 3: ProjectsTab Component

- [x] 3.1 Create `src/pages/ProjectsTab.tsx` — two-panel layout: project list (left) + project detail (right)
- [x] 3.2 Implement project cards showing name, session count, observation count
- [x] 3.3 Implement session list for selected project in right panel
- [x] 3.4 Add expand/collapse to show observations per session when expanded

## Phase 4: i18n Updates

- [x] 4.1 Add `"tabs.projects"` and `"projects.*"` keys to `src/locales/es/translation.json`
- [x] 4.2 Add `"tabs.projects"` and `"projects.*"` keys to `src/locales/en/translation.json`
- [x] 4.3 Add `"tabs.projects"` and `"projects.*"` keys to `src/locales/pt/translation.json`

## Phase 5: Project/Session Deletion Feature

- [x] 5.1 Add i18n keys for deletion (deleteProject, deleteConfirm, deleteMessage, deleteSessions, selectAll, deselectAll, deleteSelected, selected, noSessionsToDelete)
- [x] 5.2 Add session selection state (Set<string>) and delete error state to ProjectsTab
- [x] 5.3 Add checkbox to each session row with disabled state for non-empty sessions
- [x] 5.4 Add select all/deselect all buttons for empty sessions
- [x] 5.5 Add delete selected sessions button with confirmation dialog
- [x] 5.6 Add delete project button (only visible when all sessions have 0 observations)
- [x] 5.7 Clear selections when changing projects