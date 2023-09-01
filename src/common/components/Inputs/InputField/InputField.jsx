// import React
import React from 'react';

//import components
import InputWrapper from '../InputWrapper/InputWrapper';

// import style
import style from './InputField.module.css'

function InputField ({
                children, type, name,
                placeholder, autoFocus, width, 
                height, control, errors , accept , min
            }){
    return(
        <InputWrapper name={name} label={children} errors={errors} maxWidth={width}>
            <input 
                id={name}
                className={style.input}
                type={type}
                placeholder={placeholder}
                autoFocus={autoFocus}
                accept={accept}
                style={{
                    width, 
                    height,
                    borderColor: errors?.[name] ? 'var(--error-main)' : ''
                }}
                min={min ? min : null}
                {...control}
            />
        </InputWrapper>
    );
}

export default InputField;