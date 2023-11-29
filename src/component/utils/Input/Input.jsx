import React from 'react'

function Input(props) {
  let myClass = "shadow-inner text-black border border-blue-300 shadow-xl p-[0.2rem]";
  if(props.type === "number")
    myClass += ' w-[4rem]'
  if(props.input_max)
    myClass += ' grow'
  return (
    <input
      type={props.type || 'text'}
      className={myClass}
      onChange={props.onChange}
      disabled={props.disabled}
      value={props.value}
      readOnly={props.readOnly}
      />
  )
}

export default Input