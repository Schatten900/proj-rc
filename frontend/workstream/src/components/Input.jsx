// Input.jsx
import React, { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  return (
    <input
      ref={ref} // <-- Atachar a ref vinda de fora
      className="w-[90%] h-[50px]
      bg-gray-100 text-center font-medium
      placeholder-gray-400 placeholder:text-lg 
      rounded-2xl outline-none"
      name={props.name}
      type={props.type}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
    />
  );
});

export default Input;