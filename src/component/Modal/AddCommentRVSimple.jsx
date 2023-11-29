import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../utils/Button/Button';
import LabelCheckbox from '../utils/LabelCheckbox/LabelCheckbox';
function AddCommentRVSimple({handleClose, commentaires, setCommentaires, commentEdit}) {

    const [comment, setComment] = useState('')
    const [asuivre, setAsuivre] = useState(false)
    const [image, setImage] = useState(null);
    const [editionMode, setEditionMode] = useState(false)

    useEffect(()=>{
        if (commentEdit) {
            setEditionMode(true);
            setComment(commentEdit.commentaire)
            setAsuivre(commentEdit.asuivre);
        }
    }, [commentEdit]);

    const handleFileUpload = (event) => {
        let newFile = event.target.files[0];
        setImage(newFile);
    };

    let creer = ()=>{
        setCommentaires([...commentaires, {
            asuivre : asuivre,
            commentaire : comment,
            image : image
        }])
        handleClose()
    }

    let editer = ()=>{
        setCommentaires(commentaires.map((comm, index)=>{
            if (index == commentEdit.index) {
                comm.asuivre = asuivre
                comm.commentaire = comment
                comm.image = image
            }
            return comm;
        }))
        handleClose()
    }

    return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
        <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-gray-300 rounded-lg shadow ">
                <div className='flex justify-between items-center pr-6'>
                    <h3 className="text-xl font-semibold text-gray-900  p-6">
                        {editionMode ? "Modifier le commentaire" : "Ajouter un commentaire"}
                    </h3>
                    <span className='text-xl cursor-pointer' onClick={()=>{
                        handleClose()
                    }}><FontAwesomeIcon icon={faXmark}/></span>
                </div>
                <div className="px-6 space-y-6">
                    <textarea name="" id="" className='w-full p-1' rows="5" value={comment} onChange={(e)=>{
                        setComment(e.target.value);
                    }}></textarea>
                    <LabelCheckbox checked={asuivre} label="A suivre" onChange={(e)=>{
                        setAsuivre(e.target.checked);
                    }}/>
                    <div>
                        <input
                            id='image-upload'
                            type='file'
                            accept='image/jpeg, image/png, image/gif'
                            className='hidden'
                            onChange={handleFileUpload}
                        />

                        <label htmlFor='image-upload' className='text-blue-600 hover:underline cursor-pointer'>
                        Ajouter une image
                        </label>
                    </div>
                </div>
                <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b ">
                    <Button action={()=>{
                        handleClose();
                    }}>Retour</Button>
                    <Button action={()=>{
                        if(editionMode){
                            editer();
                        }else{
                            creer();
                        }
                        
                    }}>{editionMode ? "Editer" : "Ajouter"}</Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddCommentRVSimple