//import package
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import { selectTaskSearchTerms , createTask } from '../../taskSlice';
import { showMessage } from '../../../snackBar/snackBarSlice';
import { selectAuthInfo } from '../../../auth/AuthSlice';

// import components 
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import InputField from '../../../../common/components/Inputs/InputField/InputField';
import TextAreaField from '../../../../common/components/Inputs/TextAreaField/TextAreaField';
import SelectInputField from "../../../../common/components/Inputs/SelectInputField/SelectInputField";
import AsyncSelectInputField from '../../../../common/components/Inputs/AsyncSelectInputField/AsyncSelectInputField';
import Loader from '../../../../common/components/Loader/Loader';

//import static data request
import { getAssignableMember } from '../../../../common/utils/selectorAPI';

//import static data
import { priorityData , difficultyData} from '../../../../common/utils/selectorData';

// import icons
import { IoCloseOutline } from "react-icons/io5";

//import style
import style from './AddTasks.module.css';
import { format } from 'date-fns';


function AddTasks ({handleClose , taskStatusId}){
    const [isLoading , setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const {squadId} = useSelector(selectTaskSearchTerms);
    const {id} = useSelector(selectAuthInfo);
    const {control , register , formState: {errors} , handleSubmit } = useForm({
        defaultValues:{
            title: '',
            description: '',
            url: '',
            deadline: '',
            priority: null,
            difficulty: null,
            assignedToId: null
        }
    })

    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(createTask({
                title: values.title,
                description: values.description,
                url: values.url,
                deadline: values.deadline,
                priority: values.priority?.value?.toUpperCase(),
                difficulty: values.difficulty?.value?.toUpperCase(),
                statusId: taskStatusId,
                assignedToId: values.assignedToId?.value,
                assignedById: id,
            })).unwrap();
            dispatch(showMessage({message: 'Task Added successfully' , severity: 1}));
            handleClose();
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading){
        return (
            <div className={style['add-tasks']}>
                <Loader transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style['add-tasks']}>
            <div className={style.header}>
                <h2>Create New Task</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={style.box}>
                    <InputField 
                        type='text'
                        name='title'
                        placeholder='Title'
                        width='184px'
                        height='40px'
                        control={register('title' , { required: 'Please enter task title' })}
                        errors={errors}
                    />
                    <InputField 
                        type='date'
                        name='deadline'
                        placeholder='DeadLine'
                        width='188px'
                        height='40px'
                        control={register('deadline' , { required: 'Please enter task deadLine' })}
                        errors={errors}
                        min={format(new Date() , 'yyyy-MM-dd')}
                    />
                </div>
                <div className={style.box}>
                    <TextAreaField
                        id='description'
                        placeholder='Description...'
                        width='386px'
                        height='121px'
                        control={register('description' , { required: 'Please enter task description' })}
                        name='description'
                        errors={errors}
                    />
                </div>
                <div className={style.box}>
                    <SelectInputField
                        width='184px'
                        height='40px'
                        name='priority'
                        placeholder='Importance'
                        options={Object.values(priorityData)}
                        control={control}
                        required='true'
                        errors={errors}
                        border={true}
                    />
                    <SelectInputField
                        width='184px'
                        height='40px'
                        name='difficulty'
                        placeholder='Difficulty'
                        options={Object.values(difficultyData)}
                        control={control}
                        required='true'
                        errors={errors}
                        border={true}
                    />
                </div>
                <div className={style.box}>
                    <InputField 
                        type='text'
                        name='url'
                        placeholder='url'
                        width='386px'
                        height='40px'
                        control={register('url')}
                        errors={errors}
                    />
                </div>
                <div className={style.box}>
                    <AsyncSelectInputField
                        width='229px'
                        height='40px'
                        name='assignedToId'
                        placeholder='Assignee'
                        control={control}
                        required='true'
                        callBack={(data) => getAssignableMember({...data , squadId: squadId?.value})}
                        defaultOptions={[]}
                        errors={errors}
                        border={true}
                        placement='top'
                    />
                    <div className={style.submit}>
                        <SubmitButton 
                            width='145px' 
                            height='40px'
                        >
                            Create Task
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddTasks;