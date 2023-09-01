//import package
import React from 'react';

import {BsCheck2Square , BsSquare} from "react-icons/bs";

//import style
import style from './CheckboxView.module.css';

function CheckboxView ({title , options , answer}){
    return (
        <div className={style.checkbox}>
            <h2>{title}</h2>
            <div className={style['options']}>
                {
                    options?.map((opt , index) => (
                        <div key={opt+index} className={style.option}>
                            {
                                answer?.indexOf(opt)===-1 ? 
                                <BsSquare size='14px' color='var(--word-color)'  style={{marginLeft: '.1rem'}}/>
                                : <BsCheck2Square size='17px' color='var(--word-color)'/> 
                            }
                            <div>{opt}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default CheckboxView;