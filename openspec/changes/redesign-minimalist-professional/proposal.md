# Proposal: Redesign Minimalist Professional

## Intent

Complete UI/UX redesign to replace the dated cyberpunk aesthetic (purple glow effects, heavy shadows, busy hero section) with a clean, professional look using neutral grays and a single blue accent. Target: enterprise users who need focus and clarity, not flash.

## Scope

### In Scope
- Replace purple `hsl(263,70%,58%)` theme with neutral gray + blue professional palette
- Abstract inline HSL values into CSS variables in `globals.css`
- Reduce 8 horizontal tabs to 5 core tabs (Home, Sessions, Memories, Search, Settings)
- Convert horizontal TabBar to vertical sidebar navigation
- Simplify hero section (remove glow, nested borders, banner image)
- Remove floating LogPanel or dock as collapsible drawer
- Update `tailwind.config.js` with new color tokens

### Out of Scope
- Architecture changes (hooks, services, stores, IPC)
- Backend integration changes
- New functionality or features
- Test infrastructure modifications

## Capabilities

> This is a pure visual redesign — no spec-level behavior changes. Existing capabilities remain intact.

### New Capabilities
None

### Modified Capabilities
None — UI-only refactor preserving all existing behavior

## Approach

1. **CSS Variables First**: Define new `--primary`, `--background`, `--border` tokens in `globals.css` using professional blue `220 65% 50%` (#2563eb) and neutral grays
2. **Component-by-Component**: Migrate components in order of dependency:
   - `globals.css` theme tokens
   - `TabBar.tsx` (navigation restructure)
   - `HomeTab.tsx` (hero simplification)
   - `SessionsTab.tsx` (component refactor)
   - `LogPanel.tsx` (remove/dock)
3. **Grep for inline HSL**: Find all `hsl(263,...)` occurrences and replace with CSS variable references

## Proposed Color Palette

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--primary` | `220 65% 50%` (#2563eb) | `220 65% 50%` | Actions, links, accent |
| `--background` | `220 10% 98%` (#fafafa) | `220 20% 6%` (#0d1015) | Page background |
| `--foreground` | `220 10% 10%` | `220 10% 95%` | Primary text |
| `--border` | `220 10% 88%` | `220 15% 18%` | Cards, inputs |
| `--muted` | `220 10% 96%` | `220 15% 12%` | Secondary backgrounds |
| `--card` | `0 0% 100%` | `220 15% 10%` | Card surfaces |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/globals.css` | Modified | New CSS variable theme tokens |
| `tailwind.config.js` | Modified | Color palette update |
| `src/components/molecules/TabBar.tsx` | Modified | 8 tabs → 5, sidebar layout |
| `src/pages/HomeTab.tsx` | Modified | Simplified hero, no glow |
| `src/pages/SessionsTab.tsx` | Modified | Component refactor to match |
| `src/components/organisms/LogPanel.tsx` | Removed/Docked | Floating panel → collapsed |
| 20+ files | Modified | Inline `hsl(263,...)` → CSS vars |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Inline HSL scattered across 20+ files | High | Grep-based search-and-replace, staged commits |
| State persistence conflicts (LogPanel visibility) | Medium | Preserve LogPanel state in uiStore, add toggle to Settings |
| Breaking dark mode toggle behavior | Low | Test both modes after each component change |

## Rollback Plan

```bash
git revert --no-commit HEAD~3
git commit -m "Revert: undo minimalist redesign"
```
Target: `v1.2.3` tag (pre-redesign stable state). Full revert possible in single command.

## Dependencies

None — pure frontend CSS/UI changes, no external dependencies

## Success Criteria

- [ ] All purple glow effects removed (`shadow-[0_0_...]` gone)
- [ ] No inline `hsl(263,...)` values remain in source
- [ ] TabBar shows only 5 tabs: Home, Sessions, Memories, Search, Settings
- [ ] Hero section renders without glow border or banner image
- [ ] LogPanel docked or removed from floating position
- [ ] Dark/light mode toggle works correctly
- [ ] `npm test` passes with no regressions