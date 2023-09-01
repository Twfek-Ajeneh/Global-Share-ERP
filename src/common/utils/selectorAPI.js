//import axios
import axios from 'axios';

//import component
import { Avatar } from '@mui/material';

//import baseURL
import {baseURL} from '../../common/utils/baseUrl';

const axiosApi = axios.create({
    baseURL : baseURL,
    timeout: 15000,
    headers: {
        "Content-type": "application/json",
    },
});

const randomColor = ['blueviolet' , 'cadetblue' , 'cornflowerblue' , 'darkcyan' , 'darkorchid' , 'grey' , 'purple']

//selector api

//to get all the squad in system
export async function getSquadsData({token , signal}){
    const options = [];
    try{
        const response = await axiosApi.get(
            `/squad?skip=0&take=0&search=`,
            {
                signal : signal,
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            }
        ); 
        response.data.data.forEach(squad => {
            options.push({value: squad.id , label: squad.gsName});
        });
        return options;
    }catch(error){
        // console.log('filed to load squad option');
    }
    return options;
}

//to get all the position in a particular squad
export async function getPositionDataBySquad({squadId , token , signal}){ 
    const options = [];
    if(!squadId || squadId==='') return options; 
    try{
        const response = await axiosApi.get(
            `/position?skip=0&take=0&search=&level=&squads=${squadId}`,
            {
                signal : signal,
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            }
        );
        response.data.data.forEach(position => {
            options.push({value: position.id , label: position.name});
        });
        return options;
    }catch(error){
        // console.log('filed to load position options')
    }
    return options;
}

//to get all the roles in system
export async function getRolesData({token , signal}){
    const options = [];
    try{
        const response = await axiosApi.get(
            `/role?skip=0&take=0`,
            {
                signal : signal,
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            }
        ); 
        response.data.forEach(role => {
            options.push({value: role.id , label: role.name});
        });
        return options;
    }catch(error){
        // console.log('filed to load role option');
    }
    return options;
}

//to get all the question in system
export async function getQuestionsData({token , signal}){
    const options = [];
    try{
        const response = await axiosApi.get(
            `/question?skip=0&take=0&search=`,
            {
                signal : signal,
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            }
        ); 
        response.data.data.forEach(question => {
            options.push({
                value: question.id, 
                label: question.text?.toLowerCase() + ' - ' + question.type?.toLowerCase()
            });
        });
        return options;
    }catch(error){
        // console.log('filed to load questions');
    }
    return options;
}

//to get all the member in particular squad
export async function getMemberData({squadId , token , signal}){
    const options = [];
    if(!squadId || squadId==='') return options; 
    try{
        const response = await axiosApi.get(
            `/user?skip=0&take=0&search=&level=&status=&positions=&squads=${squadId}`,
            {
                signal : signal,
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            }
        );
        response.data.data.forEach(user => {
            options.push({
                value: user.id, 
                name: user.firstName, 
                label: <Avatar 
                            alt={user.firstName} 
                            sx={{ 
                                width: 30, 
                                height: 30, 
                                backgroundColor: randomColor.at((user.id)%7)
                            }} 
                        >
                            {user.firstName?.at(0)}
                        </Avatar>
            })
        });
        return options;
    }catch(error){
        // console.log('filed to load member options')
    }
    return options;
}

//to get all the users email in system
export async function getUsersEmail({token , signal}){
    const options = [];
    try{
        const response = await axiosApi.get(
            `/user?skip=0&take=0&search=&level=&status=&positions=&squads=`,
            {
                signal : signal,
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            }
        ); 
        response.data.data.forEach(user => {
            options.push({value: user.email , label: user.email});
        });
        return options;
    }catch(error){
        // console.log('filed to load users option');
    }
    return options;
}

//to get all the member in squad that we can assign task to them
export async function getAssignableMember({squadId , token , signal}){
    const options = [];
    if(!squadId || squadId==='') return options; 
    try{
        const response = await axiosApi.get(
            `/user?skip=0&take=0&squads=${squadId}&search=&level=&status=&positions=`,
            {
                signal : signal,
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            }
        );
        response.data.data?.forEach(user => {
            options.push({
                value: user.id, 
                label: user.firstName + " " + user.lastName
            });
        });
        return options;
    }catch(error){
        // console.log('filed to load member options')
    }
    return options;
}