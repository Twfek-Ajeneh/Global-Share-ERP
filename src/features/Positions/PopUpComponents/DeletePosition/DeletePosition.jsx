// import react
import React, { useState } from 'react';

//import redux
import { useDispatch } from 'react-redux';
import {deletePosition} from '../../PositionSlice';
import { showMessage } from '../../../snackBar/snackBarSlice';

//import components
import ConfirmPopUp from '../../../../common/components/ConfirmPopUp/ConfirmPopUp';
import Loader from '../../../../common/components/Loader/Loader';

//import style
import style from './DeletePosition.module.css';

function DeletePosition({id , handleClose}) {
    const dispatch = useDispatch();
    const [isLoading , setIsLoading] = useState(false);

    const setIsConfirmed = async (value) => {
        if(value===true){
            setIsLoading(true);
            try{
                await dispatch(deletePosition({id})).unwrap();
                dispatch(showMessage({message: 'Position deleted successfully' , severity: 1}));
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
                title='Delete Position ?'
                confirmText='delete'
                setIsConfirm={setIsConfirmed}
            />
        </>
    );
}

export default DeletePosition;