import React, {useState, useEffect} from 'react';
import LabelInput from '../../../../../component/utils/LabelInput/LabelInput';
import LabelSelect from '../../../../../component/utils/LabelSelect/LabelSelect';
import MiniLoader from '../../../../../component/utils/Loader/MiniLoader';
import axios from 'axios';
import Datepicker from 'tailwind-datepicker-react';
import moment from 'moment';
import Button from '../../../../../component/utils/Button/Button';
import Flash from '../../../../../component/utils/Flash/Flash';

const Detail = ({data, setData}) => {
    const [load, setLoad] = useState(true);

    const [destinations, setDestinations] = useState([]);
    const [destinationSelect, setDestinationSelect] = useState([]);

    const [responsables, setResponsables] = useState([]);

    const [datePickerPrestation, setDatePickerPrestation] = useState(false)
    const [datePickerDebut, setDatePickerDebut] = useState(false)
    const [datePickerFin, setDatePickerFin] = useState(false)  

    const [errors, setErrors] = useState(null);
    const [flash, setFlash] = useState(false);
    const [success, setSuccess] = useState(false);
    const [action, setAction] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          const response = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/batiment/');
          const dataEntreprise = response.data.results;

          let {data:dataRespo} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/collaborateurs/');

          setResponsables(dataRespo.results);
          setDestinations(dataEntreprise);
          setDestinationSelect(data.batiment.id);
          setLoad(false);
        };
    
        fetchData();
    
    }, []);

    let enregistrer = async ()=>{
        console.log("Done");
        try {
            await axios.put(process.env.REACT_APP_STARTURIBACK + `/edit_plan_affaire/${data.id}/`, {
                ...data,
                destinationSelect,
            }, {withCredentials:true});
            setSuccess(true);
            window.location.reload();
        } catch (error) {
            setErrors(error.toString());
            setFlash(true);
            setAction(false);
        }
    }

    return (
    <>
        {flash && <Flash setFlash={setFlash}>{errors}</Flash> }
        {success && <Flash type={"success"} setFlash={setSuccess}>Modification effectué avec success</Flash>}
        <div className='m-1'>
            {!action ? <Button action={()=>{
                setAction(true);
                enregistrer();
            }}>Sauvegarder</Button> : <span className='text-green-600'>Operation en cours de traimeent</span> }
        </div>
        
        <div className='border border-black m-1'>
        <div className='flex flex-wrap'>
            <LabelInput disabled value={data.numero} label="N Plan Affaire" />
            <LabelInput value={data.libelle} label="Libelle Plan Affaire" onChange={(e)=>{
                setData({...data, libelle : e.target.value})
            }}/>
            <LabelSelect
                label="Risque"
                value={data.risque}
                onChange={(e) => {
                    setData({...data, risque : e.target.value})
                }}
                options={{
                'Normal': 'Normal',
                'Particulier': 'Particulier',
                'Complexe': 'Complexe',
                }}
            />        
        </div>
      </div>
      <div className='m-1 border border-gray-600 p-1'>
        <div className='flex gap-8 m-1'>
            { !load ? <LabelSelect value={destinationSelect} label="Destination" onChange={(e)=>{
                setDestinationSelect(e.target.value);
            }}
            options={destinations.reduce((prev, curr) => {
                let key = curr.libelle;
                prev[key] = curr.id;
                return prev;
            }, {})}/> : <MiniLoader/> }
            <LabelSelect
                label="Type d'affaire"
                value={data.type}
                onChange={(e) => {
                    setData({...data, type: e.target.value})
                }}
                options={{
                    'CTC': 'CTC',
                    'VT': 'VT',
                }}
            />
        </div>
        {/* <LabelInput disabled value={data.charge_affaire.first_name + " " + data.charge_affaire.last_name} label="Charge affaire"/> */}
        
        { !load ? <LabelSelect value={data.affaire.charge} label="Charge d'affaire" onChange={(e)=>{
            setData({...data, affaire : {...data.affaire, charge : e.target.value}})
        }}
        options={responsables.reduce((prev, curr) => {
            let key = curr.first_name + " " + curr.last_name;
            prev[key] = curr.id;
            return prev;
        }, {})}/> : <MiniLoader/> }

        <div className='flex justify-between my-1'>
          <div className=''>
            <LabelInput value={data.prix} label="Montant des travaux" onChange={(e)=>{
                setData({...data, prix : e.target.value})
            }}/>
            <div className='flex gap-6 text-md ml-1'>
              {/* <span>{data.devise}</span>
              <span>{data.type_montant}</span> */}
                <LabelSelect
                    label="Devise"
                    value={data.devise}
                    onChange={(e) => {
                        setData({...data, devise: e.target.value})
                    }}
                    options={{
                        '€': '€',
                        '$': '$',
                    }}
                />
                <LabelSelect
                    label="Type de montant"
                    value={data.type_montant}
                    onChange={(e) => {
                        setData({...data, type_montant: e.target.value})
                    }}
                    options={{
                        'HT': 'HT',
                        'TTC': 'TTC',
                    }}
                />
            </div>
          </div>
        </div>
      </div>

      <div className='m-1 grid grid-cols-3 gap-2'>
        <div className='border border-gray-600 col-span-1 p-1'>
            <div className='my-4'>
                <label htmlFor="">Date debut Prestation</label>
                <Datepicker options={{
                    language:'fr',
                    defaultDate: data.debut_prestation && new Date(data.debut_prestation)
                }} show={datePickerPrestation} setShow={()=>{setDatePickerPrestation(!datePickerPrestation)}} onChange={(date) => {
                    setData({...data, 'debut_prestation' : moment(date).format('YYYY-MM-DD')})
                }}/>
            </div>
            
            <div className='my-4'>
                <label htmlFor="">Date de debut du chantier</label>
                <Datepicker options={{
                    language:'fr',
                    defaultDate: data.debut_chantier && new Date(data.debut_chantier)
                }} show={datePickerDebut} setShow={()=>{setDatePickerDebut(!datePickerDebut)}} onChange={(date) => {
                    setData({...data, 'debut_chantier' : moment(date).format('YYYY-MM-DD')})
                }}/>
            </div>
            
            <div className='my-4'>
                <label htmlFor="">Date de fin du chantier</label>
                <Datepicker options={{
                    language:'fr',
                    defaultDate: data.fin_chantier && new Date(data.fin_chantier)
                }} show={datePickerFin} setShow={()=>{setDatePickerFin(!datePickerFin)}} onChange={(date) => {
                    setData({...data, 'fin_chantier' : moment(date).format('YYYY-MM-DD')})
                }}/>
            </div>
          <LabelInput value={data.doc} type="number" label="Nb document a examiner" onChange={(e)=>{
            setData({...data, doc : e.target.value})
          }}/>
        </div>

        <div className='border border-gray-600 col-span-2 p-1'>
          <div className='my-1 flex flex-col'>
            <LabelInput value={data.risque} label="Risque" onChange={(e)=>{
                setData({...data, risque : e.target.value})
            }}/>
            <div className='flex items-center gap-4'>
              <span>Nb prevus:</span>
              <div className='flex items-center'>
                <LabelInput value={data.visite} label="Visite/Reunion" type="number" onChange={(e)=>{
                    setData({...data, visite : e.target.value})
                }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Detail;
