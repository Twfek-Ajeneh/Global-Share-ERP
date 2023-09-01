//import package
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useDispatch } from 'react-redux';
import { updateTask } from '../../taskSlice';

// import components 
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import InputField from '../../../../common/components/Inputs/InputField/InputField';
import Loader from '../../../../common/components/Loader/Loader';
import { showMessage } from '../../../snackBar/snackBarSlice';

// import icons
import { IoCloseOutline } from "react-icons/io5";

//import style
import style from './FinishTask.module.css';


function FinishTask ({handleClose , taskId , taskStatusId , sourceTaskStatusId}){
    const [isLoading , setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { register , formState: {errors} , handleSubmit } = useForm({
        defaultValues:{
            hoursTaken: '',
        }
    })

    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(updateTask({
                hoursTaken: parseInt(values.hoursTaken),
                id: taskId,
                statusId: taskStatusId, 
                sourceStatusId: sourceTaskStatusId,
            })).unwrap();
            dispatch(showMessage({message: 'Task Finished successfully' , severity: 1}));
            handleClose();
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading){
        return (
            <div className={style['finish-task']}>
                <Loader transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style['finish-task']}>
            <div className={style['finish-task-header']}>
                <h2>Finish Task</h2>
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
                    name='hoursTaken'
                    placeholder='Taken Hours'
                    width='100%'
                    height='40px'
                    errors={errors}
                    control={register('hoursTaken' , {required: 'Please enter the hours'})}
                />
                <SubmitButton 
                    width='112px' 
                    height='40px'
                >
                    done
                </SubmitButton>
            </form>
        </div>
    );
}

export default FinishTask; 