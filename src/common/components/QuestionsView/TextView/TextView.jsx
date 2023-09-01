//import package
import React from 'react';

//import style
import style from './TextView.module.css';

function TextView ({ title , answer }){
    
    return (
        <div className={style.text}>
            <h2>{title}</h2>
            <div>{answer}</div>
        </div>
    );
}

export default TextView;