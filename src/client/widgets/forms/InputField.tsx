import React from "react";
import { FormErrorMessage } from "./FormErrorMessage";

interface Props {
  name: string;
  type?: 'text' | 'password'
  label: string;
  value: string;
  onChange: (value: string) => void;
  fieldErrors?: string[];
}

export function InputField (props: Props) {
  const { 
    name, 
    type = 'text', 
    label, 
    value, 
    onChange, 
    fieldErrors 
  } = props;

  return (
    <div>
      <label htmlFor={name} className="block mb-1 font-medium">
        {label}
      </label>

      <input
        className="w-full px-3 py-2 border rounded-md"
        id={name}
        type={type}
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        required
      />

      {fieldErrors?.length && fieldErrors.map(errorMsg => (
        <React.Fragment key={errorMsg}>
          <div className="text-sm">
            <FormErrorMessage msg={errorMsg} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
