import React, { useState, useEffect } from 'react';
import ouvrage from '../../../../assets/icon/publication.png';
import axios from 'axios'
import ChooseCollabForOuvrage from '../../../../component/ChooseCollabForOuvrage/ChooseCollabForOuvrage';
import AddOuvrage from '../../../../component/AddOuvrage/AddOuvrage';
import Button from '../../../../component/utils/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModale from '../../../../component/Modal/ConfirmationModale';
import MiniLoader from '../../../../component/utils/Loader/MiniLoader';
import CreateOuvrage from '../../../../component/Modal/CreateOuvrage';
import EditOuvrage from '../../../../component/Modal/EditOuvrage';

function OuvrageDiffusion() {
    const [modal, setModal] = useState(false);
    const [modalCreation, setModalCreation] = useState(false);
    const [modalForEntreprise, setModalForEntreprise] = useState(null);
    const [ouvrageAffaires, setOuvrageAffaires] = useState([]);
    const [eaoToDelete, setEaoToDelete] = useState(null);
    const [ouvrageAffaireToDelete, setOuvrageAffaireToDelete] = useState(null);
    const [ouvrageAffaireToEdit, setOuvrageAffaireToEdit] = useState(null);
    const [load, setLoad] = useState(true);
    const [affaire, setAffaire] = useState(null);

    useEffect(()=>{
      (async()=>{
        try {
          let id = localStorage.getItem('planAffaire')
          let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/planaffaire/' + id + '/')
          let id_affaire = data.affaire;
          setAffaire(data.affaire)
        //   let {data: allData} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_ouvrage_affaire/${id_affaire}/`)
        //   // let save = allData;
        //   await Promise.all(allData.map(async sv=>{
        //     let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/entreprise_for_affaire_ouvrage/' + sv.id + '/')
        //     sv.entreprise = data;
        //     return sv;
        //   }))
		let {data : allData} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_ouvrage_affaire_detail_entreprise/${id_affaire}/`)
          // console.log(save);
          setOuvrageAffaires(allData);
        } catch (error) {
          console.log(error);          
        }

        setLoad(false);

      })();
    }, []);

    let deleteEntrepriseAffaireOuvrage = async (id)=>{
      try {
        await axios.delete(process.env.REACT_APP_STARTURIBACK + `/admin/entreprise_affaire_ouvrage/${id}/`)
        window.location.reload()
      } catch (error) {
        console.log(error);
      }
    }

    let deleteAffaireOuvrage = async (id)=>{
      try {
        await axios.delete(process.env.REACT_APP_STARTURIBACK + `/admin/affaireouvrage/${id}/`)
        window.location.reload()
      } catch (error) {
        console.log(error);
      }
    }
    
    let setDiffusion = async (e, ouvrageAfaire)=>{
      try {
        await axios.put(process.env.REACT_APP_STARTURIBACK + '/define_diffusion_for_ouvrage/', {
          affaire_ouvrage : ouvrageAfaire.id,
          eao : ouvrageAfaire.entreprise.map(eao=>eao.id),
          diffusion : e.target.checked
        })

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <>
      {modal && <AddOuvrage affaire={affaire} ouvrageSelectBefore={ouvrageAffaires.map(oA=>oA.id_ouvrage)} handleClose={()=>{setModal(false)}}/>}
      
      {modalCreation && <CreateOuvrage handleClose={()=>{setModalCreation(false)}}/>}
      
      {modalForEntreprise !==null && <ChooseCollabForOuvrage ouvrage_affaire={modalForEntreprise} handleClose={()=>{setModalForEntreprise(null)}}/>}
      
      {eaoToDelete && <ConfirmationModale action={()=>{
        deleteEntrepriseAffaireOuvrage(eaoToDelete);
      }} abort={()=>{
        setEaoToDelete(null)
      }}>Voulez vous retiree cet entreprise de l'ouvrage ?</ConfirmationModale>}
      
      {ouvrageAffaireToDelete && <ConfirmationModale
      action={()=>{
        deleteAffaireOuvrage(ouvrageAffaireToDelete);
      }} abort={()=>{
        setOuvrageAffaireToDelete(null)
      }}>Voulez vous retirer cet ouvrage ?</ConfirmationModale>}

	  {ouvrageAffaireToEdit !== null && <EditOuvrage ouvrageAffaire={ouvrageAffaireToEdit} handleClose={()=>{
		setOuvrageAffaireToEdit(null)
	  }}/> }

      <div className='w-full h-full text-sm'>
        <h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>
        <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
          <h2 className='text-blue-800 flex items-center'>
            <img src={ouvrage} alt="Ouvrage" className='w-[2rem]'/>
            Ouvrage Diffusion
          </h2>
        </nav>

      {!load ? <div className='flex-grow'>
          <div>
            <Button action={()=>{setModal(true)}}>Ajouter un ouvrage</Button>
            <Button action={()=>{setModalCreation(true)}}>Creer un ouvrage</Button>
          </div>
            <div className='grid grid-cols-[5rem_auto_5rem] bg-gray-900 text-white'>
              <span className='p-4'>Diffusion</span>
              <span className='p-4'>Libelle</span>
              <span className='p-4'></span>
            </div>
            {ouvrageAffaires.map((oA, index)=>{
              return (
                <div key={index} className='mb-6'>
                  <div className='grid grid-cols-[5rem_auto_5rem] bg-white'>
                    <span className='p-2 text-center'> <input type="checkbox" checked={oA.diffusion} onChange={(e)=>{
                      setDiffusion(e, oA);
                    }}/> </span>
                    <span className='p-2'>{oA.rename || oA.ouvrage.libelle}</span>
                    <span className='p-2 flex gap-4'>
						<span className='cursor-pointer'  onClick={()=>{
						setOuvrageAffaireToDelete(oA.id)
						}}>
							<FontAwesomeIcon icon={faTrash}/>
						</span>
						<span className='cursor-pointer' onClick={()=>{
							setOuvrageAffaireToEdit(oA)
						}}>
							<FontAwesomeIcon icon={faPen}/>
						</span>
					</span>
                  </div>
                  <div className='flex justify-end my-1'>
                    <Button action={() => { setModalForEntreprise(oA.id) }}>Ajouter une entrepise</Button>
                  </div>
                  <div className='flex justify-end'>
                    <table className='mr-4 bg-white'>
                      <thead>
                        <tr className='grid grid-cols-[12rem_12rem_12rem_3rem]'>
                          <th className='border border-gray-400 px-2'>Raison Sociale</th>
                          <th className='border border-gray-400 px-2'>Siret</th>
                          <th className='border border-gray-400 px-2'>Activite</th>
                          <th className='border border-gray-400 px-2'></th>
                        </tr>
                      </thead>
                      <tbody>
                        {oA.entreprises.map((dt, index)=>{
                          return (
                            <tr key={index} className='grid grid-cols-[12rem_12rem_12rem_3rem] border-b border-gray-400'>
                              <td>{dt.entreprise.raison_sociale}</td>
                              <td>{dt.entreprise.siret}</td>
                              <td>{dt.entreprise.activite}</td>
                              <td className='text-red-600 text-center cursor-pointer' onClick={()=>{
                                setEaoToDelete(dt.id)
                              }}>
								<FontAwesomeIcon icon={faTrash}/>
							</td>
                            </tr>  
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
        </div> : <MiniLoader/>}
      </div>    
      </>
    )
}

export default OuvrageDiffusion