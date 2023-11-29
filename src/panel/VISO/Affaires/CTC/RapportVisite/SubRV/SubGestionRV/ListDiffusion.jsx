import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../../../../../component/utils/Button/Button';

function ListDiffusion({id, statut}) {

    const [diffusions, setDiffusions] = useState([]);
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    useEffect(()=>{
        (async()=>{
            if(id !== undefined){
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/all_entreprise_concerne_by_rv/${id}/`);
                setDiffusions(data);    
            }
        })();
    }, [id, triggerUpdate]);

    // useCallback()

    let defineDiffusionForEntreprise = async (entreprise, e)=>{
        await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/entreprise_affaire_ouvrage/${entreprise.id}/`,
        {
            affaire_ouvrage : entreprise.affaire_ouvrage,
            affaire_entreprise : entreprise.affaire_entreprise,
            diffusion : e.target.checked,
        });

        setTriggerUpdate(prevState => !prevState);
    }

    return (
        <>
            <table className='w-full text-sm'>
                <thead>
                    <tr className='grid grid-cols-[3rem_15rem_12rem_12rem_auto]'>
                        <th className='border border-gray-400'></th>
                        <th className='border border-gray-400'>Raison Sociale</th>
                        <th className='border border-gray-400'>Siret</th>
                        <th className='border border-gray-400'>Activite</th>
                        <th className='border border-gray-400'>Liste des emails</th>
                    </tr>
                </thead>
                <tbody>
                    {diffusions.map((diffusion, index)=>{
                        return (
                            <tr className='grid grid-cols-[3rem_15rem_12rem_12rem_auto]' key={index}>
                                <td className='text-center'> <input disabled={parseInt(statut) > 1} type="checkbox" name="" id="" checked={diffusion.diffusion} onChange={(e)=>{
                                    defineDiffusionForEntreprise(diffusion, e)
                                }}/> </td>
                                <td> {diffusion.detail_entreprise.raison_sociale} </td>
                                <td>{diffusion.detail_entreprise.siret}</td>
                                <td>{diffusion.detail_entreprise.activite}</td>
                                <td className='flex flex-col'>{diffusion.responsables.map((respo, index)=>{
                                    return <span key={index}>{respo.email}</span>
                                })}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        
        </>
    )
}

export default ListDiffusion