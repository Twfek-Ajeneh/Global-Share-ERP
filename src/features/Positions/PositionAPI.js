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


//position api
export async function getPositions({search , level , squad} , skip , token , signal){
    return axiosApi.get(
        `/position?skip=${skip}&take=10&search=${search}&level=${level}&squads=${squad}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function getPositionById(id , token , signal){
    return axiosApi.get(
        `/position/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    );
}

export async function createPosition({name , gsName , weeklyHours , gsLevel , squadId , jobDescription} , token , signal){
    const formData = new FormData();
    formData.append('name' , name);
    formData.append('gsName' , gsName);
    formData.append('gsLevel' , gsLevel);
    formData.append('weeklyHours' , weeklyHours);
    formData.append('squadId' , squadId);
    formData.append('jobDescription' , jobDescription);

    return axiosApi.post(
        '/position',
        formData,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    );
}

export async function updatePosition(id, values , token , signal){
    const formData = new FormData();
    for(let key of Object.keys(values)){
        formData.append(key , values[key]);
    }
    return axiosApi.put(
        `/position/${id}`,
        formData,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    )
}

export async function deletePosition(id , token , signal){ 
    return axiosApi.delete(
        `/position/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}