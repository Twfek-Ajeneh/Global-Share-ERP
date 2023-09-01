// import react
import React , { useState }  from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import {selectEmailById , updateEmail} from '../../EmailSlice';
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
import style from './EditEmail.module.css';

function EditEmail({id , handleClose}) {
    const data = useSelector((state) => selectEmailById(state , id));
    const dispatch = useDispatch();
    const {control , register , formState: {errors , isDirty , dirtyFields} , handleSubmit , getValues} = useForm({
        defaultValues:{
            title: '' , 
            body: '', 
            recruitmentStatus: null, 
            cc: [],
        },
        values: {
            title: data.title, 
            body: data.body, 
            recruitmentStatus: {label: data.recruitmentStatus?.toLowerCase() , value: data.recruitmentStatus?.toLowerCase()} , 
            cc: data.cc?.split(',')?.map(email => ({value: email , label: email}))
        }
    })

    const [isLoading , setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        setIsLoading(true);
        if(isDirty){
            const changed = {};
            for(let key of Object.keys(dirtyFields)){
                if(dirtyFields[key]){
                    if(key==='recruitmentStatus')
                        changed[key] = values[key].value?.toUpperCase();
                    else if(key==='cc')
                        changed[key] = values[key]?.map(email => email?.value)?.join(',')
                    else 
                        changed[key] = values[key];
                }
            }
            try{
                await dispatch(updateEmail({id , ...changed})).unwrap();
                dispatch(showMessage({message: 'Email Edited successfully' , severity: 1}));
                handleClose();
            }catch(error){
                dispatch(showMessage({message: error , severity: 2}));
                setIsLoading(false);
            }
        }
    }

    if(isLoading===true){
        return (
            <div className={style["edit-email"]}>
                <Loader  transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style["edit-email"]}>
            <div className={style["edit-email-header"]}>
                <h2>Edit Email</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["edit-email-body"]} onSubmit={handleSubmit(onSubmit)}>
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
                        disabled={isLoading || !isDirty}
                    >
                        Edit Email
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default EditEmail;