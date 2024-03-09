import "./formInput.css"
import { useState } from "react";


export default function FormInput(props) {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
   setFocused(true);

    if (props.name === "Confirm Password") {
      validatePasswordMatch(props.form);  // Pass the form object
    }
  };


  const validatePasswordMatch = (form) => {
    const password = props.value;
    const confirmPassword = form["Password"];
    if (password != confirmPassword) {
      // Passwords don't match or pattern is not satisfied, show error message
      setFocused(true);
    }
    else
    {
      setFocused(false)
    }
  };

  return (
    <div className="formInput">
      <input
        type={props.type}
        placeholder={props.placeholder}
        className={props.className}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={handleFocus}
        onFocus={handleFocus}
        focused={focused.toString()}
        pattern={props.pattern}
      />

      <span>{props.errorMessage}</span>
    </div>
  );
}
