import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Table from '../../../../../../component/utils/Table/Table';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';

function ListAso(props) {
    const [datasAsos, setDatasAso] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(()=>{

        (async ()=>{
            try {
                let id = localStorage.getItem("planAffaire");
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/planaffaire/' + id + '/')
                let id_affaire = data.affaire

                let {data: allAso} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_detail_aso_for_affaire/${id_affaire}/`)

                let data_for_table = await Promise.all(allAso.map(async aso=>{
                    let statut = ["En cours", "Accepter", "Classer", "Diffuser"]
                    let {data : data_charge_affaire} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/find_charge_affaire_for_affaire/${id_affaire}/`)
                    return {
                        "order" : aso.order_in_affaire,
                        "id" : aso.id,
                        "Date" : aso.date,
                        "Ouvrage" : aso.ouvrage.libelle,
                        "Statut" : statut[aso.statut],
                        "Charge d'affaire" : data_charge_affaire.nom + " " + data_charge_affaire.prenom
                    };
                }));

                setDatasAso(data_for_table)
            } catch (error) {
                console.log(error);
            }

            setLoad(false)
        })();

    }, []);

    if(load){
        return <MiniLoader/>
    }

    return (
        <div className='my-4'>
            {datasAsos.length!==0 && <Table datas={datasAsos} actionOnLine={(id)=>{props.set(id)}}/>}
        </div>
    )
}

export default ListAso