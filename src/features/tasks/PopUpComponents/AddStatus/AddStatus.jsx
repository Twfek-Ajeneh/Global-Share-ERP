//import package
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useDispatch } from 'react-redux';
import { createTaskStatus } from '../../taskSlice';

// import components 
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import InputField from '../../../../common/components/Inputs/InputField/InputField';
import Loader from '../../../../common/components/Loader/Loader';
import { showMessage } from '../../../snackBar/snackBarSlice';

// import icons
import { IoCloseOutline } from "react-icons/io5";

//import style
import style from './AddStatus.module.css';


function AddStatus ({handleClose , squadId}){
    const [isLoading , setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { register , formState: {errors} , handleSubmit } = useForm({
        defaultValues:{
            name: '',
        }
    })

    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(createTaskStatus({squadId , name: values?.name})).unwrap();
            dispatch(showMessage({message: 'Status Added successfully' , severity: 1}));
            handleClose();
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading){
        return (
            <div className={style['add-status']}>
                <Loader transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style['add-status']}>
            <div className={style['add-status-header']}>
                <h2>Create New Column</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputField 
                    type='text'
                    name='name'
                    placeholder='Name'
                    width='100%'
                    height='40px'
                    errors={errors}
                    control={register('name' , {required: 'Please enter status name'})}
                />
                <SubmitButton 
                    width='112px' 
                    height='40px'
                >
                    Create
                </SubmitButton>
            </form>
        </div>
    );
}

export default AddStatus;  