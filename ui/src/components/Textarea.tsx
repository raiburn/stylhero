import { forwardRef, useLayoutEffect, useRef, type TextareaHTMLAttributes } from "react";
import { useMergeRefs } from "@floating-ui/react";
import { cn } from "../cn";
import { Field, useField, type FieldProps } from "./Field";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps & {
  /** Grow with the text instead of scrolling (MUI's TextareaAutosize). Cap it with `maxRows`. */
  autoResize?: boolean;
  maxRows?: number;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className, autoResize, maxRows, onInput, ...props }, ref) => {
    const { fieldId, message, controlProps } = useField(id, { hint, error });
    const own = useRef<HTMLTextAreaElement>(null);
    const merged = useMergeRefs([own, ref]);

    const fit = () => {
      const el = own.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      const line = parseFloat(getComputedStyle(el).lineHeight) || 24;
      const max = maxRows ? line * maxRows + 18 : Infinity;
      el.style.height = `${Math.min(el.scrollHeight + 2, max)}px`;
      el.style.overflowY = el.scrollHeight + 2 > max ? "auto" : "hidden";
    };
    useLayoutEffect(fit, [autoResize, maxRows, props.value]);

    return (
      <Field fieldId={fieldId} label={label} message={message} error={error} className={className}>
        <textarea
          ref={merged}
          className={cn("sh-input sh-textarea", autoResize && "sh-textarea--auto")}
          rows={autoResize ? 1 : undefined}
          onInput={(e) => { fit(); onInput?.(e); }}
          {...controlProps}
          {...props}
        />
      </Field>
    );
  }
);
Textarea.displayName = "Textarea";
