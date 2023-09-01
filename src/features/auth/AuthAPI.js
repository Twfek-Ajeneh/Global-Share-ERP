//import axios
import axios from 'axios';

//import baseURL
import { baseURL } from '../../common/utils/baseUrl';

const axiosApi = axios.create({
    baseURL : baseURL,
    timeout: 15000,
    headers: {
        "Content-type": "application/json",
    },
});

//auth api
export async function loginRequest({email , password} , signal){
    return axiosApi.post( 
        '/auth/login', 
        { email , password }, 
        {signal: signal}
    );
}

export async function checkToken(token , signal){
    return axiosApi.get(
        '/auth/verifyToken',
        {
            signal: signal,
            headers: {
                Authorization : `Bearer ${token}`
            },
        }
    );
}