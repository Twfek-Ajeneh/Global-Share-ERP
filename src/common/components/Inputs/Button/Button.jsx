//import react
import React from 'react';

//import style
import style from './Button.module.css';

function Button ({children , width , height , disabled , backgroundColor , color , onClick}){
    return (
        <button
            className={style.button}
            style={{
                minWidth: width,
                height: height,
                backgroundColor: backgroundColor,
                color: color
            }}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;