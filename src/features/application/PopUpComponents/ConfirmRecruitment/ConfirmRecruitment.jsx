// import react
import React , { useState }  from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

//import redux
import { useDispatch } from 'react-redux';
import {updateApplication} from '../../ApplicationSlice';
import {showMessage} from '../../../snackBar/snackBarSlice';

// import components 
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import Loader from '../../../../common/components/Loader/Loader';

// import icons
import { IoCloseOutline } from "react-icons/io5";

//import static data
import { recruitmentStatusData } from '../../../../common/utils/selectorData';

//import style 
import style from './ConfirmRecruitment.module.css';
import TextAreaField from '../../../../common/components/Inputs/TextAreaField/TextAreaField';

function ConfirmRecruitment({id , handleClose}) {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const {register , formState : {errors} , handleSubmit } = useForm({
        defaultValues:{
            reason: '',
        }
    })

    const [isLoading , setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(updateApplication({
                id, 
                ...values,
                status: recruitmentStatusData.done.toUpperCase()
            })).unwrap();
            dispatch(showMessage({message: 'Application done successfully' , severity: 1}));
            handleClose();
            nav('/dashboard/application');
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading===true){
        return (
            <div className={style["confirm-recruitment"]}>
                <Loader  transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style["confirm-recruitment"]}>
            <div className={style["confirm-recruitment-header"]}>
                <h2>Confirm Recruitment</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["confirm-recruitment-body"]} onSubmit={handleSubmit(onSubmit)}>
                <TextAreaField
                    name='reason'
                    placeholder='recruitment Feedback'
                    width='392px'
                    height='120px'
                    control={register('reason' , {
                        required: 'Please enter the Recruit Feedback',
                    })}
                    errors={errors}
                />
                <SubmitButton 
                    width='137px' 
                    height='40px'
                    disabled={isLoading}
                    backgroundColor='var(--secondary-dark)'
                >
                    Done
                </SubmitButton>
            </form>
        </div>
    );
}

export default ConfirmRecruitment;