import React, { useEffect, useState } from 'react';
import LabelInput from '../../../../../../component/utils/LabelInput/LabelInput';
import Button from '../../../../../../component/utils/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import CreateDocument from '../../../../../../component/CreateDocument/CreateDocument';
import LabelSelect from '../../../../../../component/utils/LabelSelect/LabelSelect';
import axios from 'axios';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';
import Flash from '../../../../../../component/utils/Flash/Flash';
import ConfirmationModale from '../../../../../../component/Modal/ConfirmationModale';

const Recu = (props) => {
  const [newDocument, setNewDocument] = useState(false);
  const [dataForTable, setDataForTable] = useState([]);
  const [load, setLoad] = useState(true);

  const [selectForEdition, setSelectForEdition] = useState(null);
  const [flashSelection, setFlashSelection] = useState(false);

  const [charge, setCharge] = useState(null);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState(false);
  const [selectForDelete, setSelectForDelete] = useState(null);

  useEffect(()=>{
    (async()=>{
      try {
        let id_affaire = props.affaire;
        let {data: docDetail} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_detail_document/${id_affaire}/`);
        let prepare_for_table = await Promise.all(docDetail.map(async doc=>{
          let {data: avis_doc} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/documents/avis/${doc.id}/`)
          return {
            ...doc,
            "emetteur" : doc.entreprise.raison_sociale,
            "ouvrage" : doc.ouvrage.libelle,
            "avis" : avis_doc.codification
          }
        }));

        let {data: datacharge} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/find_charge_affaire_for_affaire/${id_affaire}/`)
        setCharge(datacharge.id);

        let {data: dataUser} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/utilisateur-connecte/')
        setUser(dataUser.id);

        setDataForTable(prepare_for_table)
        setLoad(false);
      } catch (error) {
        console.log(error);        
      }
    })();
  }, [props.affaire]);

  let editionAction = (dataDoc)=>{
    if (user === charge || user === dataDoc.createur){
      if(dataDoc.validateur){
        setErrors("Devalider le document avant de l'editer")
      }else{
        setSelectForEdition(dataDoc)
        setNewDocument(true)
      }
    }else{
      setErrors("Vous ne pouvez pas editer ce document")
    }
  }

  let deleteAction = async(dataDoc)=>{
    if (user === charge || user === dataDoc.createur){
      if(dataDoc.validateur){
        setErrors("Devalider le document avant de le supprimer")
      }else{
        await axios.delete(process.env.REACT_APP_STARTURIBACK + `/admin/documents/${dataDoc.id}/`)
        window.location.reload()
      }
    }else{
      setErrors("Vous ne pouvez pas supprimer ce document")
    }
  }

  let table = (
    <table className='text-sm w-full'>
      <thead className='w-full'>
        <tr className='w-full grid grid-cols-[1rem_auto_4rem_3rem_5rem_8rem_5rem_7rem_8rem_2rem_2rem] bg-gray-600 text-white'>
          <th className='border-r border-white'>id</th>
          <th className='border-r border-white'>Titre</th>
          <th className='border-r border-white'>N externe</th>
          <th className='border-r border-white'>Indice</th>
          <th className='border-r border-white'>Dossier</th>
          <th className='border-r border-white'>Date Reception</th>
          <th className='border-r border-white'>Nature</th>
          <th className='border-r border-white'>Emetteur</th>
          <th className='border-r border-white'>Ouvrage</th>
          <th className='border-r border-white'>Avis</th>
          <th className='border-r border-white'></th>
        </tr>
      </thead>
      <tbody>
        {
          dataForTable.map((data, index)=>{
            return (
              <tr key={index} className={'cursor-pointer grid grid-cols-[1rem_auto_4rem_3rem_5rem_8rem_5rem_7rem_8rem_2rem_2rem] border-b border-gray-400 ' + 
            (data.id===props.document && 'bg-cyan-200')}
                onClick={()=>{
                  props.selectDocument(data.id)
                  setFlashSelection(true)
                }}
              >
                <td className='overflow-x-hidden border-r border-gray-400'>{data.order}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.titre}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.numero_externe}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.indice}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.dossier}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.date_reception}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.nature}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.emetteur}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.ouvrage}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>{data.avis}</td>
                <td className='overflow-x-hidden border-r border-gray-400'>
                  <span className='cursor-pointer' onClick={()=>{
                    editionAction(data)
                  }}>
                    <FontAwesomeIcon icon={faPen}/>
                  </span>
                  <span className='cursor-pointer' onClick={()=>{
                    setSelectForDelete(data)
                  }}>
                    <FontAwesomeIcon icon={faTrash}/>
                  </span>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )

  let component = (dataForTable.length!==0 && table) || (!load ? <div>Aucun Document</div> : <MiniLoader/>);

  if (newDocument) {
    component = <CreateDocument annuler={() => { window.location.reload() }} edition={selectForEdition}/>;
  }

  return (
    <div>
      {flashSelection && <Flash setFlash={setFlashSelection} type="success">Document {props.document} selectionne</Flash>}
      {errors && <Flash setFlash={setErrors}>{errors}</Flash>}
      {selectForDelete && <ConfirmationModale
      abort={()=>{setSelectForDelete(null)}}
      action={()=>{
        deleteAction(selectForDelete)
      }}>Voulez vous vraiment supprimer le document {selectForDelete.titre}</ConfirmationModale>}

      <div className='bg-gray-400 border-4 border-green-400 text-white text-sm flex flex-wrap'>
        <div className='flex flex-wrap'>
          <LabelInput col label="Dossier" />
          <LabelInput col label="Nature" />
          <LabelInput col label="Numero Aleatek" />
          <LabelInput col label="Titre" />
          <LabelInput col label="N externe" />
          <LabelInput col label="Indice" />
          <LabelInput col label="Date Indice" />
          <LabelInput col label="Date Reception" />
        </div>
        <div className='flex gap-8'>
          <LabelSelect col label="Emetteur" />
          <LabelSelect readOnly col label="Ouvrage" />
        </div>
      </div>
      <div className='m-2 flex justify-between'>
        <div>
          <Button action={()=>{
            setNewDocument(!newDocument)
            setSelectForEdition(null)
          }}><FontAwesomeIcon icon={faPlus} /> Nouveau Document</Button>
        </div>
        <div>
          <Button>Filtrer</Button>
          <Button>Reset</Button>
        </div>
      </div>
      {component}
    </div>
  );
};

export default Recu;
