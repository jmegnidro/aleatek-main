import React, {useState, useEffect} from 'react'
import LabelSelect from '../../../../../../../component/utils/LabelSelect/LabelSelect';
import LabelInput from '../../../../../../../component/utils/LabelInput/LabelInput';
import AddCommentRV from '../../../../../../../component/Modal/AddCommentRV';
import Button from '../../../../../../../component/utils/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import image from '../../../../../../../assets/icon/image.png';
import MiniLoader from '../../../../../../../component/utils/Loader/MiniLoader';
import Flash from '../../../../../../../component/utils/Flash/Flash';

function AjouterRemarque({id, statut}) {
	const [avis, setAvis] = useState([]);
	const [ouvrages, setOuvrages] = useState([]);
    const [ouvragesSelect, setOuvragesSelect] = useState('');
	const [modal, setModal] = useState(false);
    const [load, setLoad] = useState(true);
    const [errors, setErrors] = useState('');
	const [success, setSuccess] = useState(false);
    const [action, setAction] = useState(false);

    const [avisToEdit, setAvisToEdit] = useState(null);
    const [commentToEdit, setCommentToEdit] = useState(null)

	let enregistrer = async()=>{
		try {
			await axios.post(process.env.REACT_APP_STARTURIBACK + `/add_avis_on_rv/${id}`,{
				aviss : avis
			}, {withCredentials:true, headers : {'Content-Type' : 'multipart/form-data'}})

			setSuccess(true)

            window.location.reload();
        } catch (error) {
            setErrors(error.toString());
			setAction(false);
        }
        
	}

    useEffect(()=>{
        (async()=>{
            try {
                let id = localStorage.getItem("planAffaire")
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${id}/`)
                let id_affaire = data.affaire;

                let {data: ouvragRes} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_ouvrage_affaire/${id_affaire}/`)

                setOuvrages(ouvragRes);
                if(ouvragRes.length > 0){
                    setOuvragesSelect(ouvragRes[0].id);
                }

            } catch (error) {
                console.log(error);
                setErrors(error.toString())
            }

            setLoad(false)
        })();
    }, []);

	if(load)
		return <MiniLoader/>
    else if(parseInt(statut) > 1)
        return <div className='p-4 text-red-600'>Rapport de visite classer</div>


	return (
	<div className='bg-gray-100 my-4 pb-6'>
		{modal && <AddCommentRV avis={avis} setAvis={setAvis} ouvrage={ouvragesSelect} handleClose={()=>{setModal(false)}} avisToEdit={avisToEdit} commentToEdit={commentToEdit}/>}
		{success && <Flash type={"success"} setFlash={setSuccess}>Avis ajouter avec success</Flash>}
		{errors && <Flash setFlash={setErrors}>{errors}</Flash>}

		<div className='bg-white px-4'>
			{!action ? <Button action={()=>{
				setAction(true)
				enregistrer()
			}}>Enregistrer</Button> : <span className='text-orange-600'>Avis en cours d'ajout</span> }
		</div>

		<div className='text-sm grid grid-cols-2 p-4 gap-4 bg-white'>
			<LabelSelect col label="Ouvrage" value={ouvragesSelect} options={ouvrages.reduce((prev, curr)=>{
				let key = curr.ouvrage.libelle;
				prev[key] = curr.id;
				return prev;
			}, {})} onChange={(e)=>{
                setOuvragesSelect(parseInt(e.target.value));
			}}/>

			<LabelInput label="Objet du controle" value={avis.find(data=>{return data.ouvrage == ouvragesSelect})?.objet || ""} onChange={(e)=>{
				let avisToSet = avis.findIndex((data)=>{
					return data.ouvrage == ouvragesSelect;
				})
				if(avisToSet === -1){
					setAvis([...avis, {
						ouvrage : ouvragesSelect,
						objet : e.target.value
					}])
				}else{
					setAvis(avis.map((av, index)=>{
						if(index === avisToSet){
							av.objet = e.target.value
						}
						return av;
					}))
				}
			}}/>
			<div>
				<Button action={()=>{
                    setAvisToEdit(null);
                    setCommentToEdit(null);
                    setModal(true);
				}}> <FontAwesomeIcon icon={faPlus}/> </Button>

			</div>
		</div>
		<table className='text-sm w-full bg-white'>
            <thead>
                <tr className='grid grid-cols-[4rem_auto_5rem_5rem] bg-gray-800 text-white'>
                    <th className='border-r border-white py-2'>A suivre</th>
                    <th className='border-r border-white py-2'>Remarque</th>
                    <th className='border-r border-white py-2'>Photos</th>
                    <th className='border-r border-white py-2'></th>
                </tr>
            </thead>
            <tbody>

                {
                    avis.find(data=>{return data.ouvrage == ouvragesSelect})?.commentaires?.map((comm, index)=>{
                        return (
                        <tr className='grid grid-cols-[4rem_auto_5rem_5rem] border-b border-gray-800' key={index}>
                            <td className='flex justify-center border-r border-gray-800 py-2'><input type="checkbox" name="" id="" checked={comm.asuivre} disabled/></td>
                            <td className='flex justify-center border-r border-gray-800 py-2'> <pre>{comm.commentaire}</pre></td>
                            <td className='flex justify-center border-r border-gray-800 py-2'>{comm.image && <img className='w-[2rem]' src={image} alt='my_default_icon'/>}</td>
                            <td className='flex justify-evenly border-r border-gray-800 py-2'>
                                
                                <span className='cursor-pointer' onClick={()=>{
                                    setAvisToEdit(avis.findIndex((data)=>{
                                        return data.ouvrage == ouvragesSelect;
                                    }));
                                    setCommentToEdit({
                                        index: index,
                                        ...comm
                                    });
                                    setModal(true);
                                }}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </span>

                                <span className='cursor-pointer'
                                onClick={()=>{
                                    setAvis(avis.map((oneAvis)=>{
                                        if(oneAvis.ouvrage === ouvragesSelect){
                                            console.log(oneAvis);
                                            oneAvis.commentaires = oneAvis.commentaires.filter((comm, indexCom)=>indexCom!==index)
                                        }
                                        return oneAvis;
                                    }));
                                }}
                                >
                                    <FontAwesomeIcon icon={faTrash}/>
                                </span>
                            </td>
                        </tr>
                        )
                    })
                }
            </tbody>
		</table>
	</div>
	)
}

export default AjouterRemarque