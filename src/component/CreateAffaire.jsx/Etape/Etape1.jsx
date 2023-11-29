import React, { useEffect } from 'react'
import LabelRadio from '../../utils/LabelRadio/LabelRadio'
import LabelCheckbox from '../../utils/LabelCheckbox/LabelCheckbox'
import LabelInput from '../../utils/LabelInput/LabelInput'

function Etape1() {

  return (
    <div>
      <fieldset className='border border-gray-400 px-4 py-2'>
        <legend>Creation d'un plan d'Affaire</legend>
        <LabelRadio name="typeAffaire" label="Nouvelle Affaire et son Plan Affaire"/>
        <LabelRadio name="typeAffaire" label="Plan d'Affaire Supplementaire dans l'alliance courante"/>
      </fieldset>

      <div className='my-4'>
        <LabelInput label="Affaire courante"/>        
      </div>

      <div className='border border-gray-400 p-4'>
        <h2 className='mb-4'>Choix optionnels: copie de donnees depuis le plan d'affaire en cours (vers le plan d'affaire a creer)</h2>
        <div>
          <LabelCheckbox label="Donnees administratives (Desc. sommaire de l'ouvrage...)"/>
          <LabelCheckbox label="Missions/Prestations"/>
          <LabelCheckbox label="IT/Profils"/>
          <LabelCheckbox label="Constructeurs"/>
          <LabelCheckbox label="Ouvrages"/>
        </div>
      </div>

      <div className='pt-4'>
        <p className='text-xs'>
          (1*) Ou bien cas particulier :
            Plan d'Affaire supplementaire dans une affaire deja liee 
            a Siebel mais associer a un autre Service Siebel (exemple: cas de sites chantier differents)  
        </p>
        <p className='text-xs'>
          (2*) Si plan d'affaire cournat deja lie a un Siebel alors Recopie du lien 
        </p>
      </div>
    </div>
  )
}

export default Etape1