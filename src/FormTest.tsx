import React, { useState } from "react";
import { array, form, propsForm } from "./form";

interface Person {
  readonly name: string;
  readonly age: number;
  readonly gender: "male" | "female" | "other";
  readonly isCool: boolean;
  readonly children: readonly Person[];
}

const person: Person = {
  name: "Bob",
  age: 50,
  gender: "male",
  isCool: false,
  children: [
    {
      name: "Sue",
      age: 10,
      gender: "female",
      isCool: true,
      children: []
    }
  ]
};

interface PersonFieldsProps {
  value: Person;
  onChange: (value: Person) => void;
}

const PersonFields = (props: PersonFieldsProps) => {
  const { input, checkbox } = propsForm(props);
  return (
    <>
      <label>Name</label>
      <input type="text" {...input("name")} />
      <label>Age</label>
      <input type="number" {...input("age")} />
      <label>Cool?</label>
      <input type="checkbox" {...checkbox("isCool")} />
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
  isCool: false,
  children: []
};

interface ChildrenFieldProps {
  value: readonly Person[];
  onChange: (value: readonly Person[]) => void;
}
const ChildrenField = ({ value, onChange }: ChildrenFieldProps) => {
  const { index } = array(value, onChange);
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
  const [state, setState] = useState(person);
  const onChange = (nextState: Person) => {
    setCount(count + 1);
    setState(nextState);
  };
  const { fields, field } = form(state, onChange);
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
