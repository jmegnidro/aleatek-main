import React, { useEffect, useState } from 'react';
import LabelInput from '../utils/LabelInput/LabelInput';
import LabelSelect from '../utils/LabelSelect/LabelSelect';
import Button from '../utils/Button/Button';
import axios from 'axios';
import validator from 'validator';
import Flash from '../utils/Flash/Flash';
import MiniLoader from '../utils/Loader/MiniLoader';
import Datepicker from 'tailwind-datepicker-react';
import moment from 'moment';

/**
 * Ma logique de selection
 * 
 * Quand j'initialise je cherche tous les AffairesOuvrages et je fais ce que je fais plus bas quand je selectionne
 * 
 * Quand je selection un AffaireOuvrage, je cherche tous les EntrepriseAffaireOuvrage avec mon service
 * Je definis et un premier EntrepriseAffaire et un EntrepriseAffaireSelect et un EntrepriseAffaireOuvrageSelect
 * si je trouve pas EntrepriseAffaire dans mon service je definis EntrepriseAffaire = []
 * EntrepriseAffaireSelect et EntrepriseAffaireOuvrageSelect a null
 * 
 * Quand je selectionne un EntrepriseAffaireSelect je definis un EntrepriseAffaireSelect et un EntrepriseAffaireOuvrageSelect
 *
 */

