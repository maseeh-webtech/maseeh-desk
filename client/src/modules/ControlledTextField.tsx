import * as React from "react";
import { Input } from "semantic-ui-react";

type Props = {
  placeholder: string;
  icon?: string;
  value: string;
  setValue: (newValue: string) => void;
};

const ControlledTextInput = ({ placeholder, value, setValue, icon }: Props) => {
  return (
    <Input
      fluid
      icon={icon}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default ControlledTextInput;
