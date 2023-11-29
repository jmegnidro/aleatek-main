import React, { useEffect } from 'react'
import constante from './constante'
import Button from '../../../../../../component/utils/Button/Button'
import { useState } from 'react'
import axios from 'axios';
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';
import Flash from '../../../../../../component/utils/Flash/Flash';

function DescriptionSommaire({rict}) {

    const [descriptions, setDescriptions] = useState([]);
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState(false);


    useEffect(()=>{
        (async()=>{
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_desription_sommaire_by_RICT/${rict.id}/`)
            setDescriptions(data)
            setLoad(false)
        })()
    }, []);

    let handleDescription = (e, type)=>{
        let descriptionIndex = descriptions.findIndex(descri=>descri.type === type)

        if(descriptionIndex === -1){
            setDescriptions([...descriptions, {
                type : type,
                content : e.target.value,
                rict_id : rict.id
            }])
        }else{
            setDescriptions(descriptions.map((descri, index)=>{
                if(index === descriptionIndex){
                    return {
                        ...descri,
                        content : e.target.value
                    }
                }
                return descri;
            }))
        }
    }

    let enregistrer = async ()=>{
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/save_decription_sommaire/`, {
                descriptions : descriptions
            }, {withCredentials:true});
            setSuccess(true);
            window.location.reload()
        } catch (error) {
            setErrors(error.toString())
            setAction(false)
        }
    }

    if(load)
        return <MiniLoader/>
    
    return (
        <div className='p-4'>
            {success && <Flash type={"success"} setFlash={setSuccess}>Operation reussie</Flash> }
            {errors && <Flash setFlash={setErrors}>{errors}</Flash>}
            <div>
				{
				parseInt(rict.statut) < 1 && 
				(!action ? <Button action={()=>{
					enregistrer()
				}}>Enregistrer</Button> : <span className='text-green-600'>Opertation en cours de traitement</span>)
				}
			</div>
            <div className='grid grid-cols-[20rem_auto] gap-6 bg-gray-900 text-white p-2 mt-4'>
                <div className='font-bold'>Type description</div>
                <div className='font-bold'>Description</div>
            </div>

            {constante.typeDS.map((type, index)=>{
                return (
                    <div key={index} className='grid grid-cols-[20rem_auto] my-4 gap-6'>
                        <div>{type}</div>
                        <div>
                            <textarea className='w-full border border-gray-400 p-1'
                            value={descriptions.find(descri=>descri.type === type)?.content || ""} onChange={(e)=>{
                                handleDescription(e, type)
                            }}></textarea>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default DescriptionSommaire