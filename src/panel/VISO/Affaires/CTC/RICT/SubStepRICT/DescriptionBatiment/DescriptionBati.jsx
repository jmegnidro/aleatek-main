import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Flash from '../../../../../../../component/utils/Flash/Flash';

function DescriptionBati({affaire, handleCritereSelect, rict}) {

    const [criteres, setCriteres] = useState([]);
    const [handle, setHandle] = useState(true);
	const [errors, setErrors] = useState(false)

    useEffect(() => {
        if(affaire)
            (async ()=>{
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK  + `/get_critere_about_description_bati/${affaire}/`);

                setCriteres(data);
            })();
    }, [affaire, handle])

  return (
    <div>
		{errors && <Flash setFlash={setErrors}>{errors}</Flash>}
        <h2 className='p-4 shadow-lg bg-gray-200 text-gray-700'>Description du Bati</h2>
        <div className=''>
            <div className='grid grid-cols-[2rem_20rem_20rem_auto] bg-gray-900 text-white'>
                <span className='p-2'></span>
                <span className='p-2'>Groupe</span>
                <span className='p-2'>Critere</span>
                <span className='p-2'>Description</span>
            </div>
            {
                criteres.map((critere, index)=>{
                    return (
                        <div key={index} className='grid grid-cols-[2rem_20rem_20rem_auto]'>
                            <span className='p-2'> <input type="checkbox" name="" id="" checked={critere.select} onChange={(e)=>{
                                if(parseInt(rict.statut) < 1 ){
									handleCritereSelect(e.target.checked, critere.id);
									setHandle(!handle)
								}else{
									setErrors("Veuillez devalider votre rict avant toute modification")
								}
						}} /></span>
                            <span className='p-2 break-words'>{critere.parent.titre}</span>
                            <span className='p-2'>{critere.titre}</span>
                            <span className='p-2'></span>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default DescriptionBati