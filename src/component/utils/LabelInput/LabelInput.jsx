import React from 'react'
import Input from '../Input/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';

function LabelInput({label_w, col, required, label, span_info, error, disabled, small, onChange, type, value, readOnly, input_max}) {
  let myclass = 'm-1 ';
  let labelclass = '';

  if(col)
    myclass += 'flex flex-col';
  else
    myclass += 'grid'
  if(small)
    myclass += ' text-sm';

  return (
    <div className={myclass}>
        <label htmlFor="" className={labelclass + ""}>
          {required && <span className='text-red-600 text-xs'> <FontAwesomeIcon icon={faAsterisk}/> </span> }
          <span>{label}</span>
        </label>
        <Input onChange={onChange} type={type} disabled={disabled} value={value} readOnly={readOnly} input_max={input_max}/>
        {span_info ? <span>{span_info}</span> : ''}
        <span className='text-xs text-red-600'>{error}</span>
    </div>
    )
}

export default LabelInput