import React, { useEffect, useState } from 'react';
import books from '../../../../../assets/icon/books.png'
import Tabs from '../../../../../component/utils/Tabs/Tabs';
import Chapitre from './SubStepRICT/Chapitre';
import Renseignement from './SubStepRICT/Renseignement';
import DescriptionSommaire from './SubStepRICT/DescriptionSommaire';
import Button from '../../../../../component/utils/Button/Button';
import axios from 'axios';
import MiniLoader from '../../../../../component/utils/Loader/MiniLoader';
import moment from 'moment';
import DescriptionBatiment from './SubStepRICT/DescriptionBatiment';
import Flash from '../../../../../component/utils/Flash/Flash';
import Livrable from './SubStepRICT/Livrable';
import DocumentConception from './SubStepRICT/DocumentConception';

function RICT() {

  const [rict, setRict] = useState(null);
  const [rictList, setrictListe] = useState(null)
  const [load, setLoad] = useState(true);
  const [action, setAction] = useState(false);
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [affaire, setAffaire] = useState(null)

  useEffect(()=>{
    (async()=>{
      let {data:dataAffaire} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${localStorage.getItem("planAffaire")}/`)
      setAffaire(dataAffaire.affaire)
      let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/check_RICT_for_affaire/${dataAffaire.affaire}/`);
	  if(data.length == 1){
		setRict(data[0])
	  }
	  else{
		setRict(null)
		setrictListe(data)
	  }
      setLoad(false);
    })();
  }, []);

    let valider = async ()=>{
        try {
            let {data} = await axios.put(process.env.REACT_APP_STARTURIBACK + `/valider_rict/${rict.id}/`)
            
            if (data['validate']) {
                setSuccess("RICT valider")
                window.location.reload();
            }else{
                setErrors("Vous devez avoir au moins une mission valider pour ce RICT");
            }
        } catch (error) {
            setErrors(error.toString());
        }
	}

    let devalider = async ()=>{
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/rict/${rict.id}/`,
            {
                date : moment().format('YYYY-MM-DD'),
                affaire : affaire,
                statut : 0
            })
            setSuccess("RICT devalider avec success")
        } catch (error) {
            setAction(false)
            setErrors(error.toString())
        }
        window.location.reload();
    }

	let classer = async ()=>{
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/admin/rict/${rict.id}/`,
            {
                date : moment().format('YYYY-MM-DD'),
                affaire : affaire,
                statut : 2
            })
            setSuccess("RICT classe avec success")
        } catch (error) {
            setAction(false)
            setErrors(error.toString())
        }
        window.location.reload();
    }

    let reviser = async ()=>{
        try {
            await axios.get(process.env.REACT_APP_STARTURIBACK + `/reviser_rict/${rict.id}/`)
            setSuccess("RICT reviser avec success")
        }
        catch (error) {
            setAction(false)
            setErrors(error.toString())
        }
        window.location.reload();
    }

    let create = async()=>{
        try {

            if(rictList.length > 0){
                let testRictEnCours = rictList.filter(item=>item.statut == 0)
                if(testRictEnCours.length > 0){
                    setErrors("Vous avez deja un RICT en cours")
                    setAction(false)
                    return
                }
            }else{
                if(rict && rict.statut == 0){
                    setErrors("Vous avez deja un RICT en cours")
                    setAction(false)
                    return
                }
            }

            await axios.post(process.env.REACT_APP_STARTURIBACK + `/admin/rict/`,
            {
                date : moment().format('YYYY-MM-DD'),
                affaire : affaire,
                statut : 0
            })
            
            setSuccess("RICT cree avec success")
        
        } catch (error) {
            setAction(false)
            setErrors(error.toString())
        }
        window.location.reload();
    }

  if(load)
    return <MiniLoader/>

  return (
    <div className='w-full h-full'>
      {errors && <Flash setFlash={setErrors}>{errors}</Flash>}
      {success && <Flash type="success" setFlash={setSuccess}>{success}</Flash>}
      <h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>
      <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
        <h2 className='text-blue-800 flex items-center'>
          <img src={books} alt="OilPump" className='w-[2rem]'/>
          Rapport Initiaux de Controle Technique
        </h2>
      </nav>

      <div className='m-4 bg-white p-4'>
        {rict ? <div className='grid grid-cols-2 gap-4'>
          <div>
            <span className='w-[8rem] font-bold inline-block'>Numero</span>
            <span> : {rict.id}</span>
          </div>
          <div>
            <span className='w-[8rem] font-bold inline-block'>Date</span>
            <span> : {rict.date}</span>
          </div>
          <div>
            <span className='w-[8rem] font-bold inline-block'>Titre</span>
            <span> : Rapport Initial de Controle Technique</span>
          </div>
          <div>
            <span className='w-[8rem] font-bold inline-block'>Statut</span>
            <span> : {["En cours", "Accepte", "Classe", "Diffuse"][rict.statut]}</span>
          </div>
        </div>
        : (!action ? 
		<>
			<Button action={()=>{
			setAction(true)
			create()
			}}>Creer RICT</Button>

			<table className='w-full my-4'>
				<thead>
					<tr>
						<th className='border border-gray-600'>id</th>
						<th className='border border-gray-600'>date</th>
						<th className='border border-gray-600'>statut</th>
					</tr>
				</thead>
				<tbody>
				{
					rictList && rictList.map((item, index)=>{
						return (
							<tr key={index} className={`${index%2==0?'bg-cyan-50' : 'bg-blue-50'} cursor-pointer`} onClick={()=>{
								setRict(item)
								setrictListe(null)
							}}>
								<td>{item.id}</td>
								<td>{item.date}</td>
								<td>{["En cours", "Accepte", "Classe", "Diffuse"][item.statut]}</td>
							</tr>
						)
					})
				}
				</tbody>
			</table>
		</>
		
		: <span className='text-orange-600'>RICT en cours de creation</span> )
        }
        {rict && <div className='mt-4'>
            { rict.statut == 0 ?
            <Button action={()=>{
                valider();
            }}>Valider</Button> : 
            (rict.statut < 2 ?
            <>
                <Button action={()=>{
					devalider();
				}}>Devalider</Button>
                <Button action={()=>{
                    reviser()
                }}>Reviser</Button>
                <Button action={()=>{
					classer()
				}}>Classe</Button>
            </> : "")
            }
        </div>}
      </div>

      {rict && <div>
        <Tabs tabs={[
            {title : "Chapitre", content : <Chapitre rict={rict}/>},
            {title : "Renseignement Generaux", content : <Renseignement/>},
            {title : "Description Sommaire", content : <DescriptionSommaire rict={rict}/>},
            {title : "Description Batiment", content : <DescriptionBatiment rict={rict}/>},
            {title : "Documents en Conception", content : <DocumentConception rict={rict}/>},
			{title : "Livrable", content: <Livrable rict={rict}/>},
        ]}/>
      </div>}

    </div>
  )
}

export default RICT