//import package
import React from 'react';

//import icon & image
import {BsSquareFill , BsSquare} from "react-icons/bs";

//import style
import style from './RadioView.module.css';

function RadioView({ title , options , answer}){
    return (
        <div className={style.radio}>
            <h2>{title}</h2>
            <div className={style['options']}>
                {
                    options?.map((opt , index) =>(
                        <div key={opt+index} className={style.option}>
                            {   
                                answer?.toLowerCase()===opt?.toLowerCase() ? 
                                <BsSquareFill size='14px' color='var(--word-color)'/>
                                : <BsSquare size='14px' color='var(--word-color)'/>
                            }
                            <div>{opt}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default RadioView;