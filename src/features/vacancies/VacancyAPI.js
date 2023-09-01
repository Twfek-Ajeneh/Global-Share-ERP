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

//vacancy api
export async function getVacancies(search , skip , token , signal){
    return axiosApi.get(
        `/vacancy?skip=${skip}&take=10&search=${search}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}

export async function getVacancyById(id , token , signal){
    return axiosApi.get(
        `/vacancy/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    );
}

export async function createVacancy({ effect , brief , tasks , required , preferred , positionId , questionsIds }, token , signal){
    const newPositionId = positionId?.value;
    const newQuestionsIds = questionsIds?.map((question) => {return question?.value?.value});
    return axiosApi.post(
        '/vacancy',
        { effect , brief , tasks , required , preferred , 'positionId':newPositionId , 'questionsIds':newQuestionsIds },
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function updateVacancy(id , values , token , signal){
    const newValues = {};
    for(let key of Object.keys(values)){
        if(key !== 'squad'){
            if(key==='positionId')
                newValues[key] = values[key]?.value;
            else if(key==='questionsIds')
                newValues[key] = values[key]?.map((question) => {return question?.value?.value});
            else
                newValues[key] = values[key];
        }
    }
    
    return axiosApi.put(
        `/vacancy/${id}`,
        newValues,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}

export async function deleteVacancy(id , token , signal){
    return axiosApi.delete(
        `/vacancy/${id}`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    )
}