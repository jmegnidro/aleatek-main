import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MiniLoader from '../../../../../../../component/utils/Loader/MiniLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditRemarque from './EditRemarque';

function GestionRemarque({id, statut}) {

	const [ouvrages, setOuvrages] = useState([]);
    const [load, setLoad] = useState(true);
    const [handle, setHandle] = useState(true);
    const [avisToEdit, setAvisToEdit] = useState(null);

	useEffect(()=>{
		(async()=>{
			try {
				let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/all_avis_from_RV/${id}/`);
				setOuvrages(data);
                setLoad(false)
			} catch (error) {
				
			}
		})()
	}, [handle]);

    let deleteAvis = async (avis)=>{
        try {
            await axios.delete(process.env.REACT_APP_STARTURIBACK + `/admin/avis_ouvrage/${avis}/`)
            setHandle(!handle);
        } catch (error) {
            
        }
    }

    if(load)
        return <MiniLoader/>
    // else if(parseInt(statut) > 1)
    //     return <div className='p-4 text-red-600'>Rapport de visite classer</div>


	return (
        <>
		<div className='bg-white p-4'>
			{ouvrages.map((ouvrage, index)=>{
				return (
					<div className='my-6' key={index}>
						<div>
                            <span className='font-bold'>Ouvrage : </span>
							<span>{ouvrage.libelle}</span>
						</div>
						<table className='text-sm w-full'>
							<thead>
								<tr className='grid grid-cols-[16rem_auto_4rem]'>
									<th className='border border-gray-400'>Objet de l'avis</th>
									<th className='border border-gray-400'>Commentaire</th>
									<th className='border border-gray-400'></th>
								</tr>
							</thead>
							<tbody>
								{ouvrage.all_avis.map((avis, index)=>{
									return(
										<tr key={index} className='grid grid-cols-[16rem_auto_4rem] border-b border-gray-800'>
											<td>{avis.objet}</td>
											<td>
												{avis.comments.map((comment, index)=>{
													return (
														<div key={index}>
															<input type="checkbox" disabled className='mr-4' checked={comment.asuivre} />
															<pre>{comment.commentaire}</pre>
														</div>
													)
												})}
											</td>
                                            <td className='flex justify-evenly'>

                                                {parseInt(statut) <= 1 &&
                                                <>
                                                <span className='cursor-pointer' onClick={()=>{
                                                    setAvisToEdit(avis)
                                                }}> <FontAwesomeIcon icon={faPen}/> </span>
                                                
                                                <span className='cursor-pointer' onClick={()=>{
                                                    deleteAvis(avis.id)
                                                }}> <FontAwesomeIcon icon={faTrash}/> </span>
                                                </>
                                                }

                                            </td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)
			})}
		</div>

        {avisToEdit && <EditRemarque rv={id} avis={avisToEdit}/>}
        </>
	)
}

export default GestionRemarque