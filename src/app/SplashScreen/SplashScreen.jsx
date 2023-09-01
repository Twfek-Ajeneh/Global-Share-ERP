//import react
import React from 'react';

// import logo
import { ReactComponent as MainLogo } from '../../assets/icons/mainLogo.svg';

//import style
import style from './SplashScreen.module.css';

function SplashScreen() {
    return (
        <div className={style.splash}>
            <MainLogo 
                width='250px' 
                height='215px'
            />
        </div>
    );
}

export default SplashScreen;
