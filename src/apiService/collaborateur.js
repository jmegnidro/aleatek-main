import axios from "axios";

let getOneCollaborateur = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/collaborateurs/' + id);
    return (await data).data;
}

export default getOneCollaborateur;