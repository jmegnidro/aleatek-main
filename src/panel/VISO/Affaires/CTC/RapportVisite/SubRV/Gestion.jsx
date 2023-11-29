import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from '../../../../../../component/utils/Button/Button';
import ListDiffusion from './SubGestionRV/ListDiffusion';
import Tabs from '../../../../../../component/utils/Tabs/Tabs';
import Livrable from './SubGestionRV/Livrable';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';
import GestionRemarque from './SubGestionRV/GestionRemarque';
import AjouterRemarque from './SubGestionRV/AjouterRemarque';
import ConfirmationModale from '../../../../../../component/Modal/ConfirmationModale';

const table_statut = ["En cours", "Accepter", "Classer", "Diffuser"]

function Gestion(props) {
    let [result, setResult] = useState({});
    const [load, setLoad] = useState(true);
    const [confirme, setConfirme] = useState(false);

  useEffect(()=>{
    if(props.rv){
      (async()=>{
        try {
          let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_rapport_visite_by_affaire_one_version/${props.rv}/`)
          setResult(data)
        } catch (error) {
          console.log(error);
        }
        setLoad(false)
      })();  
    }
  }, [props.rv]);

  let valider = async ()=>{
    await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/rapport/visite/${result.id}/`,{
      date : result.date,
      affaire : result.affaire,
      objet : result.objet,
      order_in_affaire : result.order_in_affaire, 
      statut : 1
    }, {withCredentials: true})

    window.location.reload();
  }

  let devalider = async ()=>{
    await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/rapport/visite/${result.id}/`,{
      date : result.date,
      affaire : result.affaire,
      objet : result.objet,
      order_in_affaire : result.order_in_affaire, 
      statut : 0
    }, {withCredentials: true})

    window.location.reload();
  }


  let classer = async ()=>{
    await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/rapport/visite/${result.id}/`,{
      date : result.date,
      affaire : result.affaire,
      objet : result.objet,
      order_in_affaire : result.order_in_affaire, 
      statut : 2
    }, {withCredentials: true})

    window.location.reload();
  }

  let deleteRv = async ()=>{
    try {
        await axios.delete(process.env.REACT_APP_STARTURIBACK + `/admin/rapport/visite/${props.rv}/`)
        window.location.reload()
    } catch (error) {
        
    }
  }

  if(!props.rv)
    return <span className='text-red-600'>Veuillez selectionne un avis</span>

  if(load)
    return <MiniLoader/>

  return (
    <div>
        {confirme && <ConfirmationModale abort={()=>{
            setConfirme(false);
        }} action={()=>{
            deleteRv();
        }}>
            Voulez vous supprimer ce rapport de visite ?
        </ConfirmationModale>}
      <div className='bg-white my-4'>
        <h2 className='bg-gray-300 shadow-inner px-4 py-1'>Rapport de Visite</h2>
        <div className='text-sm grid grid-cols-2 p-4 gap-4'>
            <div>
                <span className='font-bold'>Date : </span>
                <span>{result.date}</span>
            </div>
            <div>
                <span className='font-bold'>Statut : </span>
                <span>{table_statut[result.statut]}</span>
            </div>
            <div>
                <span className='font-bold'>Objet : </span>
                <span>{result.objet}</span>
            </div>
        </div>
        {parseInt(result.statut) <= 1 && <div className='p-4'>
          {parseInt(result.statut) === 0 ? <Button action={()=>{
            valider()
          }}>Valider</Button> : <div>
            <Button action={()=>{
                devalider()
            }}>Devalider</Button>
            <Button action={()=>{
                classer()
            }}>Classer</Button>
          </div> }
        </div>}

        {parseInt(result.statut) <= 1 && <div className='p-4'>
            <Button action={()=>{
                setConfirme(true);
            }}>Supprimer</Button>
        </div>}
      </div>


      <div className='bg-white my-4'>
        <Tabs tabs={[
            {title: 'Gestion des remarques', content : <GestionRemarque id={result.id} statut={result.statut}/>},
            {title: 'Ajouter des remarques', content : <AjouterRemarque id={result.id} statut={result.statut}/>},
            {title: 'List de diffusion', content : <ListDiffusion id={result.id} statut={result.statut}/>, disabled : result.id === undefined},
            {title: 'Livrable', content : <Livrable id={result.id}/>},
        ]}/>
      </div>
    </div>
  )
}

export default Gestion