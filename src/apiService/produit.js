import axios from "axios";

let getOneProduct = async (id) => {
    let data = axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/product/' + id);
    return (await data).data;
}

export default getOneProduct;