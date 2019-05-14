import React from "react";
import { useForm } from "./form";

export const FormTest = () => {
  const person = {
    name: "Bob",
    age: 50,
    gender: "male" as "male" | "female" | "other"
  };
  const { value, input } = useForm(person);
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
    </form>
  );
};
