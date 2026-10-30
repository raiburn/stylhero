# Toast

A short message that confirms an action, appears bottom-right and disappears after 4 seconds.

React:
```tsx
// app/layout.tsx
<ToastProvider>{children}</ToastProvider>

// any client component
const toast = useToast();
toast({ message: "Stamp added", tone: "success" });
toast("Changes saved"); // info
```

- **Tones:** `info`, `success`, `danger`. Set `duration: 0` to keep an error open until dismissed.
- One short sentence; never put the only copy of important information in a toast.
- Inverted colors (ink background) so it stands out over any page. At most 4 stack at once.
