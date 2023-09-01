// import react
import React , { useState }  from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useDispatch } from 'react-redux';
import {createEmail} from '../../EmailSlice';
import { showMessage } from '../../../snackBar/snackBarSlice';

// import components 
import InputField from '../../../../common/components/Inputs/InputField/InputField';
import SelectInputField from "../../../../common/components/Inputs/SelectInputField/SelectInputField";
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import TextAreaField from '../../../../common/components/Inputs/TextAreaField/TextAreaField'
import Loader from '../../../../common/components/Loader/Loader';
import AsyncSelectInputField from '../../../../common/components/Inputs/AsyncSelectInputField/AsyncSelectInputField';

// import icons
import { IoCloseOutline } from "react-icons/io5";

//import static data request
import {getUsersEmail} from '../../../../common/utils/selectorAPI'

//import static data
import {recruitmentStatusData} from '../../../../common/utils/selectorData'

//import style 
import style from './AddEmail.module.css';

function AddEmail({handleClose}) {
    const dispatch = useDispatch();
    const {control , register , formState : {errors} , handleSubmit} = useForm({
        defaultValues:{
            title : '',
            body: '',
            recruitmentStatus : null,
            cc : [],
        }
    })

    const [isLoading , setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(createEmail({
                title: values.title,
                body: values.body,
                recruitmentStatus: values.recruitmentStatus?.value?.toUpperCase(),
                cc: values.cc?.map(email => email?.value)?.join(',')
            })).unwrap();
            dispatch(showMessage({message: 'Email Added successfully' , severity: 1}));
            handleClose();
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading===true){
        return (
            <div className={style["add-email"]}>
                <Loader  transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style["add-email"]}>
            <div className={style["add-email-header"]}>
                <h2>Add Email</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["add-email-body"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.box}>
                    <SelectInputField
                        width='300px'
                        height='40px'
                        name='recruitmentStatus'
                        placeholder='Next Recruitment Status'
                        options={Object.values(recruitmentStatusData)}
                        control={control}
                        required={'enter the next recruitment status'}
                        errors={errors}
                        border={true}
                    />
                    <div className={style.break}></div>
                    <AsyncSelectInputField
                        width='300px'
                        height='40px'
                        name='cc'
                        placeholder='CC'
                        defaultOptions={[]}
                        control={control}
                        required={'enter the CC'}
                        errors={errors}
                        border={true}
                        isMulti={true}
                        callBack={(data) => getUsersEmail({...data})}
                    />
                    <InputField 
                        type='text'
                        placeholder='title'
                        name='title'
                        width='300px'
                        height='40px'  
                        control={register('title' , { required: 'Please enter the title' })}
                        errors={errors}
                    />
                    <TextAreaField
                        placeholder='Body'
                        name='body'
                        width='518px'
                        height='154px'  
                        control={register('body' , { required: 'Please enter the body' })}
                        errors={errors}
                    />
                    <p>Hint: Insert [SQUAD], [POSITION], [ORCH_APPOINTLET], or [HR_APPOINTLET] for dynamic emails.</p>
                </div>
                <div className={style.buttons}>
                    <SubmitButton 
                        width='157px' 
                        height='40px'
                        disabled={isLoading}
                    >
                        Add Email
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default AddEmail;