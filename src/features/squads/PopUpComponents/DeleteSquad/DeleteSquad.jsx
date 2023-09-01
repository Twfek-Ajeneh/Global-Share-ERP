//import react
import React , {useState} from 'react';

//import redux
import { useDispatch } from 'react-redux';
import { deleteSquad } from '../../squadSlice';
import { showMessage } from '../../../snackBar/snackBarSlice';

//import components
import ConfirmPopUp from '../../../../common/components/ConfirmPopUp/ConfirmPopUp';
import Loader from '../../../../common/components/Loader/Loader';

// import style
import style from './DeleteSquad.module.css';

function DeleteSquad({id , handleClose}){
    const dispatch = useDispatch();
    const [isLoading , setIsLoading] = useState(false);

    const setIsConfirmed = async (value) => {
        if(value===true){
            try{
                setIsLoading(true);
                await dispatch(deleteSquad({id})).unwrap();
                dispatch(showMessage({message: 'Squad deleted successfully' , severity: 1}));
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
                title='Delete squad ?'
                confirmText='delete'
                setIsConfirm={setIsConfirmed}
            />
        </>
    )
}

export default DeleteSquad;