import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from '../../../../../../component/utils/Button/Button';
import Table from '../../../../../../component/utils/Table/Table';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';

function Affectation(props) {

  const [dataDocTable, setDataDocTable] = useState([]);
  const [intervenants, setIntervenants] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [handleCheck, setHandleCheck] = useState(true);
  const [authorize, setAuthorize] = useState(false);
  const [load, setLoad] = useState(true)

  useEffect(() => {
    (async ()=>{
      try {
        let id_affaire = props.affaire;

        let {data: charger} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/find_charge_affaire_for_affaire/${id_affaire}/`);

        let {data : singleDoc} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_detail_document/${id_affaire}/${props.document}/`);

        let {data:userConnect} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/utilisateur-connecte/');

        console.log(userConnect.id, charger.id, singleDoc.createur);
        if(userConnect.id === charger.id || userConnect.id === singleDoc.createur){
          setAuthorize(true)
        }

        let fake_table = [singleDoc];

        let pre_tbl = await Promise.all(fake_table.map(async ft=>{
          return {
            "id" : ft.id,
            "Emetteur" : ft.entreprise.raison_sociale,
            "N externe" : ft.numero_externe,
            "Indice" : ft.indice,
            "Titre" : ft.titre,
            "Dt Reception" : ft.date_reception,
            "Ouvrage" : ft.ouvrage.libelle,
            "Nature" : ft.nature,
            "Dossier" : ft.dossier,
          }
        }));

        let {data : allCollab} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/collaborateurs/`);

        setIntervenants(allCollab.results);

        setDataDocTable(pre_tbl);
      } catch (error) {
        
      }

      setLoad(false)
    })();
  }, [props.document, props.affaire]);

  useEffect(()=>{
    (async()=>{
      try {
        let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_collaborateur_affect_on_document/${props.document}/`)
        setAffectations(data)
      } catch (error) {
        
      }
    })()
  }, [handleCheck]);

  if(load)
    return <MiniLoader/>

  return (
    <div className='pt-4'>
      {props.document === null ? <div className='col-span-2 text-red-600 text-center m-4'>
        Vous n'avez pas sélectionné de document
      </div> : (props.document !== null && dataDocTable.length !== 0 &&
        <Table datas={dataDocTable}/>
      )}

      <div className='m-4'>
        <h2 className='font-bold text-sm my-4'>Affecter des intervenants</h2>

        {authorize ? <table className='text-sm table-auto mb-4 min-w-[32rem]'>
          <thead>
            <tr>
              <th className='border-2 border-gray-600 shadow-lg'></th>
              <th className='text-start border-2 border-gray-600 shadow-lg'>Nom</th>
              <th className='text-start border-2 border-gray-600 shadow-lg'>Prenom</th>
              <th className='text-start border-2 border-gray-600 shadow-lg'>Email</th>
            </tr>
          </thead>
          <tbody>
            {intervenants.map((intervenant, index)=>{
              return (
                <tr key={index}>
                  <td className='border-b border-gray-400'>
                    <input type="checkbox" name="" id="" checked={affectations.includes(intervenant.id)} onChange={async(e)=>{
                      if(affectations.includes(intervenant.id)){
                        await axios.get(process.env.REACT_APP_STARTURIBACK + `/remove_collaborateur_on_document/${intervenant.id}/${props.document}/`)
                      }else{
                        await axios.post(process.env.REACT_APP_STARTURIBACK + `/admin/document_affectation/`,
                        {
                          collaborateur: intervenant.id,
                          document: props.document
                        }, {withCredentials: true})
                      }
                      setHandleCheck(!handleCheck)
                    }}/>
                  </td>
                  <td className='border-b border-gray-400'>
                    {intervenant.last_name}
                  </td>
                  <td className='border-b border-gray-400'>
                    {intervenant.first_name}                    
                  </td>
                  <td className='border-b border-gray-400'>
                    {intervenant.email}                    
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table> : 
        <div className='border border-red-600 bg-red-100 p-2 rounded-lg text-red-600'>Vous n'etes pas autorise a effectuer cette operation</div> }
      </div>
    </div>
  );
}

export default Affectation;
