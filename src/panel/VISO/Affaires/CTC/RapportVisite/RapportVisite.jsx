import React, { useState } from 'react';
import rvIm from '../../../../../assets/icon/visitor.png';
import Tabs from '../../../../../component/utils/Tabs/Tabs';
import Creer from './SubRV/Creer';
import Liste from './SubRV/Liste';
import Gestion from './SubRV/Gestion';
function RapportVisite() {
  const [rv, setRv] = useState()

  return (
    <div className='w-full h-full'>
      <h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>
      <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
        <h2 className='text-blue-800 flex items-center'>
          <img src={rvIm} alt="OilPump" className='w-[2rem]'/>
          Rapport de Visite
        </h2>
      </nav>

      <div className='m-4'>
          <Tabs tabs={[
            {title: "Liste des RV", content: <Liste rv={rv} setRv={setRv}/>},
            {title: "Gestion du RV", content : <Gestion rv={rv} setRv={setRv}/>},
            {title: "Creer un RV", content: <Creer rv={rv} setRv={setRv}/>},
          ]}/>
      </div>
    </div>
  )
}

export default RapportVisite