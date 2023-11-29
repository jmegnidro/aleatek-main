import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../utils/Button/Button';
import axios from 'axios';
import LabelInput from '../utils/LabelInput/LabelInput';
import Flash from '../utils/Flash/Flash';
import MiniLoader from '../utils/Loader/MiniLoader';

function CreateOuvrage({handleClose}) {

    const [ouvrage, setOuvrage] = useState('');
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [load, setLoad] = useState(true);

    useEffect(()=>{
      (async()=>{
		
        setLoad(false)
      })();
    }, []);

    let createOuvrage = async()=>{
        try {
            if(ouvrage){
				let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${localStorage.getItem("planAffaire")}/`)

				await axios.post(process.env.REACT_APP_STARTURIBACK + `/create_ouvrage_for_affaire/`,
				{
					libelle : ouvrage,
					affaire : data.affaire
				});
            }
            setSuccess(true);
            window.location.reload()
        } catch (error) {
            setAction(false)
            setError("Erreur survenue lors de l'operation")
        }
    }

    return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
      {success && <Flash type={"success"} setFlash={setSuccess}>Ouvrage creer</Flash> }
      {error && <Flash setFlash={setError}>{error}</Flash>}
      <div className="relative w-full max-w-4xl max-h-full">
        <div className="relative bg-gray-300 rounded-lg shadow ">
          <div className="flex justify-between items-center pr-6">
            <h3 className="text-xl font-semibold text-gray-900  p-6">
              Creer un ouvrage
            </h3>
            <span className="text-xl cursor-pointer" onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
          </div>
          <div className="px-6 space-y-6">
            {!load ? <LabelInput label={"Nom de l'ouvrage"} value={ouvrage} onChange={(e)=>{
                setOuvrage(e.target.value)
            }}/> : <MiniLoader/> }
          </div>
          <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b ">
            {!action ? <Button action={()=>{
                setAction(true)
                createOuvrage()
            }}>Creer</Button> : <span className='text-green-600'>Ouvrage en cours de creation</span> }
            <Button action={()=>{handleClose()}}>Annuler</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOuvrage