// import react
import React from "react";

//import redux
import { useSelector } from "react-redux";
import {selectTaskStatusById} from '../taskSlice';

//import components
import TaskColHeader from "../TaskColHeader/TaskColHeader";
import { Droppable , Draggable } from 'react-beautiful-dnd';
import TaskCard from "../TaskCard/TaskCard";

// import style 
import style from './TaskColumn.module.css';

function TaskColumn({taskStatusId , popUpDispatch}){
    const taskStatus = useSelector(state => selectTaskStatusById(state , taskStatusId));
    
    return (
        <div className={style['task-column']}>
            <TaskColHeader 
                taskStatusId={taskStatusId}
                popUpDispatch={popUpDispatch} 
                crucial={taskStatus.crucial}
            >
                {taskStatus.name}
            </TaskColHeader>
            <Droppable isDropDisabled={false} droppableId={taskStatus.id+''} type="tasks">
                {(provided) => 
                    <div    
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={style['task-column-body']}
                    >
                        {
                            taskStatus.tasks?.map((taskId) => (
                                <Draggable 
                                    key={taskId}
                                    draggableId={taskId+''} 
                                    index={taskId}
                                >
                                    {(provide) => (
                                        <div
                                            ref={provide.innerRef}
                                            {...provide.draggableProps}
                                            {...provide.dragHandleProps}
                                        >
                                            <TaskCard 
                                                key={taskId} 
                                                taskId={taskId} 
                                                popUpDispatch={popUpDispatch}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        }
                        {provided.placeholder}
                    </div>
                }
            </Droppable>
        </div>
    );
}

export default TaskColumn;