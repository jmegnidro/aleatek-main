import React from 'react';
import construction from '../../../../../assets/images/construction.svg';

function Complement() {
  return (
    <div className='flex items-center justify-center'>
      <img src={construction} alt="en construction" srcset="en construction" className='max-w-[30rem] h-auto'/>
    </div>
  )
}

export default Complement