---
"@stylhero/ui": patch
---

Rating: accepts standard HTML attributes (`id`, `style`, `data-*`, `aria-*`, event handlers…) and passes them to its root element. Before, they were rejected by TypeScript and dropped at runtime.
