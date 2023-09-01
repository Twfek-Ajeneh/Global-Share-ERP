//import react
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Select , { components }from 'react-select';

//import redux
import { useSelector } from "react-redux";
import { selectAuthToken } from '../../../../features/auth/AuthSlice'

//import components
import InputWrapper from '../InputWrapper/InputWrapper';

//import style
import style from './MultiSelectInputField.module.css';

function MultiSelectInputField({
        children, width, height,
        name, options, placeholder,
        control, errors , disabled,
        required , callBack
    }){

    const token = useSelector(selectAuthToken);
    const [selectOptions , setSelectOptions] = useState([]);

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

    return(
        <InputWrapper name={name} label={children} errors={errors}>
            <Controller 
                name={name}
                control={control}
                render={({field}) => (
                    <Select 
                        inputId={name}
                        className={style['multi-select']}
                        {...field}
                        defaultValue={field.value}
                        options={selectOptions}
                        isSearchable={true}
                        placeholder={placeholder}
                        isDisabled={disabled}
                        maxMenuHeight={300}
                        classNamePrefix={'te'}
                        closeMenuOnSelect={false}
                        isMulti
                        components={{ ValueContainer }}
                        hideSelectedOptions={false}
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
                            clearIndicator: (base) => ({
                                ...base,
                                paddingRight: 0,
                                '& svg': {
                                    width: '15px',
                                    height: '15px'
                                },
                                '&:hover svg':{
                                    color: 'var(--error-main)'
                                }
                            }),
                            indicatorSeparator: (base) => ({
                                ...base,
                                display: 'none'
                            }),
                            control: (base , state) => ({
                                ...base,
                                cursor: 'pointer',
                                width: width,
                                height: height, 
                                fontSize: '15px',
                                borderRadius: '9px',
                                paddingLeft: '4px',
                                boxShadow: 'none',
                                color: state.isFocused ? 'var(--primary-main)' : 'var(--natural-alpha-2)',
                                border: state.isFocused ? '1px solid var(--primary-main)' : '0',
                                '&:hover':{
                                    border: state.isFocused ? '1px solid var(--primary-main)' : '0',
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
                                fontSize: '14px'
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
                                boxShadow: '0 0 0 1px hsl(0deg 0% 0% / 0%), 0 4px 11px hsla(0, 0%, 0%, 0.1)',
                                color: 'var(--natural-alpha-2)',
                                fontSize: '14px',
                                fontWeight: '500',
                                borderRadius: '9px',
                            }),
                            menuList: (base) => ({
                                ...base,
                                // padding: '10px',
                                display: 'grid',
                                gridTemplateColumns: selectOptions.length===0 ? 'repeat(1 , 100%)' : 'repeat(3 , 33%)',
                            }),
                            option: (base , state) => ({
                                ...base,
                                color: '',
                                backgroundColor: state.isSelected ? '' : '',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: 'none',
                                "& div":{
                                    border: state.isSelected ? '3px solid rgba(102, 204, 204, 1)' : '',
                                },
                                "&:active":{
                                    backgroundColor: 'transparent !important'
                                },
                                '&:focus-visible':{
                                    outline: 'none  !important'
                                }
                            })
                        }}
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
                            }}
                        >
                            {props.children[0][0]?.props?.data?.name}
                        </span>
                        <span
                            style={{
                                fontSize: '12px'
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

export default MultiSelectInputField;