import type { HTMLAttributes, OlHTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";
import { CheckIcon } from "../icons";

export type Step = { label: ReactNode; description?: ReactNode; /** Shows the step as failed. */ error?: boolean };

export type StepperProps = OlHTMLAttributes<HTMLOListElement> & {
  steps: Step[];
  /** Index of the current step, starting at 0. Steps before it show as done. */
  active: number;
  orientation?: "horizontal" | "vertical";
  /** Makes each step a button, so people can jump back (MUI's non-linear stepper). */
  onStepClick?: (index: number) => void;
};

/** Progress through a multi-step flow (sign-up, checkout). */
export function Stepper({ steps, active, orientation = "horizontal", onStepClick, className, ...props }: StepperProps) {
  return (
    <ol className={cn("sh-stepper", `sh-stepper--${orientation}`, className)} {...props}>
      {steps.map((s, i) => {
        const state = s.error ? "error" : i < active ? "done" : i === active ? "current" : "todo";
        const body = (
          <>
            <span className="sh-stepper__dot">{state === "done" ? <CheckIcon /> : state === "error" ? "!" : i + 1}</span>
            <span className="sh-stepper__text">
              <span className="sh-stepper__label">{s.label}</span>
              {s.description && <span className="sh-stepper__desc">{s.description}</span>}
            </span>
          </>
        );
        return (
          <li key={i} className={`sh-stepper__step sh-stepper__step--${state}`} aria-current={i === active ? "step" : undefined}>
            {onStepClick ? (
              <button type="button" className="sh-stepper__button" onClick={() => onStepClick(i)}>{body}</button>
            ) : body}
          </li>
        );
      })}
    </ol>
  );
}

export type MobileStepperProps = HTMLAttributes<HTMLDivElement> & {
  /** Number of steps. */
  steps: number;
  active: number;
  /** "dots" for a few steps, "text" ("2 / 5"), or "progress" for a bar. */
  variant?: "dots" | "text" | "progress";
  /** Usually a Back button. */
  back?: ReactNode;
  /** Usually a Next button. */
  next?: ReactNode;
};

/** Compact stepper for phones and carousels: Back · dots · Next. */
export function MobileStepper({ steps, active, variant = "dots", back, next, className, ...props }: MobileStepperProps) {
  return (
    <div className={cn("sh-mobile-stepper", className)} {...props}>
      {back ?? <span />}
      {variant === "dots" ? (
        <span className="sh-mobile-stepper__dots" role="img" aria-label={`Step ${active + 1} of ${steps}`}>
          {Array.from({ length: steps }, (_, i) => <span key={i} className={cn("sh-mobile-stepper__dot", i === active && "sh-mobile-stepper__dot--on")} />)}
        </span>
      ) : variant === "text" ? (
        <span className="sh-mobile-stepper__text">{active + 1} / {steps}</span>
      ) : (
        <span className="sh-progress__track sh-mobile-stepper__bar" role="progressbar" aria-valuemin={1} aria-valuemax={steps} aria-valuenow={active + 1}>
          <span className="sh-progress__bar" style={{ display: "block", width: `${((active + 1) / steps) * 100}%`, background: "var(--primary)" }} />
        </span>
      )}
      {next ?? <span />}
    </div>
  );
}
