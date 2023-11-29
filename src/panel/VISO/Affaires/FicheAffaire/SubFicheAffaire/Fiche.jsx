import React, {useState, useEffect} from 'react'
import LabelInput from '../../../../../component/utils/LabelInput/LabelInput'
import Adresse from '../../../../../component/Adresse/Adresse'
import LabelSelect from '../../../../../component/utils/LabelSelect/LabelSelect'
import Datepicker from 'tailwind-datepicker-react';
import moment from 'moment';
import MiniLoader from '../../../../../component/utils/Loader/MiniLoader';
import axios from 'axios';
import Button from '../../../../../component/utils/Button/Button';
import validator from 'validator';
import Flash from '../../../../../component/utils/Flash/Flash';
import LabelTextArea from '../../../../../component/utils/LabelTextArea/LabelTextArea';

function Fiche({data, setData}) {
    const [datepicker, setDatePicker] = useState(false);
    const [load, setLoad] = useState(true);
    const [client, setClient] = useState([]);
    const [errors, setErrors] = useState(null);
    const [flash, setFlash] = useState(false);
    const [success, setSuccess] = useState(false);
    const [action, setAction] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
          const response = await axios.get(process.env.REACT_APP_STARTURIBACK + '/entreprise_and_responsable/');
          const dataEntreprise = response.data;
          setClient(dataEntreprise);
          setLoad(false);
        };

        fetchData();    
    }, []);

    useEffect(()=>{
        validate();
    }, [data])

    let validate = ()=>{
        if(data){
            const {libelle, numero_contrat, etendu} = data.affaire;

            if(validator.isEmpty(libelle)){
                setErrors("Le libelle ne peut etre vide");
                setFlash(true);
                return false;
            }
    
            if(validator.isEmpty(numero_contrat.toString())){
                setErrors("Le numero de contrat doit etre un nombre valid");
                setFlash(true);
                return false;
            }

            if(validator.isEmpty(etendu)){
                setErrors("L'etendu de la mission ne peut etre vide");
                setFlash(true);
                return false;
            }
        }

        setErrors('');
        return true;
    }

    let enregistrer = async ()=>{
        console.log("Done");
        if(!validate())
        {
            setAction(false);
            return;
        }
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/affaire/${data.affaire.id}/`, data.affaire, {withCredentials:true});
            setSuccess(true);
            window.location.reload();
        } catch (error) {
            setErrors(error.toString());
            setFlash(true);
            setAction(false);
        }
    }

    return data && (
        <>
            {flash && <Flash setFlash={setFlash}>{errors}</Flash> }
            {success && <Flash type={"success"} setFlash={setSuccess}>Modification effectué avec success</Flash>}
            <div className='m-1'>
                {!action ? <Button action={()=>{
                    setAction(true);
                    enregistrer();
                }}>Sauvegarder</Button> : <span className='text-green-600'>Operation en cours de traimeent</span> }
            </div>
            <div className='border border-black m-1'>
                <div className='flex flex-wrap gap-6'>
                    <LabelInput disabled value={data.affaire.id} col label="N Affaire" />
                    
                    <LabelInput required value={data.affaire.libelle} onChange={(e)=>{
                        setData({...data, affaire: {...data.affaire, 'libelle': e.target.value}})
                    }} col label="Libelle"/>
                    
                    <LabelSelect value={data.affaire.statut} col label="Statut de l'affaire"
                        options={{
                        "En cours": "En cours",
                        "Achevé": "Achevé",
                        "Abandonné": "Abandonné"
                        }}
                        onChange={(e)=>{
                            setData({...data, affaire: {...data.affaire, 'statut': e.target.value}})
                        }}
                    />
                </div>
            </div>
            <div>
            <fieldset className='border border-gray-300 m-1 p-2'>
                <legend>Administratif</legend>
                <LabelInput value={data.affaire.numero_offre || ""}  label="N Offre"
                onChange={(e)=>{
                    setData({...data, affaire: {...data.affaire, 'numero_offre': e.target.value}})
                }}
                />
            </fieldset>

            <fieldset className='border border-gray-300 m-1 p-2'>
                <legend>Client</legend>

                <div className='flex gap-1'>
                    <LabelInput value={data.affaire.numero_contrat} required label="N contrat" onChange={(e)=>{
                        setData({...data, affaire: {...data.affaire, 'numero_contrat': e.target.value}})
                    }}/>
                    {/* <LabelInput value={data.affaire.date_contrat} label="Date de contrat" onChange={(e)=>{
                        setData({...data, affaire: {...data.affaire, 'date_contrat': e.target.value}})
                    }}/> */}
                </div>

                <div className='my-4'>
                    <label htmlFor="">Date du contrat</label>
                    <Datepicker options={{
                        language:'fr',
                        defaultDate: data.affaire.date_contrat && new Date(data.affaire.date_contrat)
                    }} show={datepicker} setShow={()=>{setDatePicker(!datepicker)}} onChange={(date) => {
                        // modifyField("date_contrat", moment(date).format('YYYY-MM-DD'));
                        setData({...data, affaire: {...data.affaire, 'date_contrat' : moment(date).format('YYYY-MM-DD')}})
                    }}/>

                </div>

                <div className='flex gap-1'>
                    {!load ? <LabelSelect value={data.affaire.client} label="Raison Sociale du client" onChange={(e)=>{
                        setData({...data, affaire: {...data.affaire, 'client': e.target.value}});
                    }} 
                    options={client.reduce((prev, curr) => {
                        let key = curr.raison_sociale;
                        prev[key] = curr.id;
                        return prev;
                    }, {})}/> : <MiniLoader/> }
                </div>
            </fieldset>

            <fieldset className='border border-gray-300 m-1 p-2'>
                <legend>Mission</legend>

                <div className='flex gap-1'>
                    <LabelTextArea label={"Etendu de la mission"} value={data.affaire.etendu} onChange={(e)=>{
                        setData({...data, affaire: {...data.affaire, 'etendu': e.target.value}});
                    }}/>
                </div>

            </fieldset>

            <fieldset className='border border-gray-300 m-1 p-2'>
                <legend>Adresse du client</legend>

                <div className='flex'>
                    <div className='border border-gray-300 m-1 p-1'>
                        <Adresse disabled adress={data.client.adresse_detail}/>
                    </div>
                </div>
            </fieldset>
            </div>
        </>
    )
}

export default Fiche