import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import LabelInput from '../../utils/LabelInput/LabelInput';
import LabelSelect from '../../utils/LabelSelect/LabelSelect';
import LabelCheckbox from '../../utils/LabelCheckbox/LabelCheckbox';
import Adresse from '../../Adresse/Adresse';
import validator from 'validator';
import Datepicker from 'tailwind-datepicker-react';

const Etape4 = ({ modifyField, setBatiment, batiment, dataAffaire, dataPlan, adress, setAdress, setStringError }) => {
  const [duree, setDuree] = useState(0);
  const [load, setLoad] = useState(true);
  const [startChantier, setStartChantier] = useState('');
  const [endChantier, setEndChantier] = useState('');
  const [destinations, setDestinations] = useState([]);

  const [datePickerPrestation, setDatePickerPrestation] = useState(false)
  const [datePickerDebut, setDatePickerDebut] = useState(false)
  const [datePickerFin, setDatePickerFin] = useState(false)

  useEffect(() => {
    modifyField('devise', '€');
    modifyField('numero', '1');
    modifyField('type_montant', 'HT');
    modifyField('type', 'CTC');
    modifyField('risque', 'Normal');

    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_STARTURIBACK}/admin/batiment/`);
        setBatiment(batiment || response.data.results[0].id || "");
        setDestinations(response.data.results);
      } catch (error) {
        console.log(error);
      }
      setLoad(false);
    };

    fetchData();
    validate();
  }, []);

  useEffect(()=>{
    validate();
  }, [dataPlan, adress])

  let validate = () => {
    setStringError('');
  }

  return (
    <>
      <div>
        <div className="flex gap-8">
          <LabelInput label="N° Contrat" value={dataAffaire.numero_contrat} disabled/>
          <LabelInput label="N° Plan" disabled value={1} />
        </div>

        <LabelInput label="Libelle Affaire" value={dataAffaire.libelle} disabled />

        <LabelInput
          label="Libele Plan Affaire"
          value={dataPlan.libelle}
          onChange={(e) => {
            modifyField('libelle', e.target.value);
          }}
        />
      </div>

      <div className="border border-gray-400 p-2 mb-2">
        <div className="flex items-center justify-between">
          <LabelInput
            col
            label="Montant travaux"
            value={dataPlan.prix}
            onChange={(e) => {
              modifyField('prix', e.target.value);
            }}
          />

          <LabelSelect
            col
            label="Devise"
            value={dataPlan.devise}
            onChange={(e) => {
              modifyField('devise', e.target.value);
            }}
            options={{
              '€': '€',
              '$': '$',
            }}
          />

          <LabelSelect
            col
            label="(HT/TTC)"
            value={dataPlan.type_montant}
            onChange={(e) => {
              modifyField('type_montant', e.target.value);
            }}
            options={{
              'HT': 'HT',
              'TTC': 'TTC',
            }}
          />

          {!load ? <LabelSelect
            col
            label="Destination"
            value={batiment}
            onChange={(e) => {
              setBatiment(e.target.value);
            }}
            options={destinations.reduce((prev, curr) => {
              let key = curr.libelle;
              prev[key] = curr.id;
              return prev;
            }, {})}
          /> : <span className='text-green-600'>Donee en cours de chargement</span>}

          {batiment === "" && <span className='text-red-600'>Aucun Batiment disponible en base de donnee</span>}

        </div>

        <div>
          <label htmlFor="">Date debut prestation</label>
          <Datepicker options={{
            language:'fr',
            defaultDate: dataPlan.debut_prestation && new Date(dataPlan.debut_prestation)
          }} show={datePickerPrestation} setShow={()=>{setDatePickerPrestation(!datePickerPrestation)}} onChange={(date) => {
            modifyField("debut_prestation", moment(date).format('YYYY-MM-DD'));
          }}/>
        </div>


        <div>
          <label htmlFor="">Date de debut du chantier</label>
          <Datepicker options={{
            language:'fr',
            defaultDate: dataPlan.debut_chantier && new Date(dataPlan.debut_chantier)
          }} show={datePickerDebut} setShow={()=>{setDatePickerDebut(!datePickerDebut)}} onChange={(date) => {
            modifyField("debut_chantier", moment(date).format('YYYY-MM-DD'));
          }}/>
        </div>

        <div>
          <label htmlFor="">Date de fin du chantier</label>
          <Datepicker options={{
            language:'fr',
            defaultDate: dataPlan.fin_chantier && new Date(dataPlan.fin_chantier)
          }} show={datePickerFin} setShow={()=>{setDatePickerFin(!datePickerFin)}} onChange={(date) => {
            modifyField("fin_chantier", moment(date).format('YYYY-MM-DD'));
          }}/>
        </div>

        <div className="flex justify-between">
          <LabelInput
            label="Nb document a examiner"
            value={dataPlan.doc}
            type="number"
            onChange={(e) => {
              modifyField('doc', e.target.value);
            }}
          />

          <LabelInput
            label="Nb visites/reunions prevues"
            value={dataPlan.visite}
            type="number"
            onChange={(e) => {
              modifyField('visite', e.target.value);
            }}
          />
        </div>

        <div className="flex justify-between">
          <LabelSelect
            label="Type d'affaire"
            value={dataPlan.type}
            onChange={(e) => {
              modifyField('type', e.target.value);
            }}
            options={{
              'CTC': 'CTC',
              'VT': 'VT',
            }}
          />

          <LabelSelect
            label="Risque"
            value={dataPlan.risque}
            onChange={(e) => {
              modifyField('risque', e.target.value);
            }}
            options={{
              'Normal': 'Normal',
              'Particulier': 'Particulier',
              'Complexe': 'Complexe',
            }}
          />
        </div>
      </div>

      <div>
        <span>Adresse du Chantier</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-400 p-1">
            <Adresse adress={adress} setAdress={setAdress} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Etape4;
