import { ChangeEvent, useState } from "react";
import { PickByValue } from "utility-types";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface InputProps<I extends InputElement, T, K extends keyof T> {
  name: string;
  value: T[K];
  onChange: (event: ChangeEvent<I>) => void;
}

interface FieldProps<T, K extends keyof T> {
  value: Readonly<T[K]>;
  onChange: (value: Readonly<T[K]>) => void;
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
  form<K extends keyof T>(property: K): FormHelper<T[K]>;
}

export function form<T>(
  value: Readonly<T>,
  onChange: (value: Readonly<T>) => void
): FormHelper<T> {
  const helper: FormHelper<T> = {
    value,
    setFields(fields) {
      onChange({ ...value, ...fields });
    },

    input(property) {
      return {
        name: property.toString(),
        value: value[property],
        onChange: event => {
          onChange({ ...value, [property]: event.currentTarget.value });
        }
      };
    },

    field(property) {
      return {
        value: value[property],
        onChange: value => {
          onChange({ ...value, [property]: value } as any);
        }
      };
    },

    form(property) {
      const { value, onChange } = helper.field(property);
      return form(value, onChange);
    }
  };
  return helper;
}

export function useForm<T>(
  initialValue: T,
  onChange?: (value: T) => void
): FormHelper<T> {
  const [value, setValue] = useState(initialValue);
  return form(value, value => {
    setValue(value);
    if (onChange !== undefined) {
      onChange(value);
    }
  });
}
