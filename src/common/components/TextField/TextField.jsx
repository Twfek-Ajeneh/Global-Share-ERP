//import package
import React from 'react';

//import style
import style from './TextField.module.css';

function TextField ({title , value}){
    return (
        <div className={style['text-field']}>
            <div className={style.title}>{title}</div>
            <div className={style.value}>{value}</div>
        </div>
    );
}

export default TextField;