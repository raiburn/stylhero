# Stepper

Shows progress through a flow (sign-up, onboarding, order status). Done steps are filled primary with a check, the current step is outlined primary, later steps are muted.

React: `<Stepper steps={[{ label: "Account" }, { label: "Business" }, { label: "Cards" }]} active={1} />`; `orientation="vertical"` for timelines with descriptions.

On phones the horizontal version shows only the current step's label.
