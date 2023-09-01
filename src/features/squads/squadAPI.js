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


//squad api
export async function getSquads(search , skip , token , signal){
    return axiosApi.get(
        `/squad?skip=${skip}&take=10&search=${search}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );  
}

export async function getSquadById(id , token , signal){
    return axiosApi.get(
        `/squad/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    );
}

export async function createSquad({name , gsName , description , image} , token , signal){
    const formData = new FormData();
    formData.append('name' , name);
    formData.append('gsName' , gsName);
    formData.append('description' , description);
    formData.append('image' , image);

    return axiosApi.post(
        '/squad',
        formData,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        }
    );
}

export async function updateSquad(id , values , token , signal){
    const formData = new FormData();
    for (const key of Object.keys(values)) {
        formData.append(key , values[key]);
    }

    return axiosApi.put(
        `/squad/${id}`,
        formData,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        }
    );
}

export async function deleteSquad(id , token , signal){
    return axiosApi.delete(
        `/squad/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    )
}