import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Table from '../../../../../../../component/utils/Table/Table';
import { tab } from '@testing-library/user-event/dist/tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../../../../../component/utils/Button/Button';

/**
 * Si aso en cours on prends tous les donc sans aso
 * 
 * Si aso non en cours doc lie a l'aso
 */

function VerificationDocument(props) {

    const [dataDocs, setDataDocs] = useState([]);

    useEffect(()=>{
        (async()=>{
            try {
                if(props.affaire_ouvrage){
                    let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_detail_document_for_affaire_ouvrage/${props.affaire_ouvrage}/`);

                    let pre_table = await Promise.all(data.map(async dt=>{
                        let {data: avis_doc} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/documents/avis/${dt.id}/`)
                        let {data: planAff} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${localStorage.getItem("planAffaire")}/`)
                        
                        let {data: all_IT} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/all_mission/${planAff.affaire}/`)
                        return {
                            ...dt,
                            "Intervention technique" : all_IT.reduce((prev, curr, index, arr)=>{
                                prev += curr.code_mission
                                if(index !== arr.length - 1)
                                  prev += ' - '
                                return prev;
                            }, ''),
                            "Avis" : avis_doc.codification,
                        }
                    }));

                    setDataDocs(pre_table)
                }
            } catch (error) {
                
            }
        })();

    }, [props.affaire_ouvrage, props.asoData.id, props.asoData.statut]);

    let attache = async (dataDoc, action)=>{
        if(props.asoData.statut == 0){
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/documents/${dataDoc.id}/`,{
                ...dataDoc, aso : action ? props.asoData.id : null
            })
    
            window.location.reload();    
        }else{

        }
    }

    let storeHead = (
        <tr>
            <th className='text-start border border-gray-600'>id</th>
            <th className='text-start border border-gray-600'>Emetteur</th>
            <th className='text-start border border-gray-600'>N externe</th>
            <th className='text-start border border-gray-600'>Indice</th>
            <th className='text-start border border-gray-600'>Titre</th>
            <th className='text-start border border-gray-600'>Date reception</th>
            <th className='text-start border border-gray-600'>Intervention technique</th>
            <th className='text-start border border-gray-600'>Avis</th>
            <th className='text-start border border-gray-600'></th>
        </tr>
    )
    return (
        <div className='my-8'>
            <div>
                <div className='text-center mb-6 text-sm font-bold'>Document attaches a l'ASO</div>
                {
                dataDocs.length!==0 &&
                <table className='w-full text-sm'>
                    <thead>
                        {storeHead}
                    </thead>
                    <tbody>
                        {dataDocs.filter(doc=>doc.aso && (doc.aso === props.asoData.id)).map((dataDoc, index)=>{
                            return (<tr key={index}>
                                <td>{dataDoc.id}</td>
                                <td>{dataDoc.entreprise.raison_sociale}</td>
                                <td>{dataDoc.numero_externe}</td>
                                <td>{dataDoc.indice}</td>
                                <td>{dataDoc.titre}</td>
                                <td>{dataDoc.date_reception}</td>
                                <td>{dataDoc['Intervention technique']}</td>
                                <td>{dataDoc['Avis']}</td>
                                {parseInt(props.asoData.statut) === 0 && <td className='cursor-pointer' onClick={()=>{
                                    attache(dataDoc, false)
                                }}><FontAwesomeIcon icon={faMinus}/></td>}
                            </tr>)
                        })}
                    </tbody>
                </table>
                }
            </div>

            {parseInt(props.asoData.statut) === 0 && <div>
                <div className='text-center mb-6 text-sm font-bold'>Document valide non attaches a un ASO</div>
                {
                dataDocs.length!==0 &&
                <table className='w-full text-sm'>
                    <thead>
                        {storeHead}
                    </thead>
                    <tbody>
                        {dataDocs.filter(doc=>!doc.aso).map((dataDoc, index)=>{
                            return (<tr key={index}>
                                <td>{dataDoc.id}</td>
                                <td>{dataDoc.entreprise.raison_sociale}</td>
                                <td>{dataDoc.numero_externe}</td>
                                <td>{dataDoc.indice}</td>
                                <td>{dataDoc.titre}</td>
                                <td>{dataDoc.date_reception}</td>
                                <td>{dataDoc['Intervention technique']}</td>
                                <td>{dataDoc['Avis']}</td>
                                <td className='cursor-pointer' onClick={()=>{
                                    attache(dataDoc, true)
                                }}> <FontAwesomeIcon icon={faPlus}/></td>
                            </tr>)
                        })}
                    </tbody>
                </table>
                }
            </div>}
        </div>
    )
}

export default VerificationDocument