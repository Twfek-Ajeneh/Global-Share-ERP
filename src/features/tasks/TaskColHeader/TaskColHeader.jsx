//import package
import React  from 'react';
import clsx from 'clsx';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import { selectTaskSearchTerms , deleteTaskStatus} from '../taskSlice';

// import Icons 
import { GrFormAdd } from 'react-icons/gr';
import { BsTrash } from 'react-icons/bs';

//import style
import style from './TaskColHeader.module.css';
import { showMessage } from '../../snackBar/snackBarSlice';

function TaskColHeader ({ children , popUpDispatch , crucial , taskStatusId}){
    const dispatch = useDispatch();

    const handleDelete = async() => {
        try{
            await dispatch(deleteTaskStatus({id: taskStatusId})).unwrap();
            dispatch(showMessage({message: 'Status deleted successfully' , severity: 1}));
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
        }
    }
    
    const handleAdd = () => {
        popUpDispatch({type: 'addTask' , id: taskStatusId});
    }

    return (
        <div className={style['task-header']}>
            <div>{children}</div>
            <div className={style.icons}>
                {!crucial && <span className={style['delete-icon']} onClick={handleDelete} ><BsTrash/></span>}
                <span className={style['add-icon']} onClick={handleAdd} ><GrFormAdd/></span>
            </div>
        </div>
    );
}

function AddStatusButton({ children , popUpDispatch}){
    const {squadId} = useSelector(selectTaskSearchTerms);

    const handleClick = () => {
        popUpDispatch({type: 'addStatus' , id: squadId?.value });
    }

    return(
        <div className={clsx(style['task-header'] , style['add-task'])}>
            <div>{children}</div>
            <div className={style.icons} onClick={handleClick}>
                <span className={style['add-icon']}><GrFormAdd/></span>
            </div>
        </div>
    );
}

export { AddStatusButton };
export default TaskColHeader;