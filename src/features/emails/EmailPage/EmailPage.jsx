//import react
import React, { useEffect, useReducer, useState } from 'react';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import { 
    selectEmailStatus,
    getEmails, 
    selectEmailTotalCount, 
    selectEmailResetTable, 
    getEmailsPage,
    selectEmailCount,
    selectAllEmail
} from '../EmailSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import DashboardTable from '../../../common/components/Dashboard/DashboardTable/DashboardTable';
import PopUp from '../../../common/components/PopUp/PopUp';
import DeleteEmail from '../PopUpComponents/DeleteEmail/DeleteEmail';
import EmailFilterBar from '../EmailFilterBar/EmailFilterBar';
import EditEmail from '../PopUpComponents/EditEmail/EditEmail';
import AddEmail from '../PopUpComponents/AddEmail/AddEmail';

//import style 
import style from './EmailPage.module.css';

const columns = [
    {
        name: 'id',
        keys: ['id'],
        type: 'id',
    },
    {
        name: 'title',
        keys: ['title'],
        type: 'normal'
    },
    {
        name: 'next recruitment status',
        keys: ['recruitmentStatus'],
        type: 'recruitmentStatus'
    },
    {
        keys: ['edit'],
        type: 'button',
    },
    {
        keys: ['delete'],
        type: 'button',
    }
]

const initPopUpOption = {
    id: 0,
    isOpen: false,
    index: 0,
}

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
}

function EmailPage() {
    const [popUpOption , popUpDispatch] = useReducer(popUpReducer , initPopUpOption);
    const dispatch = useDispatch();
    const [curSkip , setCurSkip] = useState(0);

    const data = useSelector(selectAllEmail);
    const status = useSelector(selectEmailStatus);
    const totalCount = useSelector(selectEmailTotalCount);
    const resetTable = useSelector(selectEmailResetTable);
    const emailCount = useSelector(selectEmailCount);

    const handleAdd = () => {
        popUpDispatch({type: 'add'});
    }

    const onChangePage = async (page , _) => {
        const skip = (page-1)*10;
        setCurSkip(skip);
        if(emailCount <= skip){
            try{
                await dispatch(getEmailsPage({skip})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }

    useEffect(() => {
        const req = async () => {
            try{
                await dispatch(getEmails({search: ''})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }

        req();
    } , []);


    return (
        <div className={style['email-page']}>
            <h1 className={style['email-title']}>emails</h1>

            <EmailFilterBar handleAdd={handleAdd}/>

            <DashboardTable 
                columns={columns}
                data={data.slice(curSkip , curSkip+10)}
                pending={status==='loading' || status==='idle' ? true : false}
                rowClick={(row) => {console.log(row)}}
                handleDelete={(row) => popUpDispatch({type:'delete' , id: row.id})}
                handleEdit={(row) => popUpDispatch({type:'edit' , id: row.id})}
                onChangePage={onChangePage}
                totalCount={totalCount}
                resetTable={resetTable}
            />  

            <PopUp open={popUpOption.isOpen} handleClose={() => popUpDispatch({type:'close'})} index={popUpOption.index}>
                <DeleteEmail id={popUpOption.id} handleClose={() => popUpDispatch({type:'close'})}/>
                <EditEmail id={popUpOption.id} handleClose={() => popUpDispatch({type:'close'})}/>
                <AddEmail handleClose={() => popUpDispatch({type:'close'})}/>
            </PopUp>
        </div>
    );
}

export default EmailPage;