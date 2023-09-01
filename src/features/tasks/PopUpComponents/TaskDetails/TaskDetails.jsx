//import package
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

//import redux
import { useSelector , useDispatch } from 'react-redux';
import { selectTaskById , selectCommentById, deleteTaskComment, createTaskComment } from '../../taskSlice';
import { showMessage } from '../../../snackBar/snackBarSlice';

// import components 
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import InputField from '../../../../common/components/Inputs/InputField/InputField';
import { Avatar } from '@mui/material';
import DateBox from '../../../../common/components/StatusBoxes/DateBox/DateBox';
import PriorityBox from '../../../../common/components/StatusBoxes/PriorityBox/PriorityBox';
import DifficultyBox from '../../../../common/components/StatusBoxes/DifficultyBox/DifficultyBox';

// import Icons 
import { IoCloseOutline } from "react-icons/io5";
import { RiSendPlaneLine } from "react-icons/ri";

//import style
import style from './TaskDetails.module.css';

function TaskDetails ({ handleClose ,  taskId }){
    const task = useSelector(state => selectTaskById(state , taskId));
    const nav = useNavigate();

    return (
        <div className={style['task-details']}>
            <div className={style.title}>
                <h2>{task.title}</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <div className={style.members}>
                <div className={style.for}>
                    <div>For</div>
                    <div className={style.name}>
                        <Avatar 
                            style={{
                                width: '24px', 
                                height: '24px',
                                fontSize: '15px',
                                backgroundColor: 'darkcyan',
                                cursor: 'pointer',
                            }}
                            onClick={() => nav(`/dashboard/user/${task.assignedTo.id}`)}
                        >{task.assignedTo.firstName?.at(0)}</Avatar>
                        <div>{task.assignedTo.firstName}</div>
                    </div>
                </div>
                <div className={style.Assigned}>
                    <div>Assigned by</div>
                    <div className={style.name}>
                        <Avatar 
                            style={{
                                width: '24px', 
                                height: '24px',
                                fontSize: '15px',
                                backgroundColor: 'cornflowerblue',
                                cursor: 'pointer',
                            }}
                            onClick={() => nav(`/dashboard/user/${task.assignedBy.id}`)}
                        >{task.assignedBy.firstName?.at(0)}</Avatar>
                        <div>{task.assignedBy.firstName}</div>
                    </div>
                </div>
            </div>
            <div className={style.info}>
                <PriorityBox priority={task?.priority}/>
                <DifficultyBox difficulty={task?.difficulty}/>
                <DateBox date={task.deadline}/>
            </div>
            <a className={style.link} target="_blank" rel="noreferrer"  href={task.url}>{task.url}</a>
            <div className={style.description}>{task.description}</div>
            <CommentBox taskId={taskId} commentsIds={task.comments}/>
        </div>
    );
}

const CommentBox = ({taskId , commentsIds}) => {
    const { register , formState : {errors , defaultValues} , handleSubmit , reset} = useForm({
        defaultValues:{
            content: '',
        }
    })
    const dispatch = useDispatch();
    const [isLoading , setIsLoading] = useState(false)


    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(createTaskComment({taskId , content: values.content})).unwrap();
            dispatch(showMessage({message: 'Comment Added successfully' , severity: 1}));
            reset(defaultValues);
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
        }
        setIsLoading(false);
    }

    return (    
        <div className={style.comments}> 
            <div className={style['comments-box']}>
                {
                    commentsIds?.map(commentId => (
                        <SingleComment key={commentId} commentId={commentId} taskId={taskId}/>
                    ))
                }
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputField 
                    type='text'
                    name='content'
                    placeholder='Add a comment'
                    width='376px'
                    height='35px'
                    errors={errors}
                    control={register('content' , { required: true })}
                />
                <div className={style.submit}>
                    <SubmitButton 
                        width='40px' 
                        height='40px' 
                        backgroundColor='transparent'
                        disabled={isLoading}
                    >
                        <RiSendPlaneLine 
                            className={style['send-icon']} 
                            color='#768396' 
                            size='20px'
                            />
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

const SingleComment = ({commentId , taskId}) => {
    const comment = useSelector(state => selectCommentById(state , commentId));
    const nav = useNavigate();
    const dispatch = useDispatch();

    const handleDeleteComment = async () => {
        try{
            await dispatch(deleteTaskComment({id : commentId , taskId})).unwrap();
            dispatch(showMessage({message: 'comment deleted successfully' , severity: 1}));
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
        }
    }

    return (
        <div className={style.comment}>
            <Avatar 
                style={{
                    width: '24px', 
                    height: '24px',
                    fontSize: '15px',
                    backgroundColor: 'darkseagreen',
                    cursor: 'pointer',
                }}
                onClick={() => nav(`/dashboard/user/${comment.author.id}`) }
            >{comment.author.firstName?.at(0)}</Avatar>
            <div className={style['comment-content']}>{comment.content}</div>
            <div 
                className={style.delete} 
                onClick={handleDeleteComment}
            >
                <IoCloseOutline 
                    size='15px' 
                    cursor='pointer' 
                    color='var(--natural-alpha-1)' 
                />
            </div>
        </div>
    );
}

export default TaskDetails;