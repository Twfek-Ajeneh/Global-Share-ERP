// import react
import React , { useState }  from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

//import redux
import { useDispatch } from 'react-redux';
import {updateApplication} from '../../ApplicationSlice';
import {showMessage} from '../../../snackBar/snackBarSlice';

// import components 
import TextAreaField from '../../../../common/components/Inputs/TextAreaField/TextAreaField';
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import Button from '../../../../common/components/Inputs/Button/Button';
import Loader from '../../../../common/components/Loader/Loader';

// import icons
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";

//import static data
import { recruitmentStatusData } from '../../../../common/utils/selectorData';

//import style 
import style from './RefuseApplication.module.css';

function RefuseApplication({id , handleClose}) {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const {register , formState : {errors} , handleSubmit } = useForm({
        defaultValues:{
            reason : '',
        }
    })

    const [isLoading , setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(updateApplication({
                id, 
                ...values, 
                status: recruitmentStatusData.refused.toUpperCase()
            })).unwrap();
            dispatch(showMessage({message: 'Application Refused successfully' , severity: 1}));
            handleClose();
            nav('/dashboard/application');
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading===true){
        return (
            <div className={style["refuse-reason"]}>
                <Loader  transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style["refuse-reason"]}>
            <div className={style["refuse-reason-header"]}>
                <h2>Refuse Application</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["refuse-reason-body"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.box}>
                    <TextAreaField 
                        name='reason'
                        placeholder='Refuse Reason'
                        width='292px'
                        height='120px'
                        control={register('reason' , {
                            required: 'Please enter the Refuse Reason',
                        })}
                        errors={errors}
                    />
                </div>
                <div className={style.buttons}>
                    <SubmitButton 
                        width='105px' 
                        height='40px'
                        disabled={isLoading}
                    >
                        Refuse
                    </SubmitButton>
                </div>
            </form>
            <div className={style.email}>
                <Button 
                    width='166px' 
                    height='40px' 
                    color='var(--natural-3)' 
                    backgroundColor='var(--natural-8)' 
                    onClick={() => console.log("mail")}
                >
                    <HiOutlineMail color='var(--word-color)' size="17px"/> Preview Email
                </Button>
            </div>
        </div>
    );
}

export default RefuseApplication;