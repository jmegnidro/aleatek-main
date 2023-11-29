import axios from "axios";

let getOneClient = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/client/' + id);
    return (await data).data;
}

export default getOneClient;