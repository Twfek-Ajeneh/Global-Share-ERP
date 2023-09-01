// import React
import React from 'react';

//import components
import { ReactComponent as NotFound  } from '../../assets/icons/notFound.svg';

//import style
import style from './ErrorNotFound.module.css';

function ErrorNotFound (){
    return (
        <div className={style["not-found"]}>
            <NotFound  
                width='500px' 
                height='500px'
            />
            <p>this page is not found</p>
        </div>  
    );
}

export default ErrorNotFound;