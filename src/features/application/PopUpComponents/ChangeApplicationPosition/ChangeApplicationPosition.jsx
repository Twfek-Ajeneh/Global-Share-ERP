// import react
import React , { useState }  from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useDispatch } from 'react-redux';
import {updateApplication} from '../../ApplicationSlice';
import {showMessage} from '../../../snackBar/snackBarSlice';

// import components 
import SelectInputField from '../../../../common/components/Inputs/SelectInputField/SelectInputField';
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import Button from '../../../../common/components/Inputs/Button/Button';
import Loader from '../../../../common/components/Loader/Loader';

// import icons
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";

//import static data
import {levelData} from '../../../../common/utils/selectorData'

//import style 
import style from './ChangeApplicationPosition.module.css';

function ChangeApplicationPosition({id , position , handleClose}) {
    const dispatch = useDispatch();
    const {control , formState : {errors , isDirty} , handleSubmit} = useForm({
        defaultValues:{
            position : {value: position , label: position},
        }
    })

    const [isLoading , setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(updateApplication({
                id, 
                position: values?.position?.value
            })).unwrap();
            dispatch(showMessage({message: 'Application Edited successfully' , severity: 1}));
            handleClose();
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading===true){
        return (
            <div className={style["change-application-position"]}>
                <Loader  transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style["change-application-position"]}>
            <div className={style["change-application-position-header"]}>
                <h2>Change Applicant's Position</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["change-application-position-body"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.box}>
                    <SelectInputField
                        width='240px'
                        height='40px'
                        name='position'
                        placeholder='Position'
                        options={Object.values(levelData)}
                        control={control}
                        required={'enter the position'}
                        errors={errors}
                        border={true}
                        menuHeight='90px'
                    />
                </div>
                <div className={style.buttons}>
                    <SubmitButton 
                        width='170px' 
                        height='40px'
                        disabled={isLoading || !isDirty} 
                    >
                        Change Position
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

export default ChangeApplicationPosition;