import React, { useState } from 'react';
import Etape1 from './Etape/Etape1';
import Etape3 from './Etape/Etape3';
import Etape4 from './Etape/Etape4';
import Etape5 from './Etape/Etape5';
import Etape8 from './Etape/Etape8';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../utils/Button/Button';
import axios from 'axios';
import Flash from '../utils/Flash/Flash';

const MainModal = ({ handleClose }) => {
  const [index, setIndex] = useState(0);
  const [stringErrors, setStringError] = useState("");
  const [flash, setFlash] = useState(false);
  const [success, setSuccess] = useState(false);
  const [creating, setCreating] = useState(false);

  const [dataFormAffaire, setDataFormAffaire] = useState({
    numero_contrat: '',
    libelle: '',
    statut: '',
    numero_offre: undefined,
    libelle_contrat: '',
    date_contrat: undefined,
    client_id: undefined,
    charge_id: '',
    assistant_id: '',
    chef_id: '',
    etendu: '',
  });

  const [dataFormPlanAffaire, setDataFormPlanAffaire] = useState({
    numero: '',
    risque: '',
    libelle: '',
    devise: '',
    type: '',
    type_montant: '',
    prix: undefined,
    debut_chantier: undefined,
    fin_chantier: undefined,
    debut_prestation : undefined,
    visite: undefined,
    doc : undefined,
  });
  const [batiment, setBatiment] = useState(undefined)
  const [adress, setAdress] = useState({
    cplt_geo : "",
    numero_voie : "",
    lieu_dit : "",
    code_postal : "",
    ville : "",
    pays : "",
  });
  const [missionSelect, setMissionSelect] = useState([]);


  const modifyAffaireField = (field, value) => {
    setDataFormAffaire((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const modifyPlanField = (field, value) => {
    setDataFormPlanAffaire((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const createAffaireAndPlan = async (missions) => {
    try {
        if(stringErrors){
          setFlash(true);
          return;
        }

        setCreating(true);

        let res = await axios.post(process.env.REACT_APP_STARTURIBACK + '/create_affaire_and_plan_affaire/', {
          dataAffaire : dataFormAffaire,
          dataPlanAffaire : dataFormPlanAffaire,
          dataAdresseChantier : adress,
          dataBatiment : batiment,
          dataMissions : missions
        })

        setSuccess(true);

        window.location.reload();
        
    } catch (error) {
        console.log(error);
    }
  };

  const stages = [
    <Etape1
    />,
    <Etape3
      setStringError={setStringError}
      modifyField={modifyAffaireField}
      dataAffaire={dataFormAffaire}
    />,
    <Etape4
      setStringError={setStringError}
      dataAffaire={dataFormAffaire}
      dataPlan={dataFormPlanAffaire}
      modifyField={modifyPlanField}
      adress={adress}
      setAdress={setAdress}
      batiment={batiment}
      setBatiment={setBatiment}
    />,
    <Etape5
      dataAffaire={dataFormAffaire}
      dataPlan={dataFormPlanAffaire}
      modifyField={modifyAffaireField} 
    />,

    <Etape8
      setStringError={setStringError}
      missionSelect={missionSelect}
      setMissionSelect={setMissionSelect}
      create={createAffaireAndPlan}
      creating={creating}
    />,
  ];

  const handlePrev = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (index < stages.length - 1) {
      if(!stringErrors){
        setIndex((prevIndex) => prevIndex + 1);
        setFlash(false)
      }
      else{
        setFlash(true)
      }
    }
  };

  return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]">
      <div className="relative w-full max-w-4xl max-h-full">
        <div className="relative bg-gray-300 rounded-lg shadow ">
          <div className="flex justify-between items-center pr-6">
            <h3 className="text-xl font-semibold text-gray-900  p-6">
              Assistant de création d'un nouveau "Plan d'Affaire "
            </h3>
            <span className="text-xl cursor-pointer" onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
          </div>
          <div className="px-6 space-y-6">{stages[index]}</div>
          <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b ">
            <span>
              {index + 1} / {stages.length}
            </span>

            <div className="flex items-center justify-between gap-4">
              <div>
                {index > 0 && (
                  <Button action={handlePrev}>Precedent</Button>
                )}
                {index < stages.length - 1 && (
                  <Button action={handleNext}>Suivant</Button>
                )}
              </div>

              <div>
                <Button action={handleClose}>Annuler</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {flash && <Flash setFlash={setFlash} type={!stringErrors}>{stringErrors}</Flash>}
      {success && <Flash setFlash={setFlash} type="success">Affaire Cree</Flash>}
    </div>
  );
};

export default MainModal;
