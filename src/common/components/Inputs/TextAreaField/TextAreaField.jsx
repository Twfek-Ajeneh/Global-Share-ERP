//import react
import React from 'react';

//import components
import InputWrapper from '../InputWrapper/InputWrapper';

//import style
import style from './TextAreaField.module.css';

function TextAreaField ({
            children , name,
            placeholder , width, 
            height, control, errors
    }){
    return (
        <InputWrapper name={name} label={children} errors={errors} maxWidth={width}>
            <textarea 
                id={name}   
                className={style['text-area']}
                placeholder={placeholder}
                style={{
                    width, 
                    height,
                    borderColor: errors?.[name] ? 'var(--error-main)' : ''
                }}
                {...control}
            />
        </InputWrapper>
    );
}

export default TextAreaField;