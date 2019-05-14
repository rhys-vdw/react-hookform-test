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
  index<I extends keyof T & number>(index: number): FieldProps<T, I>;
  form<K extends keyof T>(property: K): FormHelper<T[K]>;
}

export function form<T>(
  state: Readonly<T>,
  onChange: (value: Readonly<T>) => void
): FormHelper<T> {
  const helper: FormHelper<T> = {
    value: state,
    setFields(fields) {
      onChange({ ...state, ...fields });
    },

    input(property) {
      return {
        name: property.toString(),
        value: state[property],
        onChange: event => {
          onChange({ ...state, [property]: event.currentTarget.value });
        }
      };
    },

    field(property) {
      return {
        value: state[property],
        onChange: value => {
          onChange({ ...state, [property]: value });
        }
      };
    },

    index(index) {
      const array = state as any;
      return {
        value: array[index],
        onChange: value => {
          const nextState = [...array];
          nextState[index] = value;
          onChange(nextState as any);
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
