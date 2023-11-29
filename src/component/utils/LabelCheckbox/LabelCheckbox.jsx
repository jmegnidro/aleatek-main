import React from 'react'

function LabelCheckbox(props) {
  return (
    <div>
        <input type="checkbox" name="" id="" className='mr-2' checked={props.checked} onChange={props.onChange}/>
        <label htmlFor="">{props.label}</label>
    </div>
    )
}

export default LabelCheckbox