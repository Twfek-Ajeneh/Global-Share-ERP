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

//selector api
export async function getSquadsData({signal , setIsError}){
    const squads = [];
    try{
        const response = await axiosApi.get(
            `public/squads?skip=0&take=0`,
            {
                signal : signal,
            }
        ); 
        response?.data?.data?.forEach(squad => {
            squads.push({
                gsName: squad.gsName ,
                name: squad.name ,
                img: squad.imageUrl,
                positions: squad?.positions?.map((position) => {
                    return position;
                }),
                isOpen: false,
                hasVacancies: squad.hasVacancies
            });
        });
        return squads;
    }catch(error){
        setIsError(true);
    }
    return squads;
}

//selector api
export async function postFeedback({values ,signal}){
    try{
        const response = axiosApi.post(
            '/public/feedback',
            {'name':values.name , 'email': values.email, 'body': values.message},
            {
                signal : signal,
            }
        );
        return response;
    }catch(error){
        // console.log('filed to send feedback');
    }
}

export async function getVacancyByIdData({vacancyId , signal , setIsError}){ 
    const vacancy = {};
    try{
        const response = await axiosApi.get(
            `/public/vacancy/${vacancyId}?skip=0&take=0`,
            {
                signal : signal,
            }
        );
        return response.data;
    }catch(error){
        setIsError(true);
    }
    return vacancy;
}

export async function getQuestionsByVacancyIdData({vacancyId , signal , setIsError}){ 
    const questions = [];
    try{
        const response = await axiosApi.get(
            `/public/vacancy/${vacancyId}?skip=0&take=0`,
            {
                signal : signal,
            }
        );
        return response.data;
    }catch(error){
        setIsError(true);
    }
    return questions;
}

export async function createApply({values , signal}){
    const formData = new FormData();
    formData.append('vacancyId' , values['vacancyId']);
    formData.append('email' , values['email']);
    formData.append('answers' , JSON.stringify(values['answers']));
    values?.files?.forEach(file => {
        formData.append('files' , file);
    })

    try{
        const response = axiosApi.post(
            '/public/apply',
            formData,
            {
                signal : signal,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response;
    }catch(error){
        // console.log('filed to send feedback');
    }
}
