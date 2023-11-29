import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Button from '../utils/Button/Button';
import MiniLoader from '../utils/Loader/MiniLoader';
import Flash from '../utils/Flash/Flash';

function AddConstructeur({handleClose, entrepriseEnroll, affaire}) {
    const [constructeurs, setConstructeurs] = useState([]);
    const [constructSelect, setContructSelect] = useState([]);
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    useEffect(()=>{
        (async ()=>{
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/entreprise/`);

            let all_entreprise = data.results.filter(dt=>{
                return !entrepriseEnroll.includes(dt.id)
            })

            setConstructeurs(all_entreprise);
            setLoad(false);
        })();
    }, []);

    let enregistrer = async()=>{
        try {
            await axios.post(process.env.REACT_APP_STARTURIBACK + `/add_entreprise_on_affaire/`,{
                entreprises : constructSelect,
                affaire : affaire
            }, {withCredentials:true});
    
            setSuccess(true);
            window.location.reload();
            
        } catch (error) {
            setError(error.toString())
        }
        setAction(false)
    }

    return (
        <div id="defaultModal" tabIndex="-1" aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
            <div className="relative w-full max-w-4xl max-h-full">
                <div className="relative bg-gray-300 rounded-lg shadow ">
                {success && <Flash type={'success'} setFlash={setSuccess}>Operation reussie</Flash>}
                {error && <Flash setFlash={setError}>{error}</Flash>}
                <div className="flex justify-between items-center pr-6">
                    <h3 className="text-xl font-semibold text-gray-900  p-6">
                    Ajouter des constructeurs
                    </h3>
                    <span className="text-xl cursor-pointer" onClick={handleClose}>
                    <FontAwesomeIcon icon={faXmark} />
                    </span>
                </div>
                {!load ? <div className="px-6 space-y-6">
                    <div>
                        {!action ? <Button action={()=>{
                            setAction(true)
                            enregistrer()
                        }}>Enregistrer</Button> : <span>Traitement en cours</span> }
                    </div>
                    <table className='w-full'>
                        <thead>
                            <tr>
                                <th className='w-[3rem]'></th>
                                <th className='text-start'>Raison Sociale</th>
                                <th className='text-start'>Siret</th>
                                <th className='text-start'>Activite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                constructeurs.map((constructeur, index)=>{
                                    return (
                                        <tr key={index}>
                                            <td className='w-[3rem]'><input type="checkbox" name="" id="" onChange={(e)=>{
                                                if(e.target.checked){
                                                    if(!constructSelect.includes(constructeur.id)){
                                                        setContructSelect([...constructSelect, constructeur.id]);
                                                    }
                                                }else{
                                                    if(constructSelect.includes(constructeur.id)){
                                                        setContructSelect(constructSelect.filter(cS=>{
                                                            return cS !== constructeur.id
                                                        }));
                                                    }
                                                }
                                            }}/></td>
                                            <td>{constructeur.raison_sociale}</td>
                                            <td>{constructeur.siret}</td>
                                            <td>{constructeur.activite}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div> : <MiniLoader/>}
                </div>
            </div>
        </div>
    )
}

export default AddConstructeur