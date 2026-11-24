<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Storefront architecture
- Preserve the imported TanStack route files and commerce DTO contract; shared visual primitives and CSS tokens unify the existing experience rather than replacing flows.
- Preview runs explicitly in prototype mode without a production origin or transaction services; production verification remains blocked until a dedicated service is available.
- Store original media bytes through asset pointers and load Three.js near visibility; original models stay untouched, and a lightweight derived copy may be shown first, then swapped for the original.
- Keep framework versions from the target template while merging missing source dependencies, to preserve platform compatibility.
- Entry motion owns one bounded resource wait and cancellable phase clock; framed reveals own a separate inner layer so hover, carousel and 3D transforms remain untouched.
- Homepage-specific header and hero styles remain scoped; shared shopping navigation and commerce pages retain their existing controls.
