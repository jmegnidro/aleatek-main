import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../utils/Button/Button';
import LabelCheckbox from '../utils/LabelCheckbox/LabelCheckbox';
function AddCommentRV({handleClose, avis, setAvis, ouvrage, avisToEdit, commentToEdit}) {

    const [comment, setComment] = useState('')
    const [asuivre, setAsuivre] = useState(false)
    const [image, setImage] = useState(null);
    const [editionMode, setEditionMode] = useState(false)

    useEffect(()=>{
        if ((avisToEdit && avisToEdit != -1) || avisToEdit == 0) {
            setEditionMode(true);
            setComment(commentToEdit.commentaire)
            setAsuivre(commentToEdit.asuivre);
            console.log(commentToEdit);
        }
    }, [avisToEdit, commentToEdit]);

    const handleFileUpload = (event) => {
        let newFile = event.target.files[0];
        setImage(newFile);
    };

    let creer = ()=>{
        let avisToSet = avis.findIndex((data)=>{
            return data.ouvrage == ouvrage;
        })

        if(avisToSet === -1){
            setAvis([...avis, {
                ouvrage : ouvrage,
                commentaires: [{
                    asuivre : asuivre,
                    commentaire : comment,
                    image : image
                }]
            }])
        }else{
            setAvis(avis.map((av, index)=>{
                if(index === avisToSet){
                    if(av.commentaires){
                        av.commentaires.push({
                            asuivre : asuivre,
                            commentaire : comment,
                            image : image
                        })    
                    }else{
                        av.commentaires = [{
                            asuivre : asuivre,
                            commentaire : comment,
                            image : image
                        }]
                    }
                }
                return av;
            }))
        }
        
        handleClose();
    }

    let editer = ()=>{
        setAvis(avis.map((av, index)=>{
            if(index === avisToEdit){
                av.commentaires[commentToEdit.index] = {
                    asuivre : asuivre,
                    commentaire : comment,
                    image : image
                }
            }
            return av;
        }))
        handleClose();
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

export default AddCommentRV