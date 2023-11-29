import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Button from '../utils/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import MiniLoader from '../utils/Loader/MiniLoader';
import Flash from '../utils/Flash/Flash';
import CreateOuvrage from '../Modal/CreateOuvrage';

function AddOuvrage({handleClose, ouvrageSelectBefore, affaire}) {

    const [ouvrages, setOuvrages] = useState([]);
    const [ouvragesSelect, setOuvragesSelect] = useState([]);
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);
	const [errors, setErrors] = useState(false);

    useEffect(()=>{
        (async()=>{
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/all_ouvrage_available_for_affaire/${affaire}/`)
            console.log(ouvrageSelectBefore);
            setOuvrages(data.filter(result=>!ouvrageSelectBefore.includes(result.id)));
            setLoad(false);
        })();
    }, []);

    let enregistrer = async()=>{
		try {
			await axios.post(process.env.REACT_APP_STARTURIBACK + '/add_affaire_ouvrage/',{
				affaire : affaire,
				ouvrages : ouvragesSelect
			}, {withCredentials:true})
			setSuccess(true);
			window.location.reload();
		} catch (error) {
			setErrors("Operation echouee");			
		}
		setAction(false);
    }

    return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
        <div className="relative w-full max-w-3xl max-h-full">
        <div className="relative bg-gray-300 rounded-lg shadow ">
            {success && <Flash type="success" setFlash={setSuccess}>Operation reussie</Flash>}
            {errors && <Flash setFlash={setErrors}>{errors}</Flash>}
            <div className="flex justify-between items-center pr-6">
                <h3 className="text-xl font-semibold text-gray-900  px-6 pt-6">
                    Ajouter des ouvrages
                </h3>
                <span className="text-xl cursor-pointer" onClick={handleClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </span>
            </div>
                
            <div className="px-6 py-4 space-x-2 border-t border-gray-200 rounded-b ">
                {!load && (!action ? <div className='mb-4'>
                    <Button action={()=>{
                        setAction(true);
                        enregistrer();
                    }}>Enregistrer</Button>
                </div> : <span className='text-green-600'>Operation en cours de traitement</span>)}
                {!load ? <table className='w-full'>
                    <thead>
                        <tr>
                            <th></th>
                            <th className='text-start'>Libelle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ouvrages.map((ouvrage, index)=>{
                            let check = ouvragesSelect.includes(ouvrage.id)
                            return (
                                <tr key={index}>
                                    <td><input type="checkbox" name="" id="" checked={check} onChange={(e)=>{
                                        if(e.target.checked){
                                            if(!check){
                                                setOuvragesSelect([...ouvragesSelect, ouvrage.id])
                                            }
                                        }else{
                                            if(check){
                                                setOuvragesSelect(ouvragesSelect.filter(m=>m!==ouvrage.id))
                                            }
                                        }
                                    }}/></td>
                                    <td>{ouvrage.libelle}</td>
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

export default AddOuvrage