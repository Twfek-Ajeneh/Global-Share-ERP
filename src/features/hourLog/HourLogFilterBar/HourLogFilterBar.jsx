//import react
import React from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useSelector , useDispatch } from 'react-redux';
import {getHourLog , selectHourLogStatus} from '../hourLogSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import component
import InputField from '../../../common/components/Inputs/InputField/InputField';
import SubmitButton from '../../../common/components/Inputs/SubmitButton/SubmitButton';
import AsyncSelectInputField from '../../../common/components/Inputs/AsyncSelectInputField/AsyncSelectInputField';

//import icons & images
import { FiSearch } from 'react-icons/fi';
import { RxReset } from 'react-icons/rx';

//import static data request
import {getSquadsData} from '../../../common/utils/selectorAPI';

import style from './HourLogFilterBar.module.css';

function HourLogFilterBar() {
    const dispatch = useDispatch();
    const {control , register , formState , reset , handleSubmit} = useForm({
        defaultValues:{
            search: '',
            squadId: null, 
        }
    });

    const status = useSelector(selectHourLogStatus);

    const handleReset = async () => {
        try{
            await dispatch(getHourLog({squadId: '' , search: ''})).unwrap();
            reset(formState.defaultValues);
        }catch(error){
            if(error?.name==="ConditionError") return;
            dispatch(showMessage({message: error , severity: 2}));
        }
    }

    const onSubmit = async(values) => {
        const {search ,squadId} = values;
        try{
            await dispatch(getHourLog({
                search,
                squadId: squadId?.value
            })).unwrap();
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
                <AsyncSelectInputField
                    width='200px'
                    height='40px'
                    name='squadId'
                    placeholder='All squads'
                    defaultOptions={[]}
                    control={control}
                    callBack={(data) => getSquadsData({...data})}
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

export default HourLogFilterBar;