import React, { useEffect, useState } from 'react'
import Adresse from '../../../../../../component/Adresse/Adresse';
import axios from 'axios';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';

function Renseignement() {
    const [plan, setPlan] = useState(null);
    const [load, setLoad] = useState(true);
    useEffect(()=>{
        (async()=>{
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/detail_plan_affaire_for_plan_affaire/${localStorage.getItem("planAffaire")}/`)
            setPlan(data)
            setLoad(false);
        })();
    }, []);

    if(load)
        return <MiniLoader/>

    if(plan)
        return (
            <div className='p-8'>
                <div className='flex my-4'>
                    <span className='w-[12rem] inline-block'>Montant des travaux</span>
                    <span> : {plan.prix}</span>
                </div>
                <div className='flex my-4'>
                    <span className='w-[12rem] inline-block'>Devise</span>
                    <span> : {plan.devise}</span>
                </div>
                <div className='flex my-4'>
                    <span className='w-[12rem] inline-block'>Type Montant</span>
                    <span> : {plan.type_montant}</span>
                </div>
                <div className='flex my-4'>
                    <span className='w-[12rem] inline-block'>Debut chantier</span>
                    <span> : {plan.debut_chantier}</span>
                </div>
                <div className='flex my-4'>
                    <span className='w-[12rem] inline-block'>Fin chantier</span>
                    <span> : {plan.fin_chantier}</span>
                </div>
                <div className='border border-gray-600'>
                    <Adresse adress={plan.adresse} disabled/>
                </div>
            </div>
        )
    
    return <MiniLoader/>
}

export default Renseignement