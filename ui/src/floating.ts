import { cloneElement, isValidElement, type ReactElement, type Ref } from "react";

/** The ref a trigger element already carries (React 18 puts it on the element, React 19 in props). */
export const elementRef = (el: ReactElement): Ref<unknown> | undefined =>
  (el.props as { ref?: Ref<unknown> }).ref ?? (el as unknown as { ref?: Ref<unknown> }).ref;

/** Clones a trigger element with floating-ui reference props merged over its own. */
export function withProps(el: ReactElement, props: Record<string, unknown>) {
  if (!isValidElement(el)) throw new Error("Stylhero: the trigger must be a single element, e.g. <Button>.");
  return cloneElement(el, props);
}
