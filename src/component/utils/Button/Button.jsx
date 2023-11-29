import React from 'react'

function Button({disabled, action, children}) {

  return (
    <button disabled={disabled} onClick={()=>{
      action();
      }} className='border border-gray-400 shadow-lg text-sm bg-white px-3 py-1'>
        {children}
    </button>
  )
}

export default Button