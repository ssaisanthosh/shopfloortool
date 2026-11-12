# Agent Guide: Reusing Me to Create New Tools / Components

This file captures the reusable workflow so you can generate new tools or components quickly in future sessions.

---

## Purpose
A step‑by‑step checklist for creating a brand‑new tool (component, hook, or utility) inside the **shopfloortool** project using the Composio MCP tools.

---

## Prerequisites
- A working session ID. From earlier searches the session was **`desk`**. Pass `session: { id: "desk", generate_id: true }` to every meta call unless you start a fresh workflow.
- Any external toolkit you plan to use must have an **active connection**. If a search reports `"has_active_connection": false`, call `COMPOSIO_MANAGE_CONNECTIONS` first (see §2 below).

---

## Step‑by‑Step Workflow

### 1. Discover / Search for the right toolkit
Use `composio_search_tools` with:
- **`use_case`**: a short English description of the new tool (e.g., *"Create a Hash Generator tool that supports MD5, SHA‑256, …"*).
- **`known_fields`** (optional): key values such as `slug`, `name`, `category`, `icon`, `algorithm`, etc.
- **`session.id`**: pass the session id (e.g., `"desk"`).

**Example request:**
```json
{
  "queries": { "use_case": "...", "known_fields": "..." },
  "session": { "id": "desk", "generate_id": true }
}
```

The response returns primary tool slugs and related toolkit connections.

### 2. Ensure external toolkits are connected
If the search shows a toolkit has no active connection, initiate it:
```js
composio_manage_connections({ toolkits: ["github", "jira"], reinitiate_all: false })
```
Then wait until the connection reaches `ACTIVE`/`FAILED`:
```js
composio_wait_for_connections({ mode: "any", toolkits: ["github", "jira"] })
```

> Do **not** run a tool before the connection status is terminal.

### 3. Create the component file
Follow the naming convention `components/tools/<slug>.tsx` (e.g., `hash-generator.tsx`).  
Start from the base `toolTemplate.tsx` and adapt fields you need (props, state, buttons, etc.).

### 4. Register the tool in `tools-data.ts`
Edit `components/tools/tools-data.ts`:
- Append a new object to the `export const tools: Tool[] = [...]` array.
- Fields required: `id`, `slug`, `name`, `description`, `category`, `icon`, `usedCount`, `new?: boolean`, `order?: number`.
- Note: slug should end with `-tool` (e.g., `hash-generator-tool`).

Example addition:
```typescript
{
  id: "9",
  slug: "hash-generator-tool",
  name: "Hash Generator",
  description: "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files",
  category: "Development",
  icon: "Hash",
  usedCount: 0,
  new: true,
},
```

### 5. Wire up the lazy dynamic import in the page template
In `app/tools/[slug]/page.tsx` (and `[category]` page if needed), add to the `toolComponents` record:
```ts
"${slug}": dynamic(() => import(`@/components/tools/${slug}`).then((mod) => mod.{ToLower(toolName)})
```

**Exact example for hash-generator-tool:**
```ts
"hash-generator-tool": dynamic(() =>
  import("@/components/tools/hash-generator-tool").then((mod) => mod.HashGenerator)
),
```

Update the filter logic in `ToolsPage` / `[category]` page to include the new tool when searching/categorizing.

### 6. Display the tool detail
In the main grid (`app/pages/ToolsPage.tsx` or similar), render each filtered tool via:
```tsx
{filteredTools.map((tool) => (
  <ToolCard key={tool.id} tool={tool} />
))}
```

### 7. Run checks & build
```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run format      # prettier --write "**/*.{ts,tsx}"
npm run build       # next build
```

---

## File Layout Reference

| Location | Purpose |
|---|---|
| `components/tools/<slug>.tsx` | Source component (e.g., `hash-generator.tsx`) |
| `components/tools/tools-data.ts` | Central registry of tools (`export const tools: Tool[]`) |
| `app/tools/[slug]/page.tsx` | Dynamic page per slug (lazy imports via `dynamic`) |
| `app/tools/[category]/page.tsx` | Category filter page |
| `app/pages/ToolsPage.tsx` (or equivalent) | Main grid + search bar |

---

## Tips
- Start `usedCount` at `0`; bump it after real usage.
- Pick icons from `lucide-react` (e.g., `Hash`, `GlobeBanIcon`).
- Categories currently exist: **All**, **Development**, **Design**, **Productivity**, **Utilities**, **Security**.
- Keep descriptions concise but informative; mention browser‑based nature when applicable.

---

*Created: 2026‑11‑13*  
*Workspace: `f:\\ugsca\\development\\shopfloortool`*
