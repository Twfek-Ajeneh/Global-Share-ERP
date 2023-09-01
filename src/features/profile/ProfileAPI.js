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


//profile api
export async function getMyProfileDetails(token , signal){
    return axiosApi.get(
        '/user/profile',
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    );
}

export async function getProfileDetailsById(id , token , signal){
    return axiosApi.get(
        `/user/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    )
}

export async function updateMyProfileDetails(values, token , signal){
    const formData = new FormData();
    for(let key of Object.keys(values)){
        formData.append(key , values[key]);
    }

    return axiosApi.put(
        '/user',
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