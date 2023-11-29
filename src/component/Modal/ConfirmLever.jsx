import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import LabelTextArea from '../utils/LabelTextArea/LabelTextArea';
import Button from '../utils/Button/Button';


function ConfirmLever({handleClose, lever}) {
    const [message, setMessage] = useState('')
  return (
    
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
      <div className="relative w-full max-w-4xl max-h-full">
        <div className="relative bg-gray-300 rounded-lg shadow ">
          <div className="flex justify-between items-center pr-6">
            <h3 className="text-xl font-semibold text-gray-900  p-6">
                Vous vous appretez a lever ces commentaires
            </h3>
            <span className="text-xl cursor-pointer" onClick={()=>{handleClose()}}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
          </div>
          <div className="p-6">
            <textarea name="" id="" className='w-full' value={message} onChange={(e)=>{
                setMessage(e.target.value)
            }}></textarea>
          </div>
          <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b ">
            <Button action={()=>{lever()}}>Lever</Button>
            <Button action={()=>{handleClose()}}>Annuler</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmLever