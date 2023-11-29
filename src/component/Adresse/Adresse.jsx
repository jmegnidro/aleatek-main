import React from 'react'
import LabelInput from '../utils/LabelInput/LabelInput'

function Adresse({adress, setAdress, disabled}) {
    return (
        <div className='flex flex-col text-sm'>
            <LabelInput disabled={disabled} label="Cplt Geo" value={adress.cplt_geo} onChange={(e)=>{
                setAdress({...adress, cplt_geo : e.target.value})
            }}/>
            <LabelInput disabled={disabled} label="N et libelle de voie" value={adress.numero_voie} onChange={(e)=>{
                setAdress({...adress, numero_voie : e.target.value})
            }}/>
            <LabelInput disabled={disabled} label="Lieu dit" value={adress.lieu_dit} onChange={(e)=>{
                setAdress({...adress, lieu_dit : e.target.value})
            }}/>
            <LabelInput disabled={disabled} label="Code Postal" value={adress.code_postal} onChange={(e)=>{
                setAdress({...adress, code_postal : e.target.value})
            }}/>
            <LabelInput disabled={disabled} label="Ville" value={adress.ville} onChange={(e)=>{
                setAdress({...adress, ville : e.target.value})
            }}/>
            <LabelInput disabled={disabled} label="Pays" value={adress.pays} onChange={(e)=>{
                setAdress({...adress, pays : e.target.value})
            }}/>
        </div>
    )
}

export default Adresse