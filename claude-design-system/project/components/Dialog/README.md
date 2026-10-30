# Dialog

A modal window for confirmations and short focused tasks, built on the native `<dialog>`.

React:
```tsx
const [open, setOpen] = useState(false);
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete this card?"
  footer={<>
    <Button variant="secondary" onClick={() => setOpen(false)}>Keep card</Button>
    <Button variant="danger" onClick={deleteCard}>Delete card</Button>
  </>}
>
  María López will lose her 7 stamps. This can't be undone.
</Dialog>
```

- The browser traps focus, closes on Esc and dims the page; clicking the backdrop also closes it.
- Title asks or states the decision. Buttons name both outcomes; the main action goes last (right).
- Keep it short. Long forms belong on their own page.
