//import react
import React, { useEffect, useReducer, useState } from 'react';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import { 
    selectSquadStatus,
    getSquads, 
    selectSquadTotalCount, 
    selectSquadResetTable, 
    getSquadsPage,
    selectSquadCount,
    selectAllSquad
} from '../squadSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import SquadFilterBar from '../SquadFilterBar/SquadFilterBar';
import DashboardTable from '../../../common/components/Dashboard/DashboardTable/DashboardTable';
import PopUp from '../../../common/components/PopUp/PopUp';
import DeleteSquad from '../PopUpComponents/DeleteSquad/DeleteSquad';
import AddSquad from '../PopUpComponents/AddSquad/AddSquad';
import EditSquad from '../PopUpComponents/EditSquad/EditSquad';

//import style
import style from './SquadPage.module.css';

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

function SquadPage(){
    const [popUpOption , popUpDispatch] = useReducer(popUpReducer , initPopUpOption);
    const dispatch = useDispatch();
    const [curSkip , setCurSkip] = useState(0);

    const data = useSelector(selectAllSquad);
    const status = useSelector(selectSquadStatus);
    const totalCount = useSelector(selectSquadTotalCount);
    const resetTable = useSelector(selectSquadResetTable);
    const squadCount = useSelector(selectSquadCount);
    
    const handleAdd = () => {
        popUpDispatch({type:'add'});
    }

    const onChangePage = async (page , _) => {
        const skip = (page-1)*10;
        setCurSkip(skip);
        if(squadCount <= skip){
            try{
                await dispatch(getSquadsPage({skip})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }

    useEffect(() => {

        const req = async () => {
            try{
                await dispatch(getSquads({search: ''})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }

        req();
    } , []);

    return (
        <div className={style['squad-page']}>
            <h1 className={style['squad-title']}>squads</h1>

            <SquadFilterBar handleAdd={handleAdd}/>

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
                <DeleteSquad id={popUpOption.id}  handleClose={() => popUpDispatch({type:'close'})}/>
                <EditSquad id={popUpOption.id}  handleClose={() => popUpDispatch({type:'close'})}/>
                <AddSquad handleClose={() => popUpDispatch({type:'close'})}/>
            </PopUp>
        </div>
    );
}

export default SquadPage;