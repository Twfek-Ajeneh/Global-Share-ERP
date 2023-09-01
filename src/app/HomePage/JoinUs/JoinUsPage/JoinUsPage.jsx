//import react
import React , {useState , useEffect} from 'react';
import { useNavigate  } from 'react-router-dom';
import { useParams } from 'react-router';
import { Controller } from "react-hook-form";

// import API 
import { getVacancyByIdData } from '../../homAPI'


// import Components 
import Button from '../../../../common/components/Inputs/Button/Button'
import Loader from '../../../../common/components/Loader/Loader';
import Error from '../../../../common/components/Error/Error';

// import icons 
import {ReactComponent as MainLogo } from '../../../../assets/icons/mainLogo.svg';
import {ReactComponent as TitleLogo} from '../../../../assets/icons/title.svg';

//import style
import style from './JoinUsPage.module.css';

function JoinUsPage (){
    const {vacancyId : id} = useParams();
    const nav = useNavigate();

    const [isLoading , setIsLoading] = useState(true);
    const [isError , setIsError] = useState(false);
    const [vacancy , setVacancy] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);

        const controller = new AbortController();
        getVacancyByIdData({
            vacancyId: id,
            signal: controller.signal,
            setIsError: {setIsError}
        }).then(vacancy => {
            setVacancy(vacancy);
        }).catch(() => {
            setIsError(true);
        });
        
        setIsLoading(false);
        return () =>  controller.abort();  
    } , [])

    if(isLoading){
        return(
            <div style={{display: 'flex' , alignItems:'center' , justifyContent: 'center' , height: '100vh'}}>
                <Loader></Loader>
            </div>
        )
    }
    
    if(isError){
        return (
            <div className={style['error-page']}>
                <Error/>
            </div>
        )
    }
    
    return (
        <div className={style['join-us-page']}>
            <div className={style.header}>
                <div className={style.logo} onClick={() => nav('/home')}>
                    <MainLogo/>
                    <TitleLogo/>
                </div>
            </div>
            <div className={style['first-section']}>
                <h1>{vacancy?.position?.name}</h1>
                <div className={style.info}>
                    <div>
                        <span>The title, according to GS's terminology: </span> {vacancy?.position?.gsName + ' ' + vacancy?.position?.gsLevel}
                    </div>
                    <div>
                        <span>Location: </span>Online
                    </div>
                    <div>
                        <span>Type: </span>Voluntary.
                    </div>
                    <div>
                        <span>Weekly hours needed: </span> {vacancy?.position?.weeklyHours} Hours or more.
                    </div>
                </div>
            </div>
            <div className={style['second-section']}>
                <div className={style.card}>
                    <h2>Brief</h2>
                    <p>{vacancy?.brief}</p>
                </div>
                <div className={style.card}>
                    <h2>Tasks</h2>
                    <p>{vacancy?.tasks}</p>
                </div>
                <div className={style.card}>
                    <h2>Qualifications Required</h2>
                    <p>{vacancy?.required}</p>
                </div>
                <Button 
                    width='150px' 
                    height='40px' 
                    color="white" 
                    backgroundColor="var(--primary-main)" 
                    onClick={() => nav(`/apply/${id}`)}
                >
                    Apply Now
                </Button>
            </div>
        </div>
    );
}

export default JoinUsPage;