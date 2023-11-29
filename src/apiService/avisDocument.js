import axios from "axios";

let getOneAvisDoc = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/avis/document/' + id);
    return (await data).data;
}

export default getOneAvisDoc;