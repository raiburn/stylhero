# MobileStepper

Compact stepper for phones, onboarding and carousels.

```tsx
<MobileStepper steps={4} active={step} variant="dots" back={<Button variant="ghost" size="sm">Back</Button>} next={<Button variant="ghost" size="sm">Next</Button>} />
```

Variants:
- `dots`
- `text` (shows "2 / 4")
- `progress` (a bar)

The full **Stepper** now also takes:
- `onStepClick`, so people can jump back to a step
- `error: true` on a step
