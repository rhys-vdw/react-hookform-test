import React, { useState } from "react";
import { ArrayProps, FieldProps, form, propsArray, propsForm } from "./form";

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

const PersonFields = (props: FieldProps<Person>) => {
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

const ChildrenField = (props: ArrayProps<Person>) => {
  const { index, push, removeAt } = propsArray(props);
  return (
    <>
      {props.value.map((_, i) => (
        <div key={i}>
          <PersonFields {...index(i)} />
          <button
            type="button"
            onClick={() => {
              removeAt(i);
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          push(emptyPerson);
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
  const { field } = form(state, onChange);
  return (
    <form
      action="javascript:void 0"
      onSubmit={() => alert(JSON.stringify(state, null, 4))}
    >
      <h4>Parent</h4>
      <PersonFields value={state} onChange={onChange} />
      <h5>Children</h5>
      <ChildrenField {...field("children")} />
      <div>Change count: {count}</div>
      <button type="submit">Submit</button>
    </form>
  );
};
