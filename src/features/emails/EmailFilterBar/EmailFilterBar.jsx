//import react
import React from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useSelector , useDispatch } from 'react-redux';
import { getEmails, selectEmailStatus } from '../EmailSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import InputField from '../../../common/components/Inputs/InputField/InputField';
import Button from '../../../common/components/Inputs/Button/Button';
import SubmitButton from '../../../common/components/Inputs/SubmitButton/SubmitButton';

//import icons & images
import { ImPlus } from 'react-icons/im';
import { FiSearch } from 'react-icons/fi';
import { RxReset } from 'react-icons/rx';

//import style
import style from './EmailFilterBar.module.css';

function EmailFilterBar({ handleAdd }) {
    const dispatch = useDispatch();
    const {register , formState , reset , handleSubmit} = useForm({
        defaultValues:{
            search: '',
        }
    });

    const status = useSelector(selectEmailStatus);

    const handleReset = async() => {
        try{
            await dispatch(getEmails({search: ''})).unwrap();
            reset(formState.defaultValues);
        }catch(error){
            if(error?.name==="ConditionError") return;
            dispatch(showMessage({message: error , severity: 2}));
        }
    }

    const onSubmit = async (values) => {
        try{
            await dispatch(getEmails(values)).unwrap();
        }catch(error){
            if(error?.name==="ConditionError") return;
            dispatch(showMessage({message: error , severity: 2}));
        }
    }

    return (
        <div className={style['bar']}>
            <form className={style['filter-bar']} onSubmit={handleSubmit(onSubmit)}>
                <InputField
                    type='text'
                    name='search'
                    placeholder='Search...'
                    width='277px'
                    height='40px'
                    control={register('search')}
                />
                <span className={style['bar-buttons']}>
                    <SubmitButton 
                        width='40px'
                        height='30px'
                        disabled={status==='loading' || status==='idle' ? true : false}
                    >
                        <FiSearch size='15px'/>
                    </SubmitButton> 
                    <span 
                        className={style.reset} 
                        style={{
                            pointerEvents: (status==='loading' || status==='idle') ? 'none' : 'auto'
                        }}
                        onClick={handleReset}
                    >
                        <RxReset size='15px'/>    
                    </span>
                </span>
            </form>
            <div style={{marginBottom: '5px'}}>
                <Button width="150px" height="40px" onClick={handleAdd}>
                    <ImPlus size="13px" color='white'style={{marginRight: '8px'}}/> Add Email
                </Button>
            </div>
        </div>
    );
}

export default EmailFilterBar;