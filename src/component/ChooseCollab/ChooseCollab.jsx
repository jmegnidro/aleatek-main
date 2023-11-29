import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import axios from 'axios';
import Button from '../utils/Button/Button';
import moment from 'moment';
import MiniLoader from '../utils/Loader/MiniLoader';
import Flash from '../utils/Flash/Flash';

function ChooseCollab(props) {

    const [collabs, setCollabs] = useState([]);
    const [collabsSelect, setcollabsSelect] = useState([]);
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        (async()=>{
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/collaborateurs/')
            setCollabs(data.results);
            setLoad(false)
        })();
    }, []);

    let enregistrer = async()=>{

        await axios.post(process.env.REACT_APP_STARTURIBACK + `/add_intervention_technique/`,{
            mission_sign : props.missonSign,
            collaborateurs : collabsSelect,
        }, {withCredentials:true})

        setSuccess(true);

        window.location.reload();
    }

    return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
      <div className="relative w-full max-w-3xl max-h-full">
        <div className="relative bg-gray-300 rounded-lg shadow ">
            {success && <Flash type={"success"} setFlash={setSuccess}>Operation reussie</Flash>}
            <div className="flex justify-between items-center pr-6">
                <h3 className="text-xl font-semibold text-gray-900  px-6 pt-6">
                    Ajouter un ou des intervenants
                </h3>
                <span className="text-xl cursor-pointer" onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </span>
            </div>
                
            <div className="px-6 py-4 space-x-2 border-t border-gray-200 rounded-b ">
                {!load ?
                <>
                <div className='mb-4'>
                    {!action && <Button action={()=>{
                        setAction(true)
                        enregistrer();
                    }}>Enregistrer</Button>}
                    {action && <span className='text-green-600'>Operation en cours</span> }
                </div>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th></th>
                            <th className='text-start'>Nom</th>
                            <th className='text-start'>Prenom</th>
                            <th className='text-start'>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collabs.map((collab, index)=>{
                            let check = collabsSelect.includes(collab.id)
                            return (
                                <tr key={index}>
                                    <td><input type="checkbox" name="" id="" checked={check} onChange={(e)=>{
                                        if(e.target.checked){
                                            if(!check){
                                                setcollabsSelect([...collabsSelect, collab.id])
                                            }
                                        }else{
                                            if(check){
                                                setcollabsSelect(collabsSelect.filter(m=>m!==collab.id))
                                            }
                                        }
                                    }}/></td>
                                    <td>{collab.last_name}</td>
                                    <td>{collab.first_name}</td>
                                    <td>{collab.email}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                </> : <MiniLoader/>}

            </div>
        </div>
      </div>
    </div>

    )
}

export default ChooseCollab