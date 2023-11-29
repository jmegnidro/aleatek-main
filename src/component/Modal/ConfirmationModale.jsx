import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../utils/Button/Button';

function ConfirmationModale({children, action, abort}) {
  return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
        <div className="relative w-full max-w-xl max-h-full">
            <div className="relative bg-gray-300 rounded-lg shadow ">
                <div className='flex justify-between items-center pr-6'>
                    <h3 className="text-lg font-semibold text-gray-900  p-6">
                        Confirmer votre action
                    </h3>
                    <span className='text-xl cursor-pointer' onClick={()=>{
                        abort()
                    }}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </span>
                </div>
                <div className="px-6">
                    {children}
                </div>
                <div className="px-6 flex gap-6 py-4">
                    <Button action={()=>{
                        abort()
                    }}>Annuler</Button>

                    <Button action={()=>{
                        action()
                    }}>Confirmer</Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationModale