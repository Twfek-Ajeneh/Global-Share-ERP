//import axios
import axios from 'axios';

//import baseURL
import {baseURL} from '../../common/utils/baseUrl';

const axiosApi = axios.create({
    baseURL : baseURL,
    timeout: 15000,
    headers: {
        "Content-type": "application/json",
    },
});

//application api
export async function getApplications(search , skip , token , signal){
    return axiosApi.get(
        `/application?skip=${skip}&take=10&search=${search}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function getApplicationById(id , token , signal){
    return axiosApi.get(
        `/application/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    );
}

export async function updateApplication(id , values , token , signal){
    return axiosApi.put(
        `/application/${id}`,
        values,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}