import axios from "axios";

let getOneAffaire = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/ficheaffaire/' + id);
    return (await data).data;
}

export default getOneAffaire;