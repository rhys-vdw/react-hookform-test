import React, { useState } from "react";
import { form, useForm } from "./form";

interface Person {
  readonly name: string;
  readonly age: number;
  readonly gender: "male" | "female" | "other";
  readonly children: readonly Person[];
}

const person: Person = {
  name: "Bob",
  age: 50,
  gender: "male",
  children: [
    {
      name: "Sue",
      age: 10,
      gender: "female",
      children: []
    }
  ]
};

interface PersonFieldsProps {
  value: Person;
  onChange: (value: Person) => void;
}

const PersonFields = ({ value, onChange }: PersonFieldsProps) => {
  const { input } = form(value, onChange);
  return (
    <>
      <label>Name</label>
      <input type="text" {...input("name")} />
      <label>Age</label>
      <input type="number" {...input("age")} />
      <select {...input("gender")}>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="other">other</option>
      </select>
    </>
  );
};

const emptyPerson: Person = {
  name: "",
  age: 0,
  gender: "other",
  children: []
};

interface ChildrenFieldProps {
  value: readonly Person[];
  onChange: (value: readonly Person[]) => void;
}
const ChildrenField = ({ value, onChange }: ChildrenFieldProps) => {
  const { index } = form(value, onChange);
  return (
    <>
      {value.map((_person, i) => (
        <div key={i}>
          <PersonFields {...index(i)} />
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          onChange([...value, emptyPerson]);
        }}
      >
        Add
      </button>
    </>
  );
};

export const FormTest = () => {
  const [count, setCount] = useState(0);
  const onChange = () => {
    setCount(count + 1);
  };
  const { fields, field, state } = useForm(person, onChange);
  return (
    <form
      action="javascript:void 0"
      onSubmit={() => alert(JSON.stringify(state, null, 4))}
    >
      <h4>Parent</h4>
      <PersonFields {...fields()} />
      <h5>Children</h5>
      <ChildrenField {...field("children")} />
      <div>Change count: {count}</div>
      <button type="submit">Submit</button>
    </form>
  );
};
