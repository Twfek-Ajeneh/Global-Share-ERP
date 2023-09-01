// import React
import React from 'react';

//import components
import { CircularProgress } from '@mui/material';

//import style
import style from './Loader.module.css';

function Loader ({transparent}){
    return (
        <div className={style.loader} style={{backgroundColor: transparent ? 'transparent' : null}}>
            <CircularProgress 
                size='35px' 
                thickness={2} 
                sx={{
                    color: 'var(--primary-main)',
                }}
            />
        </div>
    );
}

export default Loader;