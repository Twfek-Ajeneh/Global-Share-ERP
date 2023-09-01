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

//question api
export async function getQuestions(search , skip , token , signal){
    return axiosApi.get(
        `/question?skip=${skip}&take=10&search=${search}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function getQuestionById(id , token , signal){
    return axiosApi.get(
        `/question/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    );
}

export async function createQuestion({text , type , options} , token , signal){
    return axiosApi.post(
        '/question',
        {text , type , options},
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function updateQuestion(id , values , token , signal){
    return axiosApi.put(
        `/question/${id}`,
        values,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function deleteQuestion(id , token , signal){
    return axiosApi.delete(
        `/question/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}