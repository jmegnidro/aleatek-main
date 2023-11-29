import axios from "axios";

let getOneConstructeur = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/entreprise/registration/' + id);
    return (await data).data;
}

export default getOneConstructeur;