// import React
import React from 'react';

//import components
import { ReactComponent as HelloIcon } from '../../../assets/icons/hello.svg';

//import style
import style from './Hello.module.css';

function Hello (){
    return (
        <div className={style.hello}>
            <HelloIcon
                width='300px' 
                height='300px'
            />
            <p>Hello!! choose squad to see your task</p> 
        </div>  
    );
}

export default Hello;