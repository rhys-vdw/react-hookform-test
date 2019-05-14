import { ChangeEvent } from "react";
import { PickByValue } from "utility-types";

type ValueInputElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

interface ValueInputProps {
  name: string;
  value: string | number;
  onChange: (event: ChangeEvent<ValueInputElement>) => void;
}

interface CheckboxInputProps {
  name: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface FieldProps<V> {
  value: Readonly<V>;
  onChange: (value: Readonly<V>) => void;
}

interface FormHelper<T> {
  fields(): { value: Readonly<T>; onChange: (value: Readonly<T>) => void };
  input<K extends keyof PickByValue<T, string | number>>(
    property: K
  ): ValueInputProps;
  checkbox<K extends keyof PickByValue<T, boolean>>(
    property: K
  ): CheckboxInputProps;
  field<K extends keyof T>(property: K): FieldProps<T[K]>;
}

interface ArrayHelper<V> {
  index(index: number): FieldProps<V>;
  push(value: V): void;
  removeAt(index: number): void;
}

export const array = <V>(
  state: readonly Readonly<V>[],
  onChange: (nextState: readonly Readonly<V>[]) => void
): ArrayHelper<V> => ({
  index(index) {
    return {
      value: state[index],
      onChange: value => {
        const nextState = [...state];
        nextState[index] = value;
        onChange(nextState);
      }
    };
  },

  push(value) {
    onChange([...state, value]);
  },

  removeAt(index) {
    const nextState = [...state];
    nextState.splice(index, 1);
    onChange(nextState);
  }
});

export const propsForm = <T>({ value, onChange }: FieldProps<T>) =>
  form(value, onChange);

export function form<T>(
  state: Readonly<T>,
  onChange: (value: Readonly<T>) => void
): FormHelper<T> {
  return {
    fields() {
      return {
        value: state,
        onChange(nextState: Partial<T>) {
          onChange({ ...state, ...nextState });
        }
      };
    },

    input(property) {
      return {
        name: property.toString(),
        value: state[property] as any,
        onChange: event => {
          onChange({ ...state, [property]: event.currentTarget.value });
        }
      };
    },

    checkbox(property) {
      return {
        name: property.toString(),
        checked: state[property] as any,
        onChange: event => {
          onChange({ ...state, [property]: event.currentTarget.checked });
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
    }
  };
}
