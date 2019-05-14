import React, { useState } from "react";
import { useForm } from "./form";

interface Person {
  readonly name: string;
  readonly age: number;
  readonly gender: "male" | "female" | "other";
}

const person: Person = {
  name: "Bob",
  age: 50,
  gender: "male"
};

interface ChildProps {
  value: Person;
  onChange: (value: Person) => void;
}

// const Child = ({ value, onChange }: ChildProps) => {
//   const { input } = useForm(value, onChange)
//   return (
//   )
// }

export const FormTest = () => {
  const [count, setCount] = useState(0);
  const { value, input } = useForm(person, () => {
    setCount(count + 1);
  });
  return (
    <form
      action="javascript:void 0"
      onSubmit={() => alert(JSON.stringify(value, null, 4))}
    >
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
      <div>Change count: {count}</div>
    </form>
  );
};
