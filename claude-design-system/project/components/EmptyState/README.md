# EmptyState

What a list or page shows when it has nothing in it yet, with the action that fills it.

React: `<EmptyState icon={<Users />} title="No customers yet" action={<Button>Register a card</Button>}>Customers show up here after their first visit.</EmptyState>` from `@stylhero/ui`.

- Title says what's missing; body says why it's useful or how it fills up; one primary action.
- For "no search results", drop the action and suggest changing the search instead.
