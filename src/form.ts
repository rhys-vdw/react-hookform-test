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

export interface FieldProps<V> {
  name?: string;
  value: V;
  onChange: (value: Readonly<V>) => void;
}

export interface ArrayProps<V> {
  name?: string;
  value: readonly Readonly<V>[];
  onChange: (value: readonly Readonly<V>[]) => void;
}

interface FormHelper<T> {
  fields(): FieldProps<T>;
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

export const propsArray = <V>({ value, onChange, name }: ArrayProps<V>) =>
  array(value, onChange, name);

export const array = <V>(
  state: readonly Readonly<V>[],
  onChange: (nextState: readonly Readonly<V>[]) => void,
  name?: string
): ArrayHelper<V> => ({
  index(index) {
    return {
      name: indexName(name, index),
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

export const propsForm = <T>({ value, onChange, name }: FieldProps<T>) =>
  form(value, onChange, name);

export function form<T>(
  state: Readonly<T>,
  onChange: (value: Readonly<T>) => void,
  name?: string
): FormHelper<T> {
  return {
    fields() {
      return {
        name,
        value: state,
        onChange(nextState: Partial<T>) {
          onChange({ ...state, ...nextState });
        }
      };
    },

    input(property) {
      return {
        name: fieldName(name, property as string),
        value: state[property] as any,
        onChange: event => {
          onChange({ ...state, [property]: event.currentTarget.value });
        }
      };
    },

    checkbox(property) {
      return {
        name: fieldName(name, property as string),
        checked: state[property] as any,
        onChange: event => {
          onChange({ ...state, [property]: event.currentTarget.checked });
        }
      };
    },

    field(property) {
      return {
        name: fieldName(name, property as string),
        value: state[property],
        onChange: value => {
          onChange({ ...state, [property]: value });
        }
      };
    }
  };
}

function fieldName(obj: string | undefined, field: string | number): string {
  return obj === undefined ? field.toString() : `${obj}.${field}`;
}
function indexName(array: string | undefined, index: number): string {
  return array === undefined ? `[${index}]` : `${array}[${index}]`;
}