const CreateDocument = (props) => {
  const [pdfData, setPdfData] = useState({
    nom: '',
    date: '',
  });

  const [id_affaire, setIdAffaire] = useState(null);
  const [affaireOuvrages, setAffaireOuvrages] = useState([]);
  const [affaireOuvragesSelect, setAffaireOuvragesSelect] = useState(null);

  const [entrepriseAffaireForSelectOuvrage, setEntrepriseAffaireForSelectOuvrage] = useState([]);

  // A utiliser pour la creation
  const [entrepriseAffaireOuvrageSelect, setEntrepriseAffaireOuvrageSelect] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [dataDocument, setDataDocument] = useState({
    dossier : "Execution",
    nature : "TOUS",
    indice : "",
    date_indice : undefined,
    date_reception : undefined,
    titre : "",
    numero_externe : undefined
  });
  const [stringErrors, setStringError] = useState("");
  const [flash, setFlash] = useState(false);
  const [load, setLoad] = useState(true);
  const [action, setAction] = useState(false);
  const [success, setSuccess] = useState(false);

  const [datePickerReception, setDatePickerReception] = useState(false);
  const [datePickerIndice, setDatePickerIndice] = useState(false);

  useEffect(()=>{
    (async()=>{
      try {
        let id = localStorage.getItem("planAffaire");
        let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${id}/`)
        setIdAffaire(data.affaire);

        let {data: dataOuvrages} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_ouvrage_affaire/${data.affaire}/`);
        setAffaireOuvrages(dataOuvrages);

        if(dataOuvrages.length > 0){
          setAffaireOuvragesSelect(dataOuvrages[0].id)
        }else{
          setAffaireOuvragesSelect(null);
        }

        if(props.edition){
          let edition = props.edition;
          setDataDocument({
            dossier : edition.dossier || "Execution",
            nature : edition.nature || "TOUS",
            indice : edition.indice || "",
            date_indice : edition.date_indice || undefined,
            date_reception : edition.date_reception || undefined,
            titre : edition.titre || "",
            numero_externe : edition.numero_externe || undefined
          })
        }

        validation()

      } catch (error) {
        console.log(error);
      }
      setLoad(false)
    })();
  }, []);

  useEffect(()=>{
    (async()=>{
      try {
        if(affaireOuvragesSelect !== null){
          let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/entreprise_for_affaire_ouvrage/${affaireOuvragesSelect}/`);
          if(data.length > 0){
            setEntrepriseAffaireForSelectOuvrage(data);
            setEntrepriseAffaireOuvrageSelect(data[0].id);
          }else{
            setEntrepriseAffaireForSelectOuvrage([]);
            setEntrepriseAffaireOuvrageSelect(null);
          }
        }else{
          setEntrepriseAffaireForSelectOuvrage([]);
          setEntrepriseAffaireOuvrageSelect(null);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [affaireOuvragesSelect])

  useEffect(()=>{
    validation()
  }, [dataDocument])

  let validation = ()=>{
    let {titre, numero_externe} = dataDocument;
    if(validator.isEmpty(titre || '') && validator.isEmpty(numero_externe || '')){
      setStringError('Le titre et le numero externe ne peuvent etre simultanement vide');
      return;
    }
    setStringError('')
  }

  const handleFileUpload = (event) => {
    let newFile = event.target.files[0];
    setPdfFiles((prevState) => [
      ...prevState,
      {
        ...pdfData,
        fichier: newFile,
      },
    ]);
    setPdfData({
      nom: '',
      date: '',
    })
  };

  const handleRemoveFile = (index) => {
    setPdfFiles((prevState) => {
      const updatedFiles = [...prevState];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const createDocument = async () => {
    try {
      if(stringErrors){
        setFlash(true)
        setAction(false)
      }else{
  
        let data;
  
        if(props.edition){
          let {data:dataEdit} = await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/documents/${props.edition.id}/`,{
            ...dataDocument, emetteur : entrepriseAffaireOuvrageSelect
          }, {withCredentials : true});
  
          data = dataEdit;
        }else{
          let {data:dataCreate} = await axios.post(process.env.REACT_APP_STARTURIBACK + `/document_create/`,{
            ...dataDocument, emetteur_id : entrepriseAffaireOuvrageSelect, affaire : id_affaire
          }, {withCredentials : true});  
  
          data = dataCreate;
        }
  
        await Promise.all(pdfFiles.map(async pdfFile=>{
          let formData = new FormData();
          formData.append('nom', pdfFile.nom)
          formData.append('date', pdfFile.date)
          formData.append('fichier', pdfFile.fichier)
          formData.append('document', data.id)
    
          await axios.post(process.env.REACT_APP_STARTURIBACK + '/admin/fichierattacher/',
          formData,
          {withCredentials : true})
        }));
        setSuccess(true);
    
        window.location.reload();
      }
      
    } catch (error) {
      setStringError(error.toString())
      setAction(false);
      setFlash(true)
    }
  };

  if(load)
    return <MiniLoader/>

  return (
    <div className='m-2'>
      {flash && <Flash setFlash={setFlash}>{stringErrors}</Flash>}
      {success && <Flash type={"success"} setFlash={setSuccess}>Document cree avec success</Flash>}
      <div className='grid grid-cols-2 gap-x-10'>
        <div>
          {id_affaire && <LabelInput label='N Affaire' disabled value={id_affaire} />}
          {affaireOuvragesSelect && <LabelSelect label='Ouvrage' value={affaireOuvragesSelect} options={affaireOuvrages.reduce((prev, curr)=>{
            let key = curr.ouvrage.libelle;
            prev[key] = curr.id;
            return prev;
          }, {})} onChange={(e)=>{
            setAffaireOuvragesSelect(e.target.value)
          }}/>}

          {entrepriseAffaireOuvrageSelect && <LabelSelect label='Emetteur' value={entrepriseAffaireOuvrageSelect} options={entrepriseAffaireForSelectOuvrage.reduce((prev, curr)=>{
            let key = curr.entreprise.raison_sociale;
            prev[key] = curr.id;
            return prev;
          }, {})} onChange={(e)=>{
            setEntrepriseAffaireOuvrageSelect(e.target.value)
          }}/>}
          <LabelInput required label='N externe' value={dataDocument.numero_externe} onChange={(e)=>{
            setDataDocument({...dataDocument, numero_externe : e.target.value})
          }}/>
          <LabelInput label='Indice' value={dataDocument.indice} onChange={(e)=>{
            setDataDocument({...dataDocument, indice:e.target.value})
          }}/>
        </div>

        <div>
          <LabelSelect label='Dossier' value={dataDocument.dossier} options={{
            "Execution" : "Execution",
            "Conception" : "Conception",
          }} onChange={(e)=>{
            setDataDocument({...dataDocument, dossier : e.target.value})
          }}/>

          {/* <LabelInput type='date' label='Date reception' value={dataDocument.date_reception} onChange={(e)=>{
            setDataDocument({...dataDocument, date_reception : e.target.value})
          }}/> */}
            
          <div>
            <label htmlFor="">Date reception</label>
            <Datepicker options={{
              language:'fr',
              defaultDate: dataDocument.date_reception && new Date(dataDocument.date_reception)
            }} show={datePickerReception} setShow={()=>{setDatePickerReception(!datePickerReception)}} onChange={(date) => {
              setDataDocument({...dataDocument, date_reception : moment(date).format('YYYY-MM-DD')})
            }}/>
          </div>

          <LabelSelect label='Nature' value={dataDocument.nature} options={{
            'TOUS': 'TOUS',
            'Descriptif': 'Descriptif',
            'AT/DTA': 'AT/DTA',
            'Attestation Incendie': 'Attestation Incendie',
            'Carnet': 'Carnet',
            'Certificat': 'Certificat',
            'Certificat incendie': 'Certificat incendie',
            'Compte rendue': 'Compte rendu',
            'Courrier': 'Courrier',
            'fiche techinique': 'Fiche Technique',
            'Note': 'Note',
            'Note de calcule': 'Note de calcule',
            'Notice': 'Notice',
            'Plan': 'Plan',
            'PV': 'PV',
            'PV Incendie': 'PV Incendie',
            'Rapport': 'Rapport',
            'Schéma': 'Schéma'
          }} onChange={(e)=>{
            setDataDocument({...dataDocument, nature : e.target.value})
          }}/>
{/* 
          <LabelInput type='date' label='Date indice'  value={dataDocument.date_indice} onChange={(e)=>{
            setDataDocument({...dataDocument, date_indice : e.target.value})
          }}/> */}

          <div>
            <label htmlFor="">Date indice</label>
            <Datepicker options={{
              language:'fr',
              defaultDate: dataDocument.date_indice && new Date(dataDocument.date_indice)
            }} show={datePickerIndice} setShow={()=>{setDatePickerIndice(!datePickerIndice)}} onChange={(date) => {
              setDataDocument({...dataDocument, date_indice : moment(date).format('YYYY-MM-DD')})
            }}/>
          </div>
        </div>

          <div className='col-span-2'>
            <LabelInput required input_max label='Titre' value={dataDocument.titre} onChange={(e)=>{
              setDataDocument({...dataDocument, titre : e.target.value})
            }}/>
          </div>
      </div>

      <div className='flex gap-6 items-center bg-gray-400 p-2'>
        <input
          id='pdf-upload'
          type='file'
          accept='application/pdf'
          className='hidden'
          onChange={handleFileUpload}
        />
        <LabelInput
          label='Nom fichier'
          value={pdfData.nom}
          onChange={(e) => {
            setPdfData((prevState) => ({
              ...prevState,
              nom: e.target.value,
            }));
          }}
        />
        <LabelInput
          label='Creer le'
          type='date'
          value={pdfData.date}
          onChange={(e) => {
            setPdfData((prevState) => ({
              ...prevState,
              date: e.target.value,
            }));
          }}
        />
        <label htmlFor='pdf-upload' className='text-blue-600 hover:underline cursor-pointer'>
          Ajouter le fichier
        </label>
      </div>

      <table className='text-sm w-full'>
        <thead>
          <tr className='grid grid-cols-6 border-b border-gray-600 py-2'>
            <th className='col-span-2 text-start'>Nom du fichier</th>
            <th className='col-span-1 text-start'>Creer le</th>
            <th className='col-span-2 text-start'>Fichier</th>
            <th className='col-span-1 text-start'>Retirer</th>
          </tr>
        </thead>
        <tbody>
          {pdfFiles.map((pdfFile, index) => {
            return (
              <tr key={index} className={'grid grid-cols-6 border-b border-gray-600'}>
                <td className='col-span-2'>{pdfFile.nom}</td>
                <td className='col-span-1'>{pdfFile.date}</td>
                <td className='col-span-2'>{pdfFile.fichier.name}</td>
                <td className='col-span-1 text-center text-red-800'>
                  <span
                    className='cursor-pointer'
                    onClick={() => {
                      handleRemoveFile(index);
                    }}
                  >
                    Retirer
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className='flex gap-6 mt-4'>
        {entrepriseAffaireOuvrageSelect !==null ?
        (!action ? <Button action={()=>{
          setAction(true)
          createDocument()}}>{props.edition ? 'Editer le document' : 'Creer le document'}</Button> : <span className='text-green-600'>Operation en cours de traitement</span> ) :
        <div className='text-xs max-w-lg text-red-700'>
          Vous ne pouvez pas creer de document sans emetteur ou sans ouvrage.
          Si vous avez selectionner un ouvrage assurer vous d'avoir affecter une entreprise a cet ouvrage
        </div>
        }
        <Button action={props.annuler}>Annuler</Button>
      </div>
    </div>
  );
};

export default CreateDocument;
