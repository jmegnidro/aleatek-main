import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../../../../component/utils/Button/Button'
import Flash from '../../../../../component/utils/Flash/Flash'
import MiniLoader from '../../../../../component/utils/Loader/MiniLoader'

function GestionSynthese({dataSynthese, retour, table_statut, affaire}) {

    const [commentaires, setCommentaires] = useState({});
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [errors, setErrors] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        (async()=>{
            if(dataSynthese.statut === 0){
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/all_avis_of_affaire/${affaire}/`);
                setCommentaires(data)    
            }else{
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/all_avis_of_synthese/${dataSynthese.id}/`);
                setCommentaires(data)    
            }
            setLoad(false)
        })()
    }, [])

    let valider = async()=>{
        try {
            await axios.post(process.env.REACT_APP_STARTURIBACK + `/validate_synthese_avis/${dataSynthese.id}/${affaire}/`);
            setSuccess(true)
            window.location.reload()
        } catch (error) {
            setErrors("Une erreur est survenue")
        }
        setAction(false);
    }

    let devalider = async()=>{
        try {
            await axios.post(process.env.REACT_APP_STARTURIBACK + `/devalidate_synthese_avis/${dataSynthese.id}/`);
            setSuccess(true)
            window.location.reload()
        } catch (error) {
            setErrors("Une erreur est survenue")
        }
        setAction(false);
    }

    let classer = async()=>{
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/synthese_avis/${dataSynthese.id}/`, {
                ...dataSynthese,
                statut: 2
            });
            setSuccess(true)
            window.location.reload()
        } catch (error) {
            setErrors("Une erreur est survenue")
        }
        setAction(false);
    }

    if (load) {
        return <MiniLoader/>
    }

    return (
    <>
        {success && <Flash setFlash={setSuccess} type={'success'}>Operation reussie</Flash>}
        {errors && <Flash setFlash={setErrors}>{errors}</Flash>}
        <div className='bg-white m-4'>
            <div className='px-4 pt-4'>
                <Button action={()=>{
                    retour()
                }}>Retour</Button>
            </div>
            <div className='text-sm grid grid-cols-2 p-4 gap-4'>
                <div>
                    <span className='font-bold'>Date : </span>
                    <span>{dataSynthese.date}</span>
                </div>
                <div>
                    <span className='font-bold'>Statut : </span>
                    <span>{table_statut[dataSynthese.statut]}</span>
                </div>
                <div>
                    <span className='font-bold'>Createur : </span>
                    <span>{dataSynthese.createur_detail.last_name} {dataSynthese.createur_detail.first_name}</span>
                </div>
            </div>

            {!action ? <div className='p-4'>
            {parseInt(dataSynthese.statut) <= 1 && <div className='p-4'>
                {parseInt(dataSynthese.statut) === 0 ? <Button action={()=>{
                    setAction(true)
                    valider()
                }}>Valider</Button> : <div>
                    <Button action={()=>{
                        setAction(true)
                        devalider()
                    }}>Devalider</Button>
                    <Button action={()=>{
                        setAction(true)
                        classer()
                    }}>Classer</Button>
                </div> }
                </div>}
            </div> : <span>En cours</span> }
        </div>
        
        <div className='bg-white m-4 p-4'>
            <h2 className='font-bold'>Commentaire des documents</h2>
            <ul className='list-disc pl-4'>
                {commentaires['document'].map((comment, index)=>{
                    return (
                        <li key={index}>{comment.commentaire}</li>
                    )
                })}
            </ul>
        </div>
        
        <div className='bg-white m-4 p-4'>
            <h2 className='font-bold'>Commentaire des rapports de visite</h2>
            <ul className='list-disc pl-4'>
                {commentaires['rv'].map((comment, index)=>{
                    return (
                        <li key={index}>{comment.commentaire}</li>
                    )
                })}
            </ul>
        </div>
        
        <div className='bg-white m-4 p-4'>
            <h2 className='font-bold'>Commentaire des RICT</h2>
            <ul className='list-disc pl-4'>
                {/* {commentaires['commentaires_rict'].map((comment, index)=>{
                    return (
                        <li key={index}>{comment.commentaire}</li>
                    )
                })} */}
            </ul>
        </div>
    </>
    )
}

export default GestionSynthese