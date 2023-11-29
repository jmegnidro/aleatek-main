import React, { useEffect, useState } from 'react'
import Button from '../../../../../../component/utils/Button/Button'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import AddCommentAvisArticle from '../../../../../../component/Modal/AddCommentAvisArticle'
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader'
import Flash from '../../../../../../component/utils/Flash/Flash'
import Article from './Article'

function EditeChapitre({chapitre, retour, rict}) {

    const [affaire, setAffaire] = useState(null);
    const [articles, setArticles] = useState([]);
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    useEffect(()=>{
        (async ()=>{
            let i;
            let {data:dataAffaire} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${localStorage.getItem("planAffaire")}/`);
            setAffaire(dataAffaire.affaire)
            
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_article_for_mission/${chapitre.id}/${dataAffaire.affaire}/`);
            setArticles(data)
            setLoad(false)
        })()
    }, [chapitre]);

    let valider = async ()=>{
        try {
            await axios.post(process.env.REACT_APP_STARTURIBACK + `/validate_devalidate_mission_rict/${chapitre.id}/${rict.id}/`, {
                validate : true
            });
            setSuccess(true)
        } catch (error) {
            setError(error.toString())
        }
        window.location.reload()
    }

    let devalider = async ()=>{
        try {
            await axios.post(process.env.REACT_APP_STARTURIBACK + `/validate_devalidate_mission_rict/${chapitre.id}/${rict.id}/`, {
                validate : false
            });
            setSuccess(true)
        } catch (error) {
            setError(true)
            setError(error.toString())
        }
        window.location.reload()
    }

    if(load)
        return <MiniLoader/>

    return (
        <div>
            {action && <Flash type={"success"} setFlash={setAction}>Operation en cours</Flash>}
            {success && <Flash setFlash={setSuccess} type={"success"}>Operation reussie</Flash>}
            {error && <Flash setFlash={setError}>{error}</Flash>}
            <div className='m-6 text-green-600'>
                {chapitre.code_mission + " - " + chapitre.libelle}
            </div>
            <div className='m-6'>
                {chapitre.check ? 
                <Button action={()=>{
                    setAction(true)
                    devalider()
                }}>Devalider</Button> : 
                <Button action={()=>{
                    setAction(true)
                    valider()
                }}>Valider</Button>
                }
				<Button action={()=>{
					retour()
				}}>Retour</Button>
            </div>
            <div className='mt-6'>
                {/* En tete du systeme */}
                <div className='grid grid-cols-[30rem_16rem_30rem_8rem_auto]'>
                    <span className='border border-gray-400'>Referentiel</span>
                    <span className='border border-gray-400'>Disposition prevues</span>
                    <span className='border border-gray-400'>Avis/Remarques</span>
                    <span className='border border-gray-400'>Commentaires</span>
                    <span className='border border-gray-400'></span>
                </div>

                {/* Corps du systeme */}
                <div className='relative w-full'>
                    {
                        articles.map((article, index)=>{
                            return (
                                <Article key={index} rict={rict} article={article} mission={chapitre.id} level={0}/>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default EditeChapitre