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

//task api
export async function getTasks(skip , token , signal){
    return axiosApi.get(
        `/task?skip=${skip}&take=0&difficulty=&priority=&assignedTo=&search=`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function getTaskById(id , token , signal){
    return axiosApi.get(
        `/task/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    );
}

export async function getTasksBySquad({search , difficulty , priority , member ,  squadId} , skip , token , signal){
    const newSquad = squadId?.value;
    const newDifficulty = difficulty?.map(item => item.value?.toUpperCase()).join(','); 
    const newPriority = priority?.map(item => item.value?.toUpperCase()).join(',');
    const newMember = member?.map(item => item.value).join(',');
    const newSearch = search

    return axiosApi.get(
        `/task/squad/${newSquad}?skip=${skip}&take=0&difficulty=${newDifficulty}&priority=${newPriority}&assignedTo=${newMember}&search=${newSearch}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function createTask({
        title, description, url, 
        deadline, priority, difficulty, 
        statusId, assignedToId, assignedById
    } , token , signal){

    return axiosApi.post(
        '/task',
        {
            title,
            description,
            url,
            deadline,
            priority,
            difficulty,
            statusId,
            assignedById,
            assignedToId
        },
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function updateTask(id , values , token , signal){
    return axiosApi.put(
        `/task/${id}`,
        values,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function deleteTask(id , token , signal){
    return axiosApi.delete(
        `/task/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

//status api
export async function getStatuses(token , signal){
    return axiosApi.get(
        '/status?skip=0&take=0',
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function getStatusById(id , token , signal){
    return axiosApi.get(
        `/status/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function getStatusesBySquad(squadId , token , signal){
    return axiosApi.get(
        `/status/squad/${squadId}?skip=0&take=0`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function createStatus({name , squadId} , token , signal){
    return axiosApi.post(
        'status',
        {name , squadId},
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function updateStatus(id , values , token , signal){
    return axiosApi.put(
        `status/${id}`,
        values,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function deleteStatus(id , token , signal){
    return axiosApi.delete(
        `status/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}


//comment api
export async function getComments(token , signal){
    return axiosApi.get(
        '/comment?skip=0&take=0',
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function getCommentById(id , token , signal){
    return axiosApi.get(
        `/comment/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function createComment({content , taskId} , token , signal){
    return axiosApi.post(
        '/comment',
        {content , taskId},
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function updateComment(id , values , token , signal){
    return axiosApi.put(
        `/comment/${id}`,
        values,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function deleteComment(id , token , signal){
    return axiosApi.delete(
        `/comment/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}