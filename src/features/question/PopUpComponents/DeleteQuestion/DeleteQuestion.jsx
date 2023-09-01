//import react
import React , {useState} from 'react';

//import redux
import { useDispatch } from 'react-redux';
import {deleteQuestion} from '../../questionSlice';
import { showMessage } from '../../../snackBar/snackBarSlice';

// import components
import ConfirmPopUp from '../../../../common/components/ConfirmPopUp/ConfirmPopUp';
import Loader from '../../../../common/components/Loader/Loader';

//import style
import style from './DeleteQuestion.module.css'

function DeleteQuestion({id , handleClose}){
    const dispatch = useDispatch();
    const [isLoading , setIsLoading] = useState(false);

    const setIsConfirmed = async (value) => {
        if(value===true){
            setIsLoading(true);
            try{
                await dispatch(deleteQuestion({id})).unwrap();
                dispatch(showMessage({message: 'Question deleted successfully' , severity: 1}));
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
                title='Delete Question ?'
                confirmText='delete'
                setIsConfirm={setIsConfirmed}
            />
        </>
    );
}

export default DeleteQuestion;