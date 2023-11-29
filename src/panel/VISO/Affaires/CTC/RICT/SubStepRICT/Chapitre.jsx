import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { unix } from 'moment';
import React, { useEffect, useState } from 'react'
import EditeChapitre from './EditeChapitre';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';

function Chapitre({rict}) {

    const [chapites, setChapitres] = useState([]);
    const [chapitreSelect, setChapitreSelect] = useState(null);
    const [load, setLoad] = useState(true);

    useEffect(()=>{
        (async()=>{
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${localStorage.getItem("planAffaire")}/`);

            let {data: dataChapitre} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_mission_view_by_chapitre/${data.affaire}/${rict.id}/`);

            setChapitres(dataChapitre)
            setLoad(false)
        })()
    }, []);


    if(load)
        return <MiniLoader/>
    
    return (
        <div className='my-6 w-full'>
            {chapitreSelect ? <EditeChapitre chapitre={chapitreSelect} retour={()=>{setChapitreSelect(null)}} rict={rict}/> : 
            <table className='w-full text-sm'>
                <thead>
                    <tr>
                        <th className='border border-gray-400'>Diffusable</th>
                        <th className='border border-gray-400'>Mission signe</th>
                        <th className='border border-gray-400'>Chapitre</th>
                        <th className='border border-gray-400'>Libelle</th>
                        <th className='border border-gray-400'>Avancement</th>
                        <th className='border border-gray-400'></th>
                    </tr>
                </thead>
                <tbody>
                    {chapites.map((chapitre, index)=>{
                        return (
                            <tr key={index} className='border-b border-gray-400'>
                                <td className='text-center'> <input readOnly type="checkbox" checked={chapitre.chapitre.check} /> </td>
                                <td className='text-center'>{chapitre.mission.code_mission}</td>
                                <td className='text-center'>{chapitre.chapitre.code_mission}</td>
                                <td className='text-center'>{chapitre.chapitre.libelle}</td>
                                <td className='text-center'></td>
                                {parseInt(rict.statut) < 1 && <td className='text-center cursor-pointer' onClick={()=>{
                                    setChapitreSelect(chapitre.chapitre)
                                }}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </td>}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            }
        </div>
    )
}

export default Chapitre