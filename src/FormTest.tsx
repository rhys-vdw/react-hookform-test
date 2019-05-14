import React, { useState } from "react";
import { form } from "./form";

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

interface ChildProps {
  value: Person;
  onChange: (value: Person) => void;
}

const PersonFields = ({ value, onChange }: ChildProps) => {
  const { input } = form(value, onChange);
  return (
    <>
      <label>Name</label>
      <input type="text" {...input("name")} />
      <label>Age</label>
      <input type="number" {...input("age")} />
      <button type="submit">Submit</button>
      <select {...input("gender")}>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="other">other</option>
      </select>
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
  const { field } = form(state, setState).form("children");
  return (
    <form
      action="javascript:void 0"
      onSubmit={() => alert(JSON.stringify(state, null, 4))}
    >
      <h4>Parent</h4>
      <PersonFields value={state} onChange={onChange} />
      <h5>Children</h5>
      {state.children.map((child, i) => (
        <PersonFields {...field(i)} />
      ))}
      <div>Change count: {count}</div>
    </form>
  );
};
