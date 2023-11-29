import React, { useEffect, useState } from 'react'
import Button from '../../../../../../component/utils/Button/Button';
import Tabs from '../../../../../../component/utils/Tabs/Tabs';
import VerificationDocument from './SubGestionAso/VerificationDocument';
import Livrable from './SubGestionAso/Livrable';
import axios from 'axios';
import ListDiffusion from './SubGestionAso/ListDiffusion';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';
import Flash from '../../../../../../component/utils/Flash/Flash';
import RemarqueGenerale from './SubGestionAso/RemarqueGenerale';
import CorrigerRemarque from './SubGestionAso/CorrigerRemarque';

function GestionAso(props) {
    let table_statut = ["En cours", "Accepter", "Classer", "Diffuser"]
    const [asoData, setAsoData] = useState({});
    const [avis, setAvis] = useState('');
    const [redacOrCharge, setRedacOrCharge] = useState('');
    const [load, setLoad] = useState(true);
    const [errors, setErrors] = useState('');
    const [success, setSuccess] = useState('');
    const [action, setAction] = useState(false);

    useEffect(() => {
        (async()=>{
            try {
                let id = localStorage.getItem("planAffaire");
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK +  `/admin/planaffaire/${id}/`);
                let id_affaire = data.affaire;

                let {data : asoRes} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_detail_aso_for_affaire_one_version/${props.aso}/`);
                setAsoData(asoRes)

                let {data: avisRes} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/codification_aso/${asoRes.id}/`)

                setAvis(avisRes.codification)

                if(asoRes.redacteur){
                    let {data: redacRes} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/collaborateurs/${asoRes.redacteur}/`)
                    setRedacOrCharge(redacRes.first_name + " " + redacRes.last_name)
                }
                else{
                    let {data: charge} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/find_charge_affaire_for_affaire/${id_affaire}/`)
                    setRedacOrCharge(charge.nom + " " + charge.prenom)
                }

            } catch (error) {
                console.log(error);
            }
            setLoad(false)
        })();        
    }, [props.aso]);

    let accepter = async()=>{
        if(avis){
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/aso/${asoData.id}/`, {
                ...asoData, statut : 1
            });
            setSuccess("Aso valider avec success")
            window.location.reload();    
        }else{
            setAction(false)
            setErrors("Cet aso ne peut etre valider sans document associer")
        }

    }

    let annuler = async()=>{
        let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/check_aso_current_for_affaire_ouvrage/${asoData.affaireouvrage}/`)
        if(!data){
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/aso/${asoData.id}/`, {
                ...asoData, statut : 0
            });
            setSuccess("Aso annuler avec success")
            window.location.reload();    
        }else{
            setAction(false)
            setErrors("Un ASO est deja en cours pour cet ouvrage. Vous ne pouvez donc annuler votre ASO")
        }

    }

    let classer = async ()=>{
        await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/aso/${asoData.id}/`, {
            ...asoData, statut : 2
        });
        setSuccess("Aso classer avec success")
        window.location.reload();
    }

    return (
        <div>
            <div className='bg-white my-4'>
                {success && <Flash type={"success"} setFlash={setSuccess}>{success}</Flash>}
                {errors && <Flash setFlash={setErrors}>{errors}</Flash>}
                <h2 className='bg-gray-300 shadow-inner px-4 py-1'>ASO</h2>
                {!load ? <div className='text-sm grid grid-cols-2 p-4 gap-4'>
                    <div>
                        <span className='font-bold'>Numero : </span>
                        <span>{asoData.id}</span>
                    </div>
                    <div>
                        <span className='font-bold'>Date : </span>
                        <span>{asoData.date}</span>
                    </div>
                    <div>
                        <span className='font-bold'>Ouvrage : </span>
                        <span>{asoData.ouvrage && asoData.ouvrage.libelle}</span>
                    </div>
                    <div>
                        <span className='font-bold'>Responsable d'affaire / Redacteur : </span>
                        <span>{redacOrCharge}</span>
                    </div>
                    <div>
                        <span className='font-bold'>Statut : </span>
                        <span>{table_statut[asoData.statut]}</span>
                    </div>
                    <div>
                        <span className='font-bold'>Avis : </span>
                        <span>{avis}</span>
                    </div>
                </div> : <MiniLoader/>}
                
                {!load ? (parseInt(asoData.statut) !== 2 && (!action ? <div className='p-4 flex justify-end'>
                    {parseInt(asoData.statut) === 0 && <Button action={()=>{
                        setAction(true);
                        accepter()
                    }}>Accepter</Button>}


                    {parseInt(asoData.statut) === 1 && <Button action={()=>{
                        setAction(true)
                        annuler()
                    }}>Annuler</Button>}

                    {parseInt(asoData.statut) !== 0 ?
                    <>
                        <Button action={()=>{
                            setAction(true)
                            classer()
                        }}>Classer</Button>
                        <Button>Diffuser</Button>                            
                    </> : ''
                    }
                </div> : <div className='p-4 text-end text-green-600'>Operation en cours</div>)) : <MiniLoader/> }
            </div>

            <div className='bg-white my-4'>
                {!load ? <Tabs tabs={[
                    {title: 'Choix Veriffication', content : <VerificationDocument affaire_ouvrage={asoData.affaireouvrage} asoData={asoData}/>},
                    {title: 'Remarque generale', content : <RemarqueGenerale id={asoData.id}/>}, //En cours de Dev
                    {title: 'Corriger remarque', content : <CorrigerRemarque id={asoData.id}/>}, //En cours de Dev
                    {title: 'List de diffusion', content : <ListDiffusion id={asoData.id}/>},
                    {title: 'Livrable', content : <Livrable id={asoData.id}/>},
                ]}/> : <MiniLoader/>}
            </div>
        </div>
    )
}

export default GestionAso