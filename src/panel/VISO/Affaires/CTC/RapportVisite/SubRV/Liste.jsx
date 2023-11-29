import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from '../../../../../../component/utils/Table/Table';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';

function Liste(props) {
  const [avisTable, setAvisTable] = useState([]);
  const [load, setLoad] = useState(true)

  useEffect(()=>{
    (async ()=>{
      let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${localStorage.getItem("planAffaire")}/`);
      let {data: resRapport} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_rapport_visite_by_affaire/${data.affaire}/`);

      let pre_table = await Promise.all(resRapport.map(async rapport=>{
        return {
          "order" : rapport.order_in_affaire,
          "id" : rapport.id,
          "Date" : rapport.date,
          "Object" : rapport.objet,
          "Statut" : ["En cours", "Valider", "Classer", "Diffuser"][rapport.statut]
        }
      }));

      setAvisTable(pre_table);
      setLoad(false);
    })();
  }, []);

  if(load){
    return <MiniLoader/>
  }

  return (
    <div>
      {avisTable.length > 0 && <Table datas={avisTable} actionOnLine={(id)=>{props.setRv(id)}}/>}
    </div>
  )
}

export default Liste