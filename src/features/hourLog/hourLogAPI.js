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

//hour log api
export async function getHourLog({search , squadId} , skip , token , signal){
    return axiosApi.get(
        `/task?skip=${skip}&take=10&difficulty=&priority=&assignedTo=&search=${search}&squad=${squadId}&status=Approved`,
        {
            signal : signal,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        }
    );
}