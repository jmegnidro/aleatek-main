import React, { useEffect, useState } from 'react'
import LabelTextArea from '../../../../../../../component/utils/LabelTextArea/LabelTextArea';
import Button from '../../../../../../../component/utils/Button/Button';
import Flash from '../../../../../../../component/utils/Flash/Flash';
import axios from 'axios';
import MiniLoader from '../../../../../../../component/utils/Loader/MiniLoader';

function RemarqueGenerale({id}) {
    const [remarque, setRemarque] = useState('');
    const [load, setLoad] = useState(true);
    const [action, setAction] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [remarques, setRemarques] = useState([]);
    const [request, setRequest] = useState(true);

    useEffect(()=>{
      (async()=>{
        let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_all_remarque_general_on_aso/${id}/`)
        setRemarques(data);
        setLoad(false)
      })();
    }, [request]);


    let ajouter = async ()=>{
      try {
        await axios.post(process.env.REACT_APP_STARTURIBACK + `/set_remarque_on_aso/${id}/`, {
          remarque : remarque
        }, {withCredentials:true});
        setSuccess(true);
        setRequest(!request);
		setRemarque('');
		setLoad(true)
      } catch (error) {
        setError(error.toString());
      }
      setAction(false);
    }

    if(load)
      return <MiniLoader/>

    return (
      <div className='p-2'>
        {success && <Flash setFlash={setSuccess} type={'success'}>Commentaire ajouter</Flash> }
        {error && <Flash setFlash={setError}>{error}</Flash> }
        <div className='my-4'>
            <LabelTextArea value={remarque} onChange={(e)=>{
              setRemarque(e.target.value)
            }} label={"Ajouter une remarque"}/>
            {!action ? <Button action={()=>{
              setAction(true)
              ajouter()
            }}>Ajouter</Button> : <span className='text-green-600'>Operation en cours</span> }
        </div>

        <div className='my-4'>
            <h2>Liste des remarques</h2>
            <table className='w-full'>
              <thead className='bg-gray-800 text-white'>
                <tr className='grid grid-cols-[20rem_auto]'>
                  <th className='text-start p-1 border-r border-white'>Redacteur</th>
                  <th className='text-start p-1 border-r border-white'>Remarque</th>
                </tr>
              </thead>
				<tbody>
					{remarques.map((remarque, index)=>{
						return (
							<tr className='grid grid-cols-[20rem_auto] '>
								<td className='p-1 border border-gray-300'>{remarque.redacteur.last_name + " " + remarque.redacteur.first_name}</td>
								<td className='p-1 border border-gray-300'>{remarque.content}</td>
							</tr>
						)
					})}
				</tbody>
            </table>
        </div>
      </div>
    )
}

export default RemarqueGenerale