import React, { useEffect, useState } from 'react'
import Button from '../../../../../../component/utils/Button/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight, faPen, faPlus, faRefresh, faSave, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import AddComment from '../../../../../../component/Modal/AddComment';
import Flash from '../../../../../../component/utils/Flash/Flash';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';

function Article({article, level, mission, rict}) {
    const [hideChild, setHideChild] = useState(true);
    const [disposition, setDisposition] = useState('');

    const [avis, setAvis] = useState(false);
    const [commentaires, setCommentaires] = useState([]);
    const [addComment, setAddComment] = useState(false);
    const [commentEdit, setCommentEdit] = useState(null);

    const [handle, setHandle] = useState(true);

    const [success, setSuccess] = useState(null);
    const [errors, setErrors] = useState(false);

    const [load, setLoad] = useState(true);

	const [corromptData, setCorromptData] = useState(false);

    useEffect(()=>{
        (async()=>{
            setLoad(true);
			try {
				let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_disposion_avis_and_comment/${rict.id}/${article.parent.id}/${mission}/`)
				if ('disposition' in data)
					setDisposition(data['disposition'].commentaire)
				if ('avis' in data){
					setAvis(data['avis'].codification)
					setCommentaires(data['avis']['commentaires'])
				}
			} catch (error) {
				setCorromptData(true)
			}
            setLoad(false);
        })();
    }, [handle]);

    let save = async () =>{
        try {
            await axios.post(process.env.REACT_APP_STARTURIBACK + `/save_article_disposition/${rict.id}/${article.parent.id}/${mission}/`, {
                commentaire: disposition,
                avis: avis,
                commentAvis: commentaires
            })
            setSuccess("Operation reussie")
        } catch (error) {
            setErrors(error.toString())
        }
        setHandle(!handle);
    }

    let reset = async ()=>{

    }

    if (load) {
        return <MiniLoader/>
    }

	if (corromptData) 
		return <div className='text-red-600'>Article introuvable. Contactez le developpeur</div>

    return (
    <>
        {(addComment || commentEdit !== null) && <AddComment comments={commentaires}
        handleClose={()=>{
            setAddComment(false)
            setCommentEdit(null)
        }}
        setComments={setCommentaires} edit={commentEdit} avis={avis}/>}

        {errors && <Flash setFlash={setErrors}>{errors}</Flash>}

        {success && <Flash setFlash={setSuccess} type={"success"}>{success}</Flash>}

        <div className='grid grid-cols-[30rem_16rem_30rem_8rem_auto] w-full'>
            <div className={`inline-block pl-${4*level} break-words`}>
                <span onClick={()=>{setHideChild(!hideChild)}} className='cursor-pointer'>
                    {hideChild ? <FontAwesomeIcon icon={faCaretRight}/> : <FontAwesomeIcon icon={faCaretDown}/> }
                </span>
                {article.parent.titre}
            </div>
            <div className='inline-block p-3'>
                <textarea className='w-full border border-gray-600 p-1' type="text"
                value={disposition}
                onChange={(e)=>{
                    setDisposition(e.target.value)
                }}></textarea>
            </div>
            <div className='inline-block p-3'>
                <div className='text-sm flex gap-6'>
                    <select name="" id="" className='bg-white border border-gray-500' value={avis} onChange={(e)=>{
                        setAvis(e.target.value)
                        if(e.target.value === false || e.target.value === "F")
                            setCommentaires([]);
                    }}>
                        <option value={false}>Aucun</option>
                        <option value="F">F</option>
                        <option value="RMQ">RMQ</option>
                        <option value="SO">SO</option>
                        <option value="IM">IM</option>
                        <option value="HM">HM</option>
                    </select>
                    <Button action={()=>{
                        if(avis !== false && avis !== "F")
                            setAddComment(true)
                    }}> <FontAwesomeIcon icon={faPlus}/> </Button>
                </div>
                <div>
                    {commentaires.map((comment, index)=>{
                        return (
                            <div key={index} className={`p-2 my-2 flex flex-col gap-2 ${index%2 ? 'bg-cyan-100' : 'bg-gray-200'}`}>
                                <input type="checkbox" name="" id="" disabled checked={comment.a_suivre}/>
                                <pre className='overflow-hidden'>{comment.commentaire}</pre>
                                <div>
                                    <span className='flex gap-2'>
                                        <span onClick={()=>{
                                            setCommentEdit(index)
                                        }}>
                                            <FontAwesomeIcon icon={faPen}/>
                                        </span>
                                        <span onClick={()=>{
                                            setCommentaires(commentaires.filter((c, id)=>id!==index))
                                        }}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='inline-block'></div>
            <div className='flex justify-evenly'>
                <span className='cursor-pointer' onClick={()=>{
                    save()
                }}>
                    <FontAwesomeIcon icon={faSave}/>
                </span>
                <span>
                    <FontAwesomeIcon icon={faRefresh}/>
                </span>
            </div>
        </div>
        {!hideChild && article['childs'].map((child, index)=>{
            return <Article key={index} article={child} level={level+1} rict={rict} mission={mission}/>
        })}
    </>
    )
}

export default Article