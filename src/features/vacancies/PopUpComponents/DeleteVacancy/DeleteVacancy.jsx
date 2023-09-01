//import react
import React, { useState } from 'react';

//import redux
import { useDispatch } from 'react-redux';
import {deleteVacancy} from '../../VacancySlice';
import { showMessage } from '../../../snackBar/snackBarSlice';

//import components
import ConfirmPopUp from '../../../../common/components/ConfirmPopUp/ConfirmPopUp';
import Loader from '../../../../common/components/Loader/Loader';

//import style
import style from './DeleteVacancy.module.css'

function DeleteVacancy({id , handleClose}){
    const dispatch = useDispatch();
    const [isLoading , setIsLoading] = useState(false);

    const setIsConfirmed = async (value) => {
        if(value===true){
            setIsLoading(true);
            try{
                await dispatch(deleteVacancy({id})).unwrap();
                dispatch(showMessage({message: 'Vacancy deleted successfully' , severity: 1}));
            }catch(error){
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
        handleClose();
    }

    if(isLoading){
        return(
            <div className={style.delete}>
                <Loader transparent={true}/>
            </div>
        );
    }

    return (
        <>
            <ConfirmPopUp 
                title='Delete Vacancy ?'
                confirmText='delete'
                setIsConfirm={setIsConfirmed}
            />
        </>
    )
}

export default DeleteVacancy;