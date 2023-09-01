//import package
import React from 'react';

//import style
import style from './SubmitButton.module.css';

function SubmitButton ({children , width , height , disabled , backgroundColor}){
    return (
        <label 
            className={style.submit} 
            style={{
                width, 
                height,
                backgroundColor: backgroundColor,
                pointerEvents: disabled ? 'none' : 'auto', 
                opacity: disabled ? '.6' : '1'
            }}
        >
            <input 
                type='submit'
                disabled={disabled}
            />
            {children}
        </label>    
    );
}

export default SubmitButton;