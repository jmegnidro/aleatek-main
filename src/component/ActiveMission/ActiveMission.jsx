import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Button from '../utils/Button/Button';
import MiniLoader from '../utils/Loader/MiniLoader';
import Flash from '../utils/Flash/Flash';

function ActiveMission({mission_active, handleClose, affaire}) {

    const [missions, setMission] = useState([])
    const [activeMission, setMissionActive] = useState([])
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        (async()=>{
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/get_all_parent_mission/');
            setMission(data);
            setMissionActive(mission_active);
            setLoad(false);
        })();
    }, []);

    let enregistrer = async ()=>{

        await axios.post(process.env.REACT_APP_STARTURIBACK + '/add_mission_active/', {
            affaire : affaire,
            missions : activeMission,
        });

        setSuccess(true)

        window.location.reload();
    }

    return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
        <div className="relative w-full max-w-4xl max-h-full">
            <div className="relative bg-gray-300 rounded-lg shadow ">
                {success && <Flash type={"success"} setFlash={setSuccess}>Operation reussi</Flash>}
                <div className="flex justify-between items-center pr-6">
                    <h3 className="text-xl font-semibold text-gray-900  p-6">
                        Activer ou desactiver les mission
                    </h3>
                    <span className="text-xl cursor-pointer" onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                </div>
                <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b ">
                    {!load && (!action ? <Button action={()=>{
                        setAction(true)
                        enregistrer()
                    }}>Enregistrer</Button> : <span className='text-green-600'>Operation en cours de traitement</span>)}
                </div>
                <div className="px-6 space-y-6">
                    {!load ? <table>
                        <thead>
                            <tr>
                                <th>Active</th>
                                <th>Mission</th>
                                <th>Libelle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {missions && missions.map((mission, index)=>{
                                let check = activeMission.includes(mission.id)
                                return (
                                    <tr key={index}>
                                        <td> <input type="checkbox" name="" id="" checked={check} onChange={(e)=>{
                                            if(e.target.checked){
                                                if(!check){
                                                    setMissionActive([...activeMission, mission.id])
                                                }
                                            }else{
                                                if(check){
                                                    setMissionActive(activeMission.filter(m=>m!==mission.id))
                                                }
                                            }
                                        }}/> </td>
                                        <td> {mission.code_mission} </td>
                                        <td> {mission.libelle} </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table> : <MiniLoader/>}
                </div>
            </div>
        </div>
    </div>

  )
}

export default ActiveMission