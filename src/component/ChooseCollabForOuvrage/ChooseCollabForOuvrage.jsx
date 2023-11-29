import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../utils/Button/Button';
import axios from 'axios';
import MiniLoader from '../utils/Loader/MiniLoader';
import Flash from '../utils/Flash/Flash';
function ChooseCollabForOuvrage(props) {

    let [dataEntrepriseAffaire, setDataEntrepriseAffaire] = useState([]);
    let [entrepriseSelect, setEntrepriseSelect] = useState([]);
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    useEffect(()=>{
        (async()=>{
            try {
                let id = localStorage.getItem('planAffaire')
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/planaffaire/' + id + '/')
                let id_affaire = data.affaire;
    
                let {data : all_data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/entreprise_collab_affaire_detail/${id_affaire}/`);

                let {data: entreprises} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/entreprise_for_affaire_ouvrage/${props.ouvrage_affaire}/`);

                let filter = entreprises.map(entreprise=>{
                    return entreprise.affaire_entreprise_id
                })

                all_data = all_data.filter(aD=>!filter.includes(aD.id));

                setDataEntrepriseAffaire(all_data);
            } catch (error) {
                console.log(error);
            }

            setLoad(false);
        })();
    }, [])

    let enregistrer = async ()=>{
        try {
            await axios.post(process.env.REACT_APP_STARTURIBACK + '/add_entreprise_on_ouvrage/', {
                ouvrage_affaire : props.ouvrage_affaire,
                entreprises : entrepriseSelect
            })
            setSuccess(true);
            window.location.reload();
        } catch (error) {
            setError(error.toString())
        }
        setAction(false)
    }

    return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
        <div className="relative w-full max-w-3xl max-h-full">
        <div className="relative bg-gray-300 rounded-lg shadow ">
            {error && <Flash setFlash={setError}>{error}</Flash>}
            {success && <Flash type="success" setFlash={setSuccess}>Operation reussie</Flash>}
            <div className="flex justify-between items-center pr-6">
                <h3 className="text-xl font-semibold text-gray-900  px-6 pt-6">
                    Ajouter des collaborteurs pour l'ouvrage
                </h3>
                <span className="text-xl cursor-pointer" onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </span>
            </div>

            {!load ? <div className="px-6 py-4 space-x-2 border-t border-gray-200 rounded-b ">
                <div className='mb-4'>
                    {dataEntrepriseAffaire.length!== 0 && <Button action={()=>{
                        setAction(true);
                        enregistrer();
                    }}>Enregistrer</Button>}
                    {action && <span className='text-green-600'>Operation en cours</span> }
                </div>
                {dataEntrepriseAffaire.length!== 0 ? <table className='w-full'>
                    <thead>
                        <tr>
                            <th></th>
                            <th className='text-start'>Raison Sociale</th>
                            <th className='text-start'>Activite</th>
                            <th className='text-start'>Siret</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataEntrepriseAffaire.map((dtE, index)=>{
                            return (
                                <tr key={index}>
                                    <td><input type="checkbox" name="" id="" onChange={(e)=>{
                                        if(e.target.checked){
                                            if(!entrepriseSelect.includes(dtE.id)){
                                                setEntrepriseSelect([...entrepriseSelect, dtE.id])
                                            }
                                        }else{
                                            if(entrepriseSelect.includes(dtE.id)){
                                                setEntrepriseSelect(entrepriseSelect.filter(m=>m!==dtE.id))
                                            }
                                        }
                                    }}/></td>
                                    <td>{dtE.entreprise.raison_sociale}</td>
                                    <td>{dtE.entreprise.activite}</td>
                                    <td>{dtE.entreprise.siret}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> : <span className='text-red-600'>Vous ne disposez pas de constructeur pour cette affaire</span>}

            </div> : <MiniLoader/>}
        </div>
        </div>
    </div>
  )
}

export default ChooseCollabForOuvrage