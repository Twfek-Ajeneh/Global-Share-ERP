//import react
import React, { useEffect, useReducer , useState} from 'react';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import {
    getPositions,
    getPositionPage,
    selectAllPosition,
    selectPositionCount,
    selectPositionResetTable,
    selectPositionTotalCount,
    selectPositionStatus
} from '../PositionSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import DashboardTable from '../../../common/components/Dashboard/DashboardTable/DashboardTable';
import PopUp from '../../../common/components/PopUp/PopUp';
import DeletePosition from '../PopUpComponents/DeletePosition/DeletePosition';
import PositionFilterBar from '../PositionFilterBar/PositionFilterBar';
import EditPosition from '../PopUpComponents/EditPosition/EditPosition';
import AddPosition from '../PopUpComponents/AddPosition/AddPosition';

//import style 
import style from './PositionPage.module.css';

const columns = [
    {
        name: 'id',
        keys: ['id'],
        type: 'id',
    },
    {
        name: 'name',
        keys: ['name'],
        type: 'normal'
    },
    {
        name: 'gs name',
        keys: ['gsName'],
        type: 'normal'
    },
    {
        name: 'level',
        keys: ['gsLevel'],
        type: 'normal'
    },
    {
        name: 'squad',
        keys: ['squad' , 'name'],
        type: 'normal'
    },
    {
        name: 'weekly hours',
        keys: ['weeklyHours'],
        type: 'colored'
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

function PositionPage() {
    const [popUpOption , popUpDispatch] = useReducer(popUpReducer , initPopUpOption);
    const dispatch = useDispatch();
    const [curSkip , setCurSkip] = useState(0);

    const data = useSelector(selectAllPosition);
    const status = useSelector(selectPositionStatus);
    const totalCount = useSelector(selectPositionTotalCount);
    const resetTable = useSelector(selectPositionResetTable);
    const positionCount = useSelector(selectPositionCount);

    const handleAdd = () => {
        popUpDispatch({type:'add'});
    }

    const onChangePage = async (page , _) => {
        const skip = (page-1)*10;
        setCurSkip(skip);
        if(positionCount <= skip){
            try{
                await dispatch(getPositionPage({skip})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }


    useEffect(() => {
        const req = async () => {
            try{
                await dispatch(getPositions({search: '' , level: '' , squad: ''})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }

        req();
    } , []);

    return (
        <div className={style['position-page']}>
            <h1 className={style['positions-title']}>positions</h1>

            <PositionFilterBar handleAdd={handleAdd}/>

            <DashboardTable 
                columns={columns}
                data={data.slice(curSkip , curSkip+10)}
                pending={status==='loading' || status==='idle' ? true : false}
                rowClick={(row) => {}}
                handleDelete={(row) => popUpDispatch({type:'delete' , id: row.id})}
                handleEdit={(row) => popUpDispatch({type:'edit' , id: row.id})}
                onChangePage={onChangePage}
                totalCount={totalCount}
                resetTable={resetTable}
            />  

            <PopUp open={popUpOption.isOpen} handleClose={() => popUpDispatch({type:'close'})} index={popUpOption.index}>
                <DeletePosition id={popUpOption.id} handleClose={() => popUpDispatch({type:'close'})}/>
                <EditPosition id={popUpOption.id} handleClose={() => popUpDispatch({type:'close'})}/>
                <AddPosition handleClose={() => popUpDispatch({type:'close'})}/>
            </PopUp>
        </div>
    );
}

export default PositionPage;