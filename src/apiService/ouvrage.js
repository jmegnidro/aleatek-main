import axios from "axios";

let getOneOuvrage = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/ouvrages/' + id);
    return (await data).data;
}

export default getOneOuvrage;