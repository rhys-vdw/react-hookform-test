import { ChangeEvent, useState } from "react";
import { PickByValue } from "utility-types";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface InputProps<I extends InputElement, T, K extends keyof T> {
  name: string;
  value: T[K];
  onChange: (event: ChangeEvent<I>) => void;
}

interface FieldProps<T, K extends keyof T> {
  value: T[K];
  onChange: (value: T[K]) => void;
}

interface FormHelper<T extends {}> {
  readonly value: Readonly<T>;
  setFields(fields: Partial<Readonly<T>>): void;
  input<
    I extends InputElement,
    K extends keyof PickByValue<T, string | number>
  >(
    property: K
  ): InputProps<I, T, K>;
  field<K extends keyof T>(property: K): FieldProps<T, K>;
}

// function formState<T extends {}>(value: T, onChange: (value: T) => void) {}

export function useForm<T extends {}>(
  initialValue: T,
  onChange?: (value: T) => void
): FormHelper<T> {
  // const [parentValue, setParentValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);

  // if (initialValue !== parentValue) {
  //   setParentValue(initialValue);
  //   setValue(value);
  // }

  const handlers = {
    value,
    setFields(fields) {
      const nextValue = { ...value, ...fields };
      setValue(nextValue);
      if (onChange !== undefined) {
        onChange(nextValue);
      }
    },

    input(property) {
      return {
        name: property.toString(),
        value: value[property],
        onChange: event => {
          handlers.setFields({ [property]: event.currentTarget.value } as any);
        }
      };
    },

    field(property) {
      return {
        value: value[property],
        onChange: handlers.setFields
      };
    }
  } as FormHelper<T>;

  return handlers;
}
