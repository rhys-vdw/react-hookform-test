import { ChangeEvent } from "react";
import { PickByValue } from "utility-types";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface InputProps<I extends InputElement, T, K extends keyof T> {
  name: string;
  value: T[K];
  onChange: (event: ChangeEvent<I>) => void;
}

interface CheckboxInputProps {
  name: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface FieldProps<T, K extends keyof T> {
  value: Readonly<T[K]>;
  onChange: (value: Readonly<T[K]>) => void;
}

interface FormHelper<T> {
  fields(): { value: Readonly<T>; onChange: (value: Readonly<T>) => void };
  input<
    I extends InputElement,
    K extends keyof PickByValue<T, string | number>
  >(
    property: K
  ): InputProps<I, T, K>;
  checkbox<K extends keyof PickByValue<T, boolean>>(
    property: K
  ): CheckboxInputProps;
  field<K extends keyof T>(property: K): FieldProps<T, K>;
}

interface ArrayHelper<T extends ReadonlyArray<any>> {
  index<I extends keyof T & number>(index: I): FieldProps<T, I>;
}

export const array = <T extends ReadonlyArray<any>>(
  state: T,
  onChange: (nextState: T) => void
): ArrayHelper<T> => ({
  index(index) {
    return {
      value: state[index],
      onChange: value => {
        const nextState = [...state];
        nextState[index] = value;
        onChange(nextState as any);
      }
    };
  }
});

export function propsForm<T>({
  value,
  onChange
}: {
  value: Readonly<T>;
  onChange: (value: Readonly<T>) => void;
}) {
  return form(value, onChange);
}

export function form<T>(
  state: Readonly<T>,
  onChange: (value: Readonly<T>) => void
): FormHelper<T> {
  const helper: FormHelper<T> = {
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
        value: state[property],
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
  return helper;
}
