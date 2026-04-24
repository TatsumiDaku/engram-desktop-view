# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Writing unit tests with Vitest | vitest | `.agents/skills/vitest/` |
| WCAG audits, a11y improvements | accessibility | `.claude/skills/accessibility/` |
| Web components, pages, React UIs | frontend-design | `.claude/skills/frontend-design/` |
| Express/Fastify servers, APIs | nodejs-backend-patterns | `.claude/skills/nodejs-backend-patterns/` |
| Node.js decisions, async, security | nodejs-best-practices | `.claude/skills/nodejs-best-practices/` |
| E2E tests, Playwright config | playwright-best-practices | `.claude/skills/playwright-best-practices/` |
| SEO optimization, meta tags | seo | `.claude/skills/seo/` |
| Tailwind styling, layout | tailwind-css-patterns | `.claude/skills/tailwind-css-patterns/` |
| Tauri desktop apps | tauri-v2 | `.claude/skills/tauri-v2/` |
| Complex TypeScript types | typescript-advanced-types | `.claude/skills/typescript-advanced-types/` |
| React composition patterns | vercel-composition-patterns | `.claude/skills/vercel-composition-patterns/` |
| React/Next.js optimization | vercel-react-best-practices | `.claude/skills/vercel-react-best-practices/` |
| Vite config, plugins, SSR | vite | `.claude/skills/vite/` |

## SDD Skills

| Trigger | Skill | Location |
|---------|-------|----------|
| `sdd init` | sdd-init | `~/.config/opencode/skills/sdd-init/` |
| Explore ideas | sdd-explore | `~/.config/opencode/skills/sdd-explore/` |
| Create change proposals | sdd-propose | `~/.config/opencode/skills/sdd-propose/` |
| Write specifications | sdd-spec | `~/.config/opencode/skills/sdd-spec/` |
| Technical design | sdd-design | `~/.config/opencode/skills/sdd-design/` |
| Break down changes | sdd-tasks | `~/.config/opencode/skills/sdd-tasks/` |
| Implement changes | sdd-apply | `~/.config/opencode/skills/sdd-apply/` |
| Verify implementation | sdd-verify | `~/.config/opencode/skills/sdd-verify/` |
| Archive completed changes | sdd-archive | `~/.config/opencode/skills/sdd-archive/` |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### vitest
- Use `vitest` for unit tests — `npm test` runs `vitest run`
- Mock with `vi.mock()`, `vi.fn()`, `vi.spyOn()`
- Use `@testing-library/react` for component tests — prefer `render()` and `screen` queries over direct DOM
- Coverage: `npm run test:coverage` — v8 provider, reporters: text, html, lcov
- Test files: `tests/**/*.test.{ts,tsx}` — jsdom environment

### playwright-best-practices
- Use Playwright for E2E — config in `playwright.config.ts`
- Run tests: `npx playwright test`
- Page objects via POM pattern — keep in `tests/e2e/`
- Use `locator.page()` for page-level actions
- Debug with `page.screenshot()` and `console.log`
- Mock API via `context.route()` — test third-party boundaries

### vercel-react-best-practices
- Use `useTransition` for loading states — provides `isPending`
- Cache expensive computations with `useMemo()`
- Avoid inline components in JSX — extract to prevent remount
- Use `useDeferredValue` for expensive search/filter inputs
- Derive state from props instead of storing in `useEffect`
- Parallel fetches with `Promise.all()` — don't sequentialize independent calls

### tailwind-css-patterns
- Use `@tailwindcss/` prefix for custom theme values
- Dark mode via `class` strategy — `.dark` class on `<html>`
- Responsive utilities: `sm:`, `md:`, `lg:`, `xl:` prefixes
- Use `clsx` for conditional class merging
- Custom colors/spacing in `tailwind.config.js` under `theme.extend`

### tauri-v2
- Rust commands via `#[tauri::command]` — invoke with `window.invoke()`
- Permissions in `src-tauri/capabilities/` — not `allowlist`
- Events via `window.emit()` and `window.listen()`
- Channels for streaming — use for high-frequency IPC

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| Agents file | `CLAUDE.md` | Project-level conventions, skills index |
| TypeScript strict | `tsconfig.json` | Strict mode enabled |
| Path aliases | `vite.config.ts` | `@/*`, `@atoms/*`, `@molecules/*`, `@organisms/*`, `@hooks/*`, `@services/*`, `@pages/*`, `@config/*`, `@stores/*`, `@constants/*` |
| Package manager | `package.json` | pnpm |

## Last Updated

2026-04-22