import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MiniLoader from '../../../../../../component/utils/Loader/MiniLoader';
import DescriptionBati from './DescriptionBatiment/DescriptionBati';
import CodeTravail from './DescriptionBatiment/CodeTravail';

function DescriptionBatiment({rict}) {

    const [affaire, setAffaire] = useState(null)

    useEffect(() => {
        (async ()=>{
            let id = localStorage.getItem('planAffaire')
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/planaffaire/' + id + '/')

            setAffaire(data.affaire);
        })()

    }, [])

	let handleCritereSelect = async (check, id)=>{
        try {
            await axios.post(process.env.REACT_APP_STARTURIBACK + `/handle_select_critere/${affaire}/${id}/`, {
                check
            }, {withCredentials: true});
        } catch (error) {
            
        }
	}


	return (
		<div className='p-3'>
            <DescriptionBati rict={rict} affaire={affaire} handleCritereSelect={handleCritereSelect}/>
			<CodeTravail rict={rict} affaire={affaire} handleCritereSelect={handleCritereSelect}/>
		</div>
	)
}

export default DescriptionBatiment