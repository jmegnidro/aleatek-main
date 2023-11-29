import axios from "axios";

let getOneService = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/services/' + id);
    return (await data).data;
}

export default getOneService;