import React from 'react'

function LabelTextArea({label, value, onChange}) {
  return (
    <div className='flex'>
        <label htmlFor="" className='inline-block w-[12rem]'>{label}</label>
        <textarea onChange={onChange} value={value} name="" className='shadow-innner grow border border-blue-300 shadow-xl p-1' id=""></textarea>
    </div>
  )
}

export default LabelTextArea