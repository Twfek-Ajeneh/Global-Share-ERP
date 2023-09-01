//import package
import React from 'react';
import { format } from 'date-fns';

//import redux
import { useSelector } from 'react-redux';
import {selectTaskById} from '../taskSlice';

//import components
import PriorityBox from '../../../common/components/StatusBoxes/PriorityBox/PriorityBox';
import DifficultyBox from '../../../common/components/StatusBoxes/DifficultyBox/DifficultyBox';

// import icons 
import { BiMessageAlt } from "react-icons/bi"

//import style
import style from './TaskCard.module.css';
import DateBox from '../../../common/components/StatusBoxes/DateBox/DateBox';


function TaskCard ({taskId, popUpDispatch}){
    const task = useSelector(state => selectTaskById(state , taskId));


    const handleClick = () => {
        popUpDispatch({type: 'taskDetails' , id: taskId});
    }

    return (
        <div className={style['task-card']} onClick={handleClick} >
            <div className={style['card-header']}>
                <PriorityBox priority={task?.priority}/>
                <DifficultyBox difficulty={task?.difficulty}/>
            </div>
            <div className={style['card-body']}>
                <h3 className={style.title}>{task.title}</h3>
                <div className={style.description}>{task?.description}</div>
            </div>
            <div className={style['card-footer']}>
                <DateBox date={task?.deadline}/>
                <div className={style.comments}>
                    <BiMessageAlt  color='#768396' size='15px'></BiMessageAlt>
                    <div> {task?.comments?.length} Comment</div>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;