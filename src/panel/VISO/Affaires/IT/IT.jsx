import React, { useState, useEffect } from 'react';
import mine from "../../../../assets/icon/mine.png";
import axios from 'axios';
import Button from '../../../../component/utils/Button/Button';
import ChooseCollab from '../../../../component/ChooseCollab/ChooseCollab';
import MiniLoader from '../../../../component/utils/Loader/MiniLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function IT() {
  const [missionActive, setMissionActive] = useState([]);
  const [modal, setModal] = useState(null);
  const [interventions, setInterventions] = useState({});
  const [load, setLoad] = useState(true);

  useEffect(() => {
    (async () => {
      let id = localStorage.getItem("planAffaire");
      if (id) {
        let {data:dataAffaire} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/admin/planaffaire/${id}/`)
        let { data } = await axios.get(process.env.REACT_APP_STARTURIBACK + '/mission_sign/' + dataAffaire.affaire + '/');

        let mission = await Promise.all(data.map(async dt => {
          let { data } = await axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/mission/' + dt.id_mission_id + '/');
          return {
            "id": data.id,
            "code": data.code_mission,
            "mission": data.libelle,
            "id_sign": dt.id,
          }
        }));
        setMissionActive(mission);
        setLoad(false)
      }
    })();
  }, []);

  useEffect(() => {
    const fetchInterventions = async () => {
      const interventionPromises = missionActive.map(mA =>
        axios.get(process.env.REACT_APP_STARTURIBACK + '/collab_for_mission_sign/' + mA.id_sign + '/')
      );

      try {
        const responses = await Promise.all(interventionPromises);
        const interventionsData = responses.map(response => response.data);
        const interventionsMap = {};
        missionActive.forEach((mA, index) => {
          interventionsMap[mA.id_sign] = interventionsData[index];
        });
        setInterventions(interventionsMap);
      } catch (error) {
        console.error('Error fetching interventions:', error);
      }
    };

    if (missionActive.length > 0) {
      fetchInterventions();
    }
  }, [missionActive]);

  let deleteIntervenant = async (intervenant)=>{
    await axios.delete(process.env.REACT_APP_STARTURIBACK + `/admin/intervention/technique/${intervenant.id}/`)
    window.location.reload()
  }

  return (
    <>
      {modal !== null && <ChooseCollab missonSign={modal} handleClose={() => { setModal(null) }} />}
      <div>
        <div className='w-full h-full text-sm min-h-screen flex flex-col'>
          <h1 className='border-t border-gray-400 p-1 MissionPrestationbg-green-200 font-bold'>Aleatek</h1>

          <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
            <h2 className='text-blue-800 flex items-center '>
              <img src={mine} alt="OilPump" className='w-[2rem] mr-2' />
              Intervention Technique
            </h2>
          </nav>

          {!load ? <div className='flex-grow'>
            <div className='grid grid-cols-[5rem_auto_auto] bg-gray-900 text-white'>
              <span className='p-4'>Intervenant</span>
              <span className='p-4'>Intervention</span>
              <span className='p-4'>Libelle</span>
            </div>
            {missionActive.length!==0 ? missionActive.map((mA, index) => {
              const interventionData = interventions[mA.id_sign] || [];
              return (
                <div className='mb-6' key={index}>
                  <div className='grid grid-cols-[5rem_auto_auto] bg-white'>
                    <span className='p-2'></span>
                    <span className='p-2'>{mA.code}</span>
                    <span className='p-2'>{mA.mission}</span>
                  </div>
                  <div className='flex justify-end my-1'>
                    <Button action={() => { setModal(mA.id_sign) }}>Ajouter un intervenant</Button>
                  </div>
                  <div className='flex justify-end'>
                    <table className='mr-4 bg-white'>
                      <thead>
                        <tr className='grid grid-cols-[12rem_24rem_2rem]'>
                          <th className='border border-gray-400 px-2'>Collaborateur</th>
                          <th className='border border-gray-400 px-2'>Tracabilite</th>
                          <th className='border border-gray-400 px-2'></th>
                        </tr>
                      </thead>
                      <tbody>
                        {interventionData.map((dt, index) => {
                          return (
                            <tr key={index} className='grid grid-cols-[12rem_24rem_2rem]'>
                              <td className='text-center'>{dt.collaborateur.first_name + " " + dt.collaborateur.last_name}</td>
                              <td className='px-2'>Affecte le {dt.date} par {dt.affecteur.first_name + " " + dt.affecteur.last_name}</td>
                              <td>
                                <span className='text-red-600 cursor-pointer' onClick={()=>{deleteIntervenant(dt)}}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }) : <span className='text-red-600'>Vous n'avez active aucune mission</span> }
          </div> : <MiniLoader/>}
        </div>
      </div>
    </>
  );
}

export default IT;
