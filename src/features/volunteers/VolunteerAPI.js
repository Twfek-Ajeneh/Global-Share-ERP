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


//volunteer api
export async function getVolunteers({search , level , status , position ,squad} , skip , token , signal){
    return axiosApi.get(
        `/user?skip=${skip}&take=10&search=${search}&level=${level}&status=${status}&positions=${position}&squads=${squad}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function getVolunteerById(id , token , signal){
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

export async function createVolunteer({firstName , lastName , email, password , positions , roleId} , token , signal){
    return axiosApi.post(
        '/user',
        {
            firstName, 
            lastName, 
            password, 
            email, 
            positions, 
            roleId
        },
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function updateVolunteer(id , values , token , signal){
    return axiosApi.put(
        `/user/${id}`,
        values,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function deleteVolunteer(id , token , signal){
    return axiosApi.delete(
        `/user/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function getRoles(token , signal){
    return axiosApi.get(
        `/role?skip=0&take=0`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}