//import react
import React, { useEffect, useReducer, useState } from 'react';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import {
    getQuestions,
    getQuestionsPage,
    selectAllQuestion,
    selectQuestionCount,
    selectQuestionResetTable,
    selectQuestionTotalCount,
    selectQuestionStatus,
} from '../questionSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import DashboardTable from '../../../common/components/Dashboard/DashboardTable/DashboardTable';
import PopUp from '../../../common/components/PopUp/PopUp';
import QuestionFilterBar from '../QuestionFilterBar/QuestionFilterBar';
import DeleteQuestion from '../PopUpComponents/DeleteQuestion/DeleteQuestion';
import AddQuestion from '../PopUpComponents/AddQuestion/AddQuestion';
import EditQuestion from '../PopUpComponents/EditQuestion/EditQuestion';

//import style
import style from './QuestionPage.module.css';

const columns = [
    {
        name: 'id',
        keys: ['id'],
        type: 'id',
    },
    {
        name: 'question',
        keys: ['text'],
        type: 'normal'
    },
    {
        name: 'type',
        keys: ['type'],
        type: 'normal'
    },
    {
        keys: ['edit'],
        type: 'button',
    },
    {
        keys: ['delete'],
        type: 'button',
    }
];

const initPopUpOption = {
    id: 0,
    isOpen: false,
    index: 0,
};

const popUpReducer = (state , action) => {
    switch(action.type){
        case 'delete': return {
            ...initPopUpOption,
            id: action.id,
            isOpen: true,
            index: 0
        }
        case 'edit': return {
            ...initPopUpOption,
            id: action.id,
            isOpen: true,
            index: 1,
        }
        case 'add': return {
            ...initPopUpOption,
            isOpen: true,
            index: 2,
        }
        case 'close': return {
            ...state,
            isOpen: false
        }
        default:
            return state;
    }
};

function QuestionPage(){
    const [popUpOption , popUpDispatch] = useReducer(popUpReducer , initPopUpOption);
    const dispatch = useDispatch();
    const [curSkip , setCurSkip] = useState(0);

    const data = useSelector(selectAllQuestion);
    const status = useSelector(selectQuestionStatus);
    const totalCount = useSelector(selectQuestionTotalCount);
    const resetTable = useSelector(selectQuestionResetTable);
    const questionCount = useSelector(selectQuestionCount);

    const handleAdd = () => {
        popUpDispatch({type: 'add'});
    }

    const onChangePage = async (page , _) => {
        const skip = (page-1)*10;
        setCurSkip(skip);
        if(questionCount <= skip){
            try{
                await dispatch(getQuestionsPage({skip})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }

    useEffect(() => {
        const req = async () => {
            try{
                await dispatch(getQuestions({search: ''})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }

        req();
    } , []);

    return (
        <div className={style['question-page']}>
            <h1 className={style['question-title']}>questions</h1>

            <QuestionFilterBar handleAdd={handleAdd}/>

            <DashboardTable 
                columns={columns}
                data={data.slice(curSkip , curSkip+10)}
                pending={status==='loading' || status ==='idle' ? true : false}
                rowClick={(row) => {}}
                handleDelete={(row) => popUpDispatch({type:'delete' , id: row.id})}
                handleEdit={(row) => popUpDispatch({type:'edit' , id: row.id})}
                onChangePage={onChangePage}
                totalCount={totalCount}
                resetTable={resetTable}
            />

            <PopUp open={popUpOption.isOpen} handleClose={() => popUpDispatch({type:'close'})} index={popUpOption.index}>
                <DeleteQuestion id={popUpOption.id} handleClose={() => popUpDispatch({type:'close'})}/>
                <EditQuestion id={popUpOption.id} handleClose={() => popUpDispatch({type:'close'})}/>
                <AddQuestion handleClose={() => popUpDispatch({type:'close'})}/>
            </PopUp>
        </div>
    );
}

export default QuestionPage