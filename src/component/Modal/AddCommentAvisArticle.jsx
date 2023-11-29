import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../utils/Button/Button';
import LabelCheckbox from '../utils/LabelCheckbox/LabelCheckbox';


function AddCommentAvisArticle({handleClose, avis, setAvis, article}) {
    const [asuivre, setAsuivre] = useState(false);
    const [commentaire, setCommentaire] = useState('');

    return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
        <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-gray-300 rounded-lg shadow ">
                <div className='flex justify-between items-center pr-6'>
                    <h3 className="text-xl font-semibold text-gray-900  p-6">
                        Ajouter un commentaire
                    </h3>
                    <span className='text-xl cursor-pointer' onClick={()=>{
                        handleClose()
                    }}><FontAwesomeIcon icon={faXmark}/></span>
                </div>
                <div className="px-6 space-y-6">
                    <textarea name="" id="" className='w-full p-1' rows="5" value={commentaire} onChange={(e)=>{
                        setCommentaire(e.target.value);
                    }}></textarea>
                    <LabelCheckbox label="A suivre" value={asuivre} onChange={(e)=>{
                        setAsuivre(e.target.checked);
                    }}/>
                </div>
                <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b ">
                    <Button action={()=>{
                        handleClose();
                    }}>Retour</Button>
                    <Button action={()=>{
                        let indexAvis = avis.findIndex(avis=>article.id===avis.article)

                        if(indexAvis !== -1){
                            setAvis(avis.map((avis, index)=>{
                                if(index === indexAvis){
                                    return {
                                        ...avis,
                                        commentaires : [...avis.commentaires, {
                                            commentaire : commentaire,
                                            a_suivre : asuivre
                                        }]
                                    }
                                }
                                return avis
                            }))
                            
                        }

                        handleClose()
                    }}>Ajouter</Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddCommentAvisArticle