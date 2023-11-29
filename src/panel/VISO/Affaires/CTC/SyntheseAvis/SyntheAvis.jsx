import React, { useEffect, useState } from 'react'
import Button from '../../../../../component/utils/Button/Button'
import advice from '../../../../../assets/icon/advice.png'
import Flash from '../../../../../component/utils/Flash/Flash'
import axios from 'axios';
import MiniLoader from '../../../../../component/utils/Loader/MiniLoader';
import GestionSynthese from './GestionSynthese';

function SyntheAvis() {
    const table_statut = ["En cours", "Accepter", "Classer", "Diffuser"]
    const [errors, setErrors] = useState(false);
    const [success, setSuccess] = useState(false);
    const [affaire, setAffaire] = useState(null);
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [syntheses, setSyntheses] = useState([]);
    const [synthese, setSynthese] = useState(null);
    const [handle, setHandle] = useState(true);

    useEffect(()=>{
        (async()=>{
            let id_plan = localStorage.getItem("planAffaire");
            if(id_plan){
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${id_plan}/`);
                setAffaire(data.affaire);
                let {data:dataSynthese} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/all_synthese_avis/${data.affaire}/`)
                setSyntheses(dataSynthese)
                
                setLoad(false)
            }
        })()
    }, [handle]);

    let createSynthese = async () =>{
        try {
            console.log(syntheses.find((synthese=> synthese.statut === 0 )));
            if(syntheses.find((synthese=> synthese.statut === 0 ))){
                setErrors("Une synthese est deja en cours de creation")
            }else{
                await axios.get(process.env.REACT_APP_STARTURIBACK + `/create_synthese_avis/${affaire}/`);
                setSuccess(true)
                setHandle(!handle)        
            }
        } catch (error) {
            setErrors("Un probleme est survenu lors de la creation de la synthese d'avis")
        }
        setAction(false)
    }

    if(load)
        return <MiniLoader/>


    return (
        <div className='w-full h-full'>
            {errors && <Flash setFlash={setErrors}>{errors}</Flash>}
            {success && <Flash type="success" setFlash={setSuccess}>Synthese d'avis cree avec success</Flash>}
            <h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>
            <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
                <h2 className='text-blue-800 flex items-center'>
                <img src={advice} alt="OilPump" className='w-[2rem]'/>
                Synhese des avis
                </h2>
            </nav>

            {!synthese && <div className='m-4 bg-white p-4'>
                { !action ? <Button action={()=>{
                    setAction(true)
                    createSynthese()
                }}>Creer une nouvelle synthese</Button> : <span className='text-green-600'>En cours de creation</span> }
            </div>}

            {!synthese ? <div className='m-4 bg-white p-4'>
                {syntheses.length !== 0 ? <table className='w-full'>
                    <thead>
                        <tr>
                            <th className='border border-gray-400'>id</th>
                            <th className='border border-gray-400'>Date</th>
                            <th className='border border-gray-400'>Createur</th>
                            <th className='border border-gray-400'>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {syntheses.map((synthese, index)=>{
                            return (
                                <tr
                                className={"cursor-pointer " + (index % 2 === 0 ? 'bg-gray-200' : 'bg-cyan-100')} key={index}
                                onClick={()=>{
                                    setSynthese(synthese)
                                }}
                                >
                                    <td className='text-center'>{synthese.order}</td>
                                    <td className='text-center'>{synthese.date}</td>
                                    <td className='text-center'>{synthese.createur_detail.last_name} {synthese.createur_detail.first_name}</td>
                                    <td className='text-center'>{table_statut[synthese.statut]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> : <span>Cette affaire ne dispose pas encore de synthese d'avis</span> }
            </div> 
            :
            <GestionSynthese dataSynthese={synthese} retour={()=>{
                setSynthese(null)
            }} table_statut={table_statut} affaire={affaire}/>
            }


        </div>
    )
}

export default SyntheAvis