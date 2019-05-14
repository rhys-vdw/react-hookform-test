import { ChangeEvent, useState } from "react";
import { PickByValue } from "utility-types";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export function useForm<T extends {}>(
  initialValue: T,
  onChange?: (value: T) => void
) {
  const [value, setValue] = useState(initialValue);

  function update(fields: Partial<Readonly<T>>) {
    const nextValue = { ...value, ...fields };
    setValue(nextValue);
    if (onChange !== undefined) {
      onChange(nextValue);
    }
  }

  function input<K extends keyof PickByValue<T, string | number>>(property: K) {
    return {
      value: value[property],
      onChange: (event: ChangeEvent<InputElement>) => {
        update({ [property]: event.currentTarget.value } as any);
      }
    };
  }

  function field<K extends keyof T>(property: K) {
    return {
      value: value[property],
      onChange: update
    };
  }

  return { value, input, field };
}
