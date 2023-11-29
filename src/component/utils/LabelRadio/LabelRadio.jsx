import React from 'react'

function LabelRadio(props) {
  return (
    <div>
        <input type="radio" name={props.name} id="" />
        <label htmlFor="">{props.label}</label>
    </div>
  )
}

export default LabelRadio