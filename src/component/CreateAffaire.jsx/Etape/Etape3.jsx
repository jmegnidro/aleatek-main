import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LabelInput from '../../utils/LabelInput/LabelInput';
import LabelSelect from '../../utils/LabelSelect/LabelSelect';
import validator from 'validator';
import Datepicker from 'tailwind-datepicker-react';
import moment from 'moment';
import LabelTextArea from '../../utils/LabelTextArea/LabelTextArea';

const Etape3 = ({ modifyField, dataAffaire, setStringError }) => {
  const [client, setClient] = useState([]);
  const [load, setLoad] = useState(true);
  const [datepicker, setDatePicker] = useState(false);

  useEffect(() => {
    modifyField("statut", dataAffaire.statut || "En cours");

    const fetchData = async () => {
      const response = await axios.get(process.env.REACT_APP_STARTURIBACK + '/entreprise_and_responsable/');
      const dataEntreprise = response.data;
      modifyField("client_id", dataAffaire.client_id || (dataEntreprise.length !== 0 && dataEntreprise[0].id) || "");
      setClient(dataEntreprise);
      setLoad(false);
    };

    fetchData();
    validate();

  }, []);

  useEffect(()=>{
    validate();
  }, [dataAffaire])

  let validate = () => {
    let {numero_contrat, libelle, etendu} = dataAffaire;
    if(validator.isEmpty(numero_contrat)){
      setStringError("Le numero de contrat ne peut etre vide");
      return;
    }
    if (validator.isEmpty(libelle)) {
      setStringError("Le libelle ne peut etre vide")    ;  
      return;
    }
    if (validator.isEmpty(etendu)) {
        setStringError("L'etendu de la mission ne peut etre vide");
        return;        
    }
    setStringError('');
  }

  return (
    <div>
      <div className='border border-gray-400 p-2 mb-2'>
        <LabelInput
          
          label="N° Contrat"
          value={dataAffaire.numero_contrat}
          required
          onChange={(e) => {
            modifyField("numero_contrat", e.target.value);
          }}
        />

        <LabelInput
          label="Libele Affaire"
          required
          value={dataAffaire.libelle}
          onChange={(e) => {
            modifyField("libelle", e.target.value);
          }}
        />

        <LabelSelect
          label="Statut Affaire"
          value={dataAffaire.statut}
          onChange={(e) => {
            modifyField("statut", e.target.value);
          }}
          options={{
            "En cours": "En cours",
            "Achevé": "Achevé",
            "Abandonné": "Abandonné"
          }}
        />
      </div>

      <div className='border border-gray-400 p-2 mb-2'>
        {! load ? <LabelSelect
          label="Client"
          value={dataAffaire.client_id}
          onChange={(e) => {
            modifyField("client_id", e.target.value);
          }}
          options={client.reduce((prev, curr) => {
            let key = curr.raison_sociale;
            prev[key] = curr.id;
            return prev;
          }, {})}
        /> : <span className='text-green-600'>Donnee en cours de chargement</span>}

        {dataAffaire.client_id === "" && <span className='text-red-600'>Vous n'avez enregistrer aucun client</span>}
      </div>

      <div className='border border-gray-400 p-2 mb-2'>
        <LabelInput
          label="N°Offre"
          value={dataAffaire.numero_offre}
          onChange={(e) => {
            modifyField("numero_offre", e.target.value);
          }}
        />

        <div>
          <label htmlFor="">Date du contrat</label>
          <Datepicker options={{
            language:'fr',
            defaultDate: dataAffaire.date_contrat && new Date(dataAffaire.date_contrat)
          }} show={datepicker} setShow={()=>{setDatePicker(!datepicker)}} onChange={(date) => {
            modifyField("date_contrat", moment(date).format('YYYY-MM-DD'));
          }}/>
        </div>

      </div>

      <div className='border border-gray-400 p-2 mb-2'>
          <LabelTextArea label={"Entendu de la mission"} value={dataAffaire.etendu} onChange={(e)=>{
            modifyField("etendu", e.target.value);
          }}/>
      </div>
    </div>
  );
};

export default Etape3;
