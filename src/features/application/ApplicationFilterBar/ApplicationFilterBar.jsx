//import react
import React from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import { selectApplicationStatus , getApplications} from '../ApplicationSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import InputField from '../../../common/components/Inputs/InputField/InputField';
import SubmitButton from '../../../common/components/Inputs/SubmitButton/SubmitButton';

//import icons & images
import { FiSearch } from 'react-icons/fi';
import { RxReset } from 'react-icons/rx';

//import style 
import style from './ApplicationFilterBar.module.css';


function ApplicationFilterBar(){
    const dispatch = useDispatch();
    const {register , formState , reset , handleSubmit} = useForm({
        defaultValues:{
            search: '',
        }
    });

    const status = useSelector(selectApplicationStatus);

    const handleReset = async () => {
        try{
            await dispatch(getApplications({search: ''})).unwrap();
            reset(formState.defaultValues);
        }catch(error){
            if(error?.name==="ConditionError") return;
            dispatch(showMessage({message: error , severity: 2}));
        }
    }

    const onSubmit = async(values) => {
        try{
            await dispatch(getApplications(values)).unwrap();
        }catch(error){
            if(error?.name==="ConditionError") return;
            dispatch(showMessage({message: error , severity: 2}));
        }   
    }

    return (
        <div className={style['bar']}>   
            <form  className={style['filter-bar']} onSubmit={handleSubmit(onSubmit)}>
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
        </div>
    );
}

export default ApplicationFilterBar;