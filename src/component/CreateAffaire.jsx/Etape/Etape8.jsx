import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MiniLoader from '../../utils/Loader/MiniLoader';
import Button from '../../utils/Button/Button';

const Etape8 = ({missionSelect, setMissionSelect, create, setStringError, creating}) => {
  const [missions, setMissions] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_STARTURIBACK}/get_all_parent_mission/`);
        setMissions(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoad(false);
    };

    fetchData();
  }, []);

  useEffect(()=>{
    validate()
  }, [missionSelect]);

  let validate = () => {
    if(missionSelect.length === 0){
      setStringError("Choisissez au mois une mission");
      return;
    }
    setStringError('');
  }


  const handleCheckboxChange = (event, missionId) => {
    if (event.target.checked) {
      if (!missionSelect.includes(missionId)) {
        setMissionSelect([...missionSelect, missionId]);
      }
    } else {
      if (missionSelect.includes(missionId)) {
        setMissionSelect(missionSelect.filter((id) => id !== missionId));
      }
    }
  };

  const handleCreate = async () => {
    try {
      await create(missionSelect);
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div>
      <h2 className='text-sm font-bold text-center mb-4'>Retenir ici les missions à recopier ou à sélectionner</h2>

      {!load ? <table className='text-sm border border-gray-600 w-full'>
        <thead>
          <tr>
            <td>Sel</td>
            <td>Mission contractuelle</td>
            <td>Libellé mission contractuelle</td>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission, index) => (
            <tr key={index}>
              <td>
                <input
                  checked={missionSelect.includes(mission.id)}
                  type='checkbox'
                  onChange={(e) => handleCheckboxChange(e, mission.id)}
                  disabled={creating}
                />
              </td>
              <td>{mission.code_mission}</td>
              <td>{mission.libelle}</td>
            </tr>
          ))}
        </tbody> 
      </table> : <MiniLoader/>}

      <div className='my-2 text-end'>
        <button className='bg-green-600 rounded-lg shadow p-2 text-white' onClick={handleCreate} disabled={creating}>
          {creating ? 'En cours de creation' : 'Creer'}
        </button>
        {/* <Button action={handleCreate}>Creer</Button> */}
      </div>
    </div>
  );
};

export default Etape8;
