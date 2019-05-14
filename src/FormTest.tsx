import React, { useState } from "react";
import { useForm } from "./form";

export const FormTest = () => {
  const person = {
    name: "Bob",
    age: 50,
    gender: "male" as "male" | "female" | "other"
  };
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
