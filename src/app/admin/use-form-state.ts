"use client";

import { useCallback, useState } from "react";

/** Minimal controlled-form helper: values + bind(name) for inputs. */
export function useFormState<T extends Record<string, string | number>>(initial: T) {
  const [values, setValues] = useState<T>(initial);

  const bind = useCallback(
    <K extends keyof T>(key: K) => ({
      value: values[key],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      ) => {
        const v = e.target.value;
        setValues((prev) =>
          ({ ...prev, [key]: typeof prev[key] === "number" ? Number(v) : v }) as T,
        );
      },
    }),
    [values],
  );

  return { values, bind };
}
