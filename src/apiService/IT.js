import axios from "axios";

let getOneIT = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/intervention/technique/' + id);
    return (await data).data;
}

export default getOneIT;