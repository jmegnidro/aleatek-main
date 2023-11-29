import React, {useState, useEffect} from 'react'
import LabelSelect from '../../../../../../../component/utils/LabelSelect/LabelSelect';
import LabelInput from '../../../../../../../component/utils/LabelInput/LabelInput';
import Button from '../../../../../../../component/utils/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import MiniLoader from '../../../../../../../component/utils/Loader/MiniLoader';
import image from '../../../../../../../assets/icon/image.png'
import AddCommentRVSimple from '../../../../../../../component/Modal/AddCommentRVSimple';


function EditRemarque({avis, rv}) {

    const [userConnect, setUserConnect] = useState(null);
    const [ouvrages, setOuvrages] = useState([]);
    const [ouvragesSelect, setOuvragesSelect] = useState('');
    const [errors, setErrors] = useState(null);
    const [load, setLoad] = useState(true);
    const [modal, setModal] = useState(false);

    const [success, setSuccess] = useState(false);
    const [action, setAction]  = useState(false);

    const [commentToEdit, setCommentToEdit] = useState(null);

    const [objet, setObjet] = useState('');
    const [commentaires, setCommentaires] = useState([]);

    useEffect(()=>{
        (async()=>{
            try {
                setLoad(true);
                let id = localStorage.getItem("planAffaire")
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${id}/`)
                let id_affaire = data.affaire;

                let {data:user} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/utilisateur-connecte/`);

                let {data: userDetail} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/collaborateurs/${user.id}/`);

                setUserConnect(userDetail);

                let {data: ouvragRes} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/get_ouvrage_affaire/${id_affaire}/`)

                setOuvrages(ouvragRes);
                setOuvragesSelect(avis.ouvrage);
                setObjet(avis.objet);
                setCommentaires(avis.comments);

                setLoad(false);
            } catch (error) {
                console.log(error);
                setErrors(error.toString())
            }
        })();
    }, [avis]);

    let sauvegarder = async()=>{
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/edit_avis_ouvrage/`, {
                ouvrage : ouvragesSelect,
                objet : objet,
                commentaires : commentaires,
                rv : rv,
                id_avis : avis.id
            }, {
                headers : {'Content-Type' : 'multipart/form-data'}
            });

            setSuccess(true);
            window.location.reload();
        } catch (error) {
            setErrors(toString(error))
            setAction(false);
        }
    }

    if(load)
        return <MiniLoader/>

    return (
    <div className='bg-gray-100 my-4 pb-6'>
        {modal && <AddCommentRVSimple handleClose={()=>{
            setModal(false)
        }} commentaires={commentaires} setCommentaires={setCommentaires} commentEdit={commentToEdit}/>}
        <h2 className='bg-gray-300 shadow-inner px-4 py-1'>Modifier l'avis : {avis.objet}</h2>
        <div className='mt-2'>
            {action ? <span className='text-green-600'>En cours de modification</span> : <Button action={()=>{
                sauvegarder();
            }}>Sauvegarder</Button>}
        </div>
        <div className='text-sm grid grid-cols-2 p-4 gap-4'>
            <LabelSelect col label="Ouvrage"
            value={ouvragesSelect}
            options={ouvrages.reduce((prev, curr)=>{
                let key = curr.ouvrage.libelle;
                prev[key] = curr.id;
                return prev;
            }, {})} onChange={(e)=>{
                setOuvragesSelect(parseInt(e.target.value));
            }}
            />

            <LabelInput label="Objet du controle"
            value={objet}
            onChange={(e)=>{
                setObjet(e.target.value)
            }}
            />
            <div>
                <Button
                action={()=>{
                    setCommentToEdit(null);
                    setModal(true)
                }}
                > <FontAwesomeIcon icon={faPlus}/> </Button>

            </div>
        </div>
        <table className='text-sm w-full'>
            <thead>
                <tr className='grid grid-cols-[4rem_auto_5rem_5rem]'>
                    <th className=''>A suivre</th>
                    <th className=''>Remarque</th>
                    <th className=''>Photos</th>
                    <th className=''></th>
                </tr>
            </thead>
            <tbody>

                {
                    commentaires?.map((comm, index)=>{
                        return (
                        <tr className='grid grid-cols-[4rem_auto_5rem_5rem]' key={index}>
                            <td className='flex justify-center '><input type="checkbox" name="" id="" checked={comm.asuivre} disabled/></td>
                            <td className='flex justify-center '>{comm.commentaire}</td>
                            <td className='flex justify-center '>{comm.image && <img className='w-[2rem]' src={image} alt='my_default_icon'/>}</td>
                            <td className='flex justify-evenly border-r border-gray-800 py-2'>
                                <span className='cursor-pointer' onClick={()=>{
                                    setCommentToEdit({...comm, index});
                                    setModal(true)
                                }}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </span>

                                <span className='cursor-pointer' onClick={()=>{
                                    setCommentaires(commentaires.filter((comTODelete, indexToDelete)=>indexToDelete!==index))
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

export default EditRemarque