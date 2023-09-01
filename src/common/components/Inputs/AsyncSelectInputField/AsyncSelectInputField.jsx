//import react
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Select , { components } from 'react-select';

//import redux
import { useSelector } from "react-redux";
import { selectAuthToken } from '../../../../features/auth/AuthSlice';

//import components
import InputWrapper from '../InputWrapper/InputWrapper';

//import style
import style from './AsyncSelectInputField.module.css';

function AsyncSelectInputField({
        children, width, height,
        name, defaultOptions , placeholder,
        control, errors , disabled,
        required , border , menuHeight,
        isMulti, placement , callBack
    }){
    
    const token = useSelector(selectAuthToken);

    const [
        selectOptions, 
        setSelectOptions
    ] = useState(() => [].concat(defaultOptions?.map(item => ({'value': item , "label": item}))));

    let borderColor = 'transparent';
    if(border) borderColor = 'var(--border-color)';
    if(errors && errors[name]) borderColor = 'var(--error-main)';

    useEffect(() => {
        const controller = new AbortController();
        callBack({
            token: token, 
            signal: controller.signal
        }).then(options => {
            setSelectOptions(options);
        }).catch(() => {});

        return () =>  controller.abort();  
    } , [callBack , token])

    return (
        <InputWrapper name={name} label={children} errors={errors}>
            <Controller 
                name={name}
                control={control}
                render={({field}) => (
                    <Select 
                        inputId={name}
                        className={style.select}
                        {...field}
                        defaultValue={field.value}
                        options={selectOptions}
                        isSearchable={true}
                        placeholder={placeholder}
                        isDisabled={disabled}
                        maxMenuHeight={menuHeight ? menuHeight : 300}
                        classNamePrefix={'te'}
                        // menuIsOpen={true}
                        styles={{
                            dropdownIndicator: (base) => ({
                                ...base,
                                color: 'var(--natural-alpha-2)',
                                '& svg':{
                                    width: '15px',
                                    height: '15px'
                                }
                            }),
                            indicatorSeparator: (base) => ({
                                ...base,
                                display: 'none'
                            }),
                            control: (base , state) => ({
                                ...base,
                                width: width,
                                height: height, 
                                fontSize: '15px',
                                borderRadius: '9px',
                                paddingLeft: '4px',
                                boxShadow: 'none',
                                textTransform: 'capitalize',
                                color: state.isFocused ? 'var(--primary-main)' : 'var(--natural-alpha-2)',
                                border: ((state.isFocused && borderColor!=='var(--error-main)') ? '.1rem solid var(--primary-main)' : `.1rem solid ${borderColor}`),
                                '&:hover':{
                                    border: ((state.isFocused && borderColor!=='var(--error-main)') ? '.1rem solid var(--primary-main)' : `.1rem solid ${borderColor}`),
                                },
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                color: '',
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: '',
                                fontSize: '14px'
                            }),
                            indicatorsContainer:(base) =>({
                                ...base,
                                paddingRight: '2px'
                            }),
                            placeholder:(base) => ({
                                ...base,
                                color: "var(--natural-alpha-3)",
                                fontWeight: '400',
                                fontSize: '14px',
                                textTransform: 'capitalize',
                            }),
                            input: (base) => ({
                                ...base,
                                color: 'transparent'
                            }),
                            container: (base , state) => ({
                                ...base,
                                '& + label':{
                                    color: state.isFocused ? 'var(--primary-main)' : '',
                                }
                            }),
                            menu: (base) => ({
                                ...base,
                                color: 'var(--natural-alpha-2)',
                                fontSize: '14px',
                                fontWeight: '500',
                                borderRadius: '9px',
                                boxShadow: '0 0 0 1px hsl(0deg 0% 0% / 0%), 0 4px 11px hsla(0, 0%, 0%, 0.1)'
                            }),
                            option: (base) => ({
                                ...base,
                                backgroundColor: '',
                                color: '',
                                paddingLeft:'20px',
                                textTransform:'capitalize',
                                "&:active":{
                                    backgroundColor: 'transparent !important'
                                },
                            })
                        }}
                        menuPlacement={placement}
                        isMulti={isMulti ? isMulti : false}
                        components={isMulti ? {ValueContainer} : {}}
                    />
                )}
                rules={{required: required}}
            />
        </InputWrapper>
    );
}

const ValueContainer = props => {
    let length = props.getValue().length;

    return (
        <components.ValueContainer {...props}>
            { length >= 1 ?
                (
                    <div style={{textOverflow: 'ellipsis' , overflow: 'hidden' , whiteSpace: 'nowrap'}}>
                        <span 
                            style={{
                                textTransform: 'capitalize',
                                display: 'inline',
                                fontSize: '14px'
                            }}
                        >
                            {props.children[0][0]?.props?.data?.label}
                        </span>
                        <span
                            style={{
                                fontSize: '12px',
                                display: 'inline'
                            }}
                        >
                            &nbsp;
                            { length > 1 && ` & ${length - 1} Member`}
                        </span>
                        {React.cloneElement(props.children[1])}
                    </div>
                )
                    :
                (
                    <>{props.children}</>
                )
            }
        </components.ValueContainer>
    );
};

export default AsyncSelectInputField;