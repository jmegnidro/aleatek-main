import React, { useEffect, useState } from 'react'
import document from '../../../../../assets/icon/aso.png'
import Tabs from '../../../../../component/utils/Tabs/Tabs'
import ListAso from './SubAso/ListAso';
import GestionAso from './SubAso/GestionAso';
function ASO() {
  const [asoSelect, setAsoSelect] = useState({});

  useEffect(()=>{
    (async()=>{

    })();
  });

  return (
    <div className='w-full h-full'>
      <h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>
      <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
        <h2 className='text-blue-800 flex items-center'>
          <img src={document} alt="OilPump" className='w-[2rem]'/>
          ASO
        </h2>
      </nav>

      <div className='m-4'>
          <Tabs tabs={[
            {title: "Liste des ASO", content: <ListAso set={setAsoSelect}/>},
            {title: "Gestion de l'ASO", content : <GestionAso aso={asoSelect}/>}
          ]}/>
      </div>
    </div>
  )
}

export default ASO