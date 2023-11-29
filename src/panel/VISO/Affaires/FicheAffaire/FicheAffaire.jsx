import React, { useEffect, useState } from 'react';
import oilPump from '../../../../assets/icon/oil-pump.png';
import Tabs from '../../../../component/utils/Tabs/Tabs';

import Complement from './SubFicheAffaire/Complement';
import Detail from './SubFicheAffaire/Detail';
import Fiche from './SubFicheAffaire/Fiche';
import axios from 'axios';

const FicheAffaire = () => {

  const [dataAffaire, setDataAffaire] = useState(null)

  useEffect(()=>{
    (async()=>{
      try {
        let id = localStorage.getItem("planAffaire");
        let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/detail_plan_affaire_for_plan_affaire/${id}/`);
        setDataAffaire(data);
      } catch (error) {
        
      }
    })();
  }, []);

  return (
    <div className='w-full h-full text-sm'>
      <h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>

      <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
        <h2 className='text-blue-800 flex items-center'>
          <img src={oilPump} alt="OilPump" className='w-[2rem]'/>
          Fiche Affaire
        </h2>
      </nav>
      <Tabs tabs={[
          {title : "Fiche Affaire", content : <Fiche setData={setDataAffaire} data={dataAffaire}/>},
          {title : "Detail du Plan d'Affaire", content : <Detail setData={setDataAffaire} data={dataAffaire}/>},
          {title : "Complement du Plan d'Affaire", content : <Complement setData={setDataAffaire} data={dataAffaire}/>},
      ]}/>
    </div>
  );
}

export default FicheAffaire;
