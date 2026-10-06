import React from "react";

type CheckedDevWarningsProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: unknown;
  onCheckedChange?: unknown;
  disabled?: boolean;
  readOnly?: boolean;
};

/**
 * Dev-only warnings for misuse of the controlled/uncontrolled API of a checkbox-based component (Switch, ThemeToggle),
 * mirroring the ones React gives for native inputs. `componentName` is used in the messages.
 * Each warning is logged at most once per instance. Stripped from production builds by the consumer's bundler.
 */
export const useCheckedDevWarnings = (componentName: string, props: CheckedDevWarningsProps) => {
  const { checked, defaultChecked, onChange, onCheckedChange, disabled, readOnly } = props;
  const isControlled = checked !== undefined;

  const initialIsControlled = React.useRef(isControlled);
  const warned = React.useRef(new Set<string>());

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const warnOnce = (key: string, message: string) => {
      if (warned.current.has(key)) return;
      warned.current.add(key);
      console.warn(message);
    };

    if (isControlled !== initialIsControlled.current) {
      const [from, to] = initialIsControlled.current ? ["controlled", "uncontrolled"] : ["uncontrolled", "controlled"];
      warnOnce(
        "mode-switch",
        `${componentName} is changing from ${from} to ${to}. This is likely caused by \`checked\` changing between undefined and a boolean (e.g. \`checked={data?.flag}\` while data loads). ` +
          `Decide between a controlled or uncontrolled ${componentName} for the lifetime of the component.`
      );
    }

    if (isControlled && defaultChecked !== undefined) {
      warnOnce(
        "both-props",
        `${componentName} received both \`checked\` and \`defaultChecked\`. \`defaultChecked\` is ignored when \`checked\` is provided. ` +
          `Use \`checked\` with \`onCheckedChange\` for a controlled ${componentName}, or \`defaultChecked\` for an uncontrolled ${componentName}.`
      );
    }

    if (isControlled && !onChange && !onCheckedChange && !disabled && !readOnly) {
      warnOnce(
        "read-only",
        `${componentName} received \`checked\` without \`onCheckedChange\` or \`onChange\`, so it can never be toggled. ` +
          `Use \`defaultChecked\` for an uncontrolled ${componentName}, add \`onCheckedChange\`, or set \`disabled\` or \`readOnly\` if this is intended.`
      );
    }
  }, [componentName, isControlled, defaultChecked, onChange, onCheckedChange, disabled, readOnly]);
};
