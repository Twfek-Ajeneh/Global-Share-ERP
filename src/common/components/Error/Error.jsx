// import React
import React from 'react';

//import components
import { ReactComponent as ErrorIcon } from '../../../assets/icons/error.svg';

//import style
import style from './Error.module.css';

function Error (){
    return (
        <div className={style.error}>
            <ErrorIcon 
                width='250px' 
                height='250px'
            />
            <p>We're sorry, but an unexpected error occurred. Please refresh the page and try again.</p> 
        </div>  
    );
}

export default Error;