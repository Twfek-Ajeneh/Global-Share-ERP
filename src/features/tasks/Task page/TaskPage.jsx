//import react
import React, { useReducer} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import { 
    selectTaskStatusesIds, 
    updateTask, 
    selectEndTaskStatusIds, 
    selectTaskStatus, 
    selectTaskSearchTerms
} from '../taskSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

// import components 
import TaskFilterBar from '../TaskFilterBar/TaskFilterBar';
import TaskColumn from '../TaskColumn/TaskColumn';
import PopUp from '../../../common/components/PopUp/PopUp';
import { AddStatusButton } from '../TaskColHeader/TaskColHeader';
import AddStatus from '../PopUpComponents/AddStatus/AddStatus';
import AddTasks from '../PopUpComponents/AddTasks/AddTasks';
import TaskDetails from '../PopUpComponents/TaskDetails/TaskDetails';
import FinishTask from '../PopUpComponents/FinishTask/FinishTask';
import Error from '../../../common/components/Error/Error';
import Loader from '../../../common/components/Loader/Loader';
import Hello from '../../../common/components/Hello/Hello';

//import style
import style from './TaskPage.module.css';

const initPopUpOption = {
    id: 0,
    secondId: 0,
    isOpen: false,
    index: 0,
}

const popUpReducer = (state , action) => {
    switch(action.type){
        case 'addStatus': return {
            ...initPopUpOption,
            id: action.id,
            isOpen: true,
            index: 0
        }
        case 'addTask': return {
            ...initPopUpOption,
            id: action.id,
            isOpen: true,
            index: 1,
        }
        case 'taskDetails': return {
            ...initPopUpOption,
            id: action.id,
            isOpen: true,
            index: 2,
        }
        case 'finishTask': return{
            ...initPopUpOption,
            id: action.id,
            secondId: action.secondId,
            thirdId: action.thirdId,
            isOpen: true,
            index: 3,
        }
        case 'close': return {
            ...state,
            isOpen: false
        }
        default:
            return state;
    }
}

function TaskPage (){
    const [popUpOption , popUpDispatch] = useReducer(popUpReducer , initPopUpOption);
    const dispatch = useDispatch();
    
    const taskStatusesIds = useSelector(selectTaskStatusesIds);
    const endTaskStatusIds = useSelector(selectEndTaskStatusIds);
    const taskStatus = useSelector(selectTaskStatus);
    const searchTerms = useSelector(selectTaskSearchTerms);

    const onDragEnd = async ({source , destination}) => {
        if(destination===null || source.droppableId===destination.droppableId) return;
        if(endTaskStatusIds?.indexOf(parseInt(destination.droppableId))!==-1){
            popUpDispatch({type: 'finishTask' , id: source.index , secondId: destination.droppableId , thirdId: source.droppableId})
        }
        else{
            try{
                await dispatch(updateTask({
                    id: source.index,
                    statusId: destination.droppableId,
                    sourceStatusId: source.droppableId,
                })).unwrap();
                dispatch(showMessage({message: 'Task Moved successfully' , severity: 1}));
            }catch(error){
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }   

    return (
        <div className={style['task-page']}>
            <TaskFilterBar />

            {taskStatus==='failed' && <div className={style.center}><Error /></div>}

            {taskStatus==='loading' && <div className={style.center}><Loader transparent={true} /></div>}

            {((taskStatus==='idle' || searchTerms.squadId===undefined)
                && (taskStatus!=='loading' && taskStatus!=='failed')) && 
                <div className={style.center}><Hello /></div>
            }

            {taskStatus==='succeeded' &&  
                <div className={style['task-page-body']}>
                    <DragDropContext
                        onDragEnd={onDragEnd}
                    >
                        {
                            taskStatusesIds.map((taskStatusId) => (
                                <TaskColumn
                                    key={taskStatusId}
                                    taskStatusId={taskStatusId}
                                    popUpDispatch={popUpDispatch}
                                />
                            ))
                        }
                    </DragDropContext>
                    <AddStatusButton popUpDispatch={popUpDispatch}> Add New </AddStatusButton>
                </div>
            }

            <PopUp open={popUpOption.isOpen} handleClose={() => popUpDispatch({type:'close'})} index={popUpOption.index}>
                <AddStatus handleClose={() => popUpDispatch({type:'close'})} squadId={popUpOption.id}/>
                <AddTasks  handleClose={() => popUpDispatch({type:'close'})} taskStatusId={popUpOption.id}/>
                <TaskDetails handleClose={() => popUpDispatch({type:'close'})} taskId={popUpOption.id}/>
                <FinishTask 
                    handleClose={() => popUpDispatch({type:'close'})} 
                    taskId={popUpOption.id} 
                    taskStatusId={popUpOption.secondId} 
                    sourceTaskStatusId={popUpOption.thirdId}
                />
            </PopUp>
        </div>
    );
}

export default TaskPage;