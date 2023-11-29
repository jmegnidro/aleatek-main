import axios from "axios";

let getOneDestination = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/ouvrage/destinations/' + id);
    return (await data).data;
}

export default getOneDestination;