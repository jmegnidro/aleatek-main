import React, { useEffect, useState } from 'react';
import Flash from '../../../../../component/utils/Flash/Flash';
import Button from '../../../../../component/utils/Button/Button';
import advice from '../../../../../assets/icon/advice.png'
import axios from 'axios';
import MiniLoader from '../../../../../component/utils/Loader/MiniLoader';
import check from '../../../../../assets/icon/check.png';
import ConfirmLever from '../../../../../component/Modal/ConfirmLever';

function GestionCommentaire() {
	const [errors, setErrors] = useState(false);
	const [success, setSuccess] = useState(false);
	const [action, setAction] = useState(false);
	const [load, setLoad] = useState(true);
    const [commentaires, setComentaires] = useState([])

    const [commentsSelect, setCommentsSelect] = useState([]);
    const [confirmeLever, setConfirmeLever] = useState(false);

	useEffect(()=>{
		(async()=>{
			// Je veux recuperer tous les commentaires des livrables classer de maniere catgorise
            let id = localStorage.getItem('planAffaire')
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/planaffaire/' + id + '/')
      
			let {data: dataComm} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_commentaire_on_affaire/${data.affaire}/`);

            setComentaires(dataComm);
            setLoad(false);
		})();
	}, []);

    let lever = async ()=>{
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + '/lever_commentaire/', {
                commentaires: commentsSelect
            })
            setSuccess(true)
            window.location.reload()
        } catch (error) {
            setErrors(error.message)
            setAction(false)
        }
    }

    let annulerLever = async ()=>{
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + '/annuler_lever_commentaire/', {
                commentaires: commentsSelect
            })
            setSuccess(true)
            window.location.reload()
        } catch (error) {
            setErrors(error.message)
            setAction(false)
        }
    }

    if(load)
        return <MiniLoader/>

	return (
	<div className='w-full h-full'>
        {confirmeLever && <ConfirmLever handleClose={()=>{
            setConfirmeLever(false)
        }} lever={lever}/>}
		{errors && <Flash setFlash={setErrors}>{errors}</Flash>}
		{success && <Flash type="success" setFlash={setSuccess}>Operation reussie</Flash>}
		<h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>
		<nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
			<h2 className='text-blue-800 flex items-center'>
			<img src={advice} alt="OilPump" className='w-[2rem]'/>
                Gesttion des commentaire
			</h2>
		</nav>

        <div className='m-4'>
            <Button action={()=>{
                setConfirmeLever(true)
            }}>Lever</Button>
            {!action ? <Button action={()=>{
                setAction(true)
                annulerLever()
            }}>Annuler Lever</Button> : <span className='text-green-600'>Operation en cours</span> }
        </div>

        <div className='m-4'>
            <table className='w-full text-sm'>
                <thead>
                    <tr className='grid grid-cols-[4rem_4rem_auto_14rem_14rem] bg-gray-900 text-white'>
                        <th className='p-2 border-r border-white'></th>
                        <th className='p-2 border-r border-white'>Lever</th>
                        <th className='p-2 border-r border-white'>Commentaires</th>
                        <th className='p-2 border-r border-white'>Exprime sur</th>
                        <th className='p-2 border-r border-white'>Ouvrage</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        commentaires?.map((commentaire, index)=>(
                            <tr className={`grid grid-cols-[4rem_4rem_auto_14rem_14rem] ${index%2===0 ? 'bg-gray-200': ''}`} key={index}>
                                <td className='p-2 border-r border-gray-900'> <input type="checkbox" onChange={(e)=>{
                                    if(e.target.checked){
                                        setCommentsSelect([...commentsSelect, commentaire.id])
                                    }else{
                                        let newComments = commentsSelect.filter((c)=>c !== commentaire.id)
                                        setCommentsSelect(newComments)
                                    }
                                }}/> </td>
                                <td className='p-2 border-r border-gray-900 flex justify-center items-center'> {commentaire.lever && <img src={check} alt="" srcset=""  className='w-10 h-10'/> } </td>
                                <td className='p-2 border-r border-gray-900 '>{commentaire.remarque}</td>
                                <td className='p-2 border-r border-gray-900 '>{commentaire.on}</td>
                                <td className='p-2'>{commentaire.ouvrage}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
	</div>
	)
}

export default GestionCommentaire