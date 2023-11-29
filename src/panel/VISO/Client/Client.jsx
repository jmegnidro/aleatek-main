import React, { useEffect, useState } from 'react';
import Iconclients from '../../../assets/icon/clients.png'
import Button from '../../../component/utils/Button/Button';
import axios from 'axios';
import CreateEntreprise from '../../../component/Modal/CreateEntreprise';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModale from '../../../component/Modal/ConfirmationModale';
import MiniLoader from '../../../component/utils/Loader/MiniLoader';

function Client() {
  const [load, setLoad] = useState(true)
  const [clients, setClients] = useState([]);
  const [clientsSelect, setClientsSelect] = useState(null);
  const [clientsString, setClientsString] = useState('');
  const [modal, setModal] = useState(false);
  const [edition, setEdition] = useState(null);

  useEffect(()=>{
    (async ()=>{
      let data = await axios.get(process.env.REACT_APP_STARTURIBACK + '/entreprise_and_responsable/');
      setClients(data.data);
      setLoad(false);
    })();
  }, []);

  let deleteClient = async (id)=>{
    try {
      await axios.delete(process.env.REACT_APP_STARTURIBACK + `/admin/entreprise/${id}/`);
      window.location.reload()      
    } catch (error) {
      console.log(error);
    }
  }

  return (
  <>

    {modal && <CreateEntreprise edition={edition} close={()=>{
      setModal(false)
      setEdition(null)
      }}/>}
    {clientsSelect && <ConfirmationModale
      action={()=>{deleteClient(clientsSelect)}}
      abort={()=>{setClientsSelect(null)}}
      >Voulez vous vraiment supprimer l'entreprise {clientsString} ?</ConfirmationModale>}
    <div className='w-full h-full'>
      <h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>
      <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
        <h2 className='text-blue-800 flex items-center'>
          <img src={Iconclients} alt="OilPump" className='w-[2rem]'/>
          Gestions des clients
        </h2>
      </nav>

      <div>
        <div className='my-4'>
          <Button action={()=>{setModal(true)}}>Ajouter</Button>
        </div>
        <div>
          <table className='w-full mt-6'>
            <thead>
              <tr className='grid grid-cols-[2fr_2fr_2fr_2fr_1fr]'>
                <th className='text-start p-1 bg-gray-600 text-white'>Raison Sociale</th>
                <th className='text-start p-1 bg-gray-600 text-white'>Contacts</th>
                <th className='text-start p-1 bg-gray-600 text-white'>Activite</th>
                <th className='text-start p-1 bg-gray-600 text-white'>Ville</th>
                <th className='text-start p-1 bg-gray-600 text-white'>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className='w-full'>
                <td>
                {load && <MiniLoader/>}
                </td>
              </tr>
              {!load && (clients.length > 0 ? clients.map((client, index)=>{
                return (
                  <tr className='grid grid-cols-[2fr_2fr_2fr_2fr_1fr]' key={index}>
                    <td>{client.raison_sociale}</td>
                    <td>{client.responsables.length!==0&&(client.responsables[0].nom + " " + client.responsables[0].prenom)}</td>
                    <td>{client.activite}</td>
                    <td>{client.adresse.ville}</td>
                    <td className='flex justify-start items-start gap-6'>
                      <Button action={()=>{
                        setClientsSelect(client.id)
                        setClientsString(client.raison_sociale)
                      }}><FontAwesomeIcon icon={faTrash}/></Button>
                      <Button action={()=>{
                        setEdition(client.id);
                        setModal(true);
                      }}>
                        <FontAwesomeIcon icon={faPen}/>
                      </Button>
                    </td>
                  </tr>
                )
              }) : <tr className='text-center w-full'>
                Aucun client enregistre
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>

  )
}

export default Client