# Accordion

Collapsible sections built on `<details>`/`<summary>`, so they work without JavaScript and find-in-page opens them.

```html
<div class="sh-accordion">
  <details class="sh-accordion__item"><summary class="sh-accordion__summary"><span>Question</span><svg chevron-down/></summary>
    <div class="sh-accordion__content">Answer</div></details>
</div>
```

React: `<Accordion items={[{ id, title, content }]} defaultOpen={["a"]} single />`. `single` closes the others when one opens.

Good for FAQs and settings groups; don't hide anything people need on every visit.
