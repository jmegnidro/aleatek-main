import axios from "axios";

let getOneMission = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/missions/' + id);
    return (await data).data;
}

export default getOneMission;