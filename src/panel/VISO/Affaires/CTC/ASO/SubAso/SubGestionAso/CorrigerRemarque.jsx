import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MiniLoader from '../../../../../../../component/utils/Loader/MiniLoader';
import Button from '../../../../../../../component/utils/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Flash from '../../../../../../../component/utils/Flash/Flash';

function CorrigerRemarque({id}) {
	const [userRemarques, setUserRemarques] = useState([]);
	const [load, setLoad] = useState(true);
	const [action, setAction] = useState(false);
	const [success, setSuccess] = useState(false);
	const [errors, setErrors] = useState(false);
	const [handleRequest, setHandleRequest] = useState(true);

	useEffect(()=>{
		(async()=>{
			let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_user_remarque_general_on_aso/${id}/`)
			setUserRemarques(data);

			setLoad(false);
		})();
	}, [handleRequest]);

	let deleteRemarque = async(id)=>{
		try {
			await axios.delete(process.env.REACT_APP_STARTURIBACK + `/admin/remarque_aso/${id}/`);
			setSuccess(true)
			setHandleRequest(!handleRequest)
		} catch (error) {
			setErrors(error.toString())
		}
	}

	let enregistrer = async ()=>{
		try {
			await axios.put(process.env.REACT_APP_STARTURIBACK + `/edit_remarque/`, {
				remarques : userRemarques
			});
			setSuccess(true)
			setHandleRequest(!handleRequest)
		} catch (error) {
			setErrors(error.toString())
		}
	}

	if(load)
		return <MiniLoader/>

	return (
		<div className='p-4'>
			{errors && <Flash setFlash={setErrors}>{errors}</Flash> }
			{success && <Flash type={"success"} setFlash={setSuccess}>Operation reussie</Flash>}
			<div className='py-4'>
				<Button action={()=>{
					enregistrer()
				}}>Enregistrer</Button>
			</div>
			{
				userRemarques.map((remarque, index)=>{
					return (
						<div key={index} className='grid grid-cols-[10rem_auto_5rem] py-4'>
							<span>Remarque #{index+1}</span>
							<textarea value={remarque.content} onChange={(e)=>{
                                setUserRemarques(userRemarques.map(uR=>{
                                    if(uR.id === remarque.id)
                                        uR.content = e.target.value

                                    return uR;
                                }))
                            }}></textarea>
							<span className='flex justify-center text-red-600'>
								<span className='cursor-pointer' onClick={()=>{
									deleteRemarque(remarque.id)
								}}>
									<FontAwesomeIcon icon={faTrash}/>
								</span>
							</span>
						</div>
					)
				})
			}
		</div>
	)
}

export default CorrigerRemarque