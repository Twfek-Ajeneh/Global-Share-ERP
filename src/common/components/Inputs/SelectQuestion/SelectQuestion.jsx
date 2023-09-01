// import React
import React from 'react';

//import components
import InputWrapper from '../InputWrapper/InputWrapper';

// import style
import style from './SelectQuestion.module.css'

function SelectQuestion ({
                children, name ,type,
                width, height, control, errors , accept , options
            }){

    return(
        <InputWrapper name={name} label={children} errors={errors} maxWidth={width}>
            <div className={style.checkbox}>
                {
                    options?.map((option,index) => {
                        return <div className={style.option} key={`option${index}`}>
                            <label>{option}</label>
                            <input 
                                id={option}
                                className={style.input}
                                value={option}
                                type={type}
                                placeholder={option}
                                accept={accept}
                                style={{
                                    borderColor: errors?.[name] ? 'var(--error-main)' : ''
                                }}
                                {...control}
                            />
                        </div>
                            
                    })
                }
            </div>
        </InputWrapper>
    );
}

export default SelectQuestion;