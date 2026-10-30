# CountBadge and AvatarGroup

- **CountBadge**: a number or dot on the corner of another element (MUI Badge). `max` caps the number ("99+"). Zero hides it unless you pass `showZero`. Tones: danger (default), primary, accent, success. Pass `label` ("4 unread") for screen readers.
- **AvatarGroup**: overlapping avatars, with "+N" past `max`.
- **Avatar** also takes `shape="rounded"`, for businesses and logos.

```tsx
<CountBadge count={4} label="4 unread"><IconButton label="Notifications"><Bell /></IconButton></CountBadge>
<CountBadge dot tone="success"><Avatar name="Luis Peña" /></CountBadge>
<AvatarGroup max={4}>{team.map((p) => <Avatar key={p.id} name={p.name} size="sm" />)}</AvatarGroup>
```

**Badge** (the small label) is unchanged.
