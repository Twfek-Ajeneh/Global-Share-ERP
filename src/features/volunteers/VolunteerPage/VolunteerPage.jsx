//import react
import React, { useEffect, useReducer , useState} from 'react';
import { useNavigate } from 'react-router';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import {
    getVolunteers,
    getVolunteerPage,
    selectAllVolunteer,
    selectVolunteerCount,
    selectVolunteerResetTable,
    selectVolunteerTotalCount,
    selectVolunteerStatus,
} from '../VolunteerSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import DashboardTable from '../../../common/components/Dashboard/DashboardTable/DashboardTable';
import PopUp from '../../../common/components/PopUp/PopUp';
import DeleteVolunteer from '../PopUpComponents/DeleteVolunteer/DeleteVolunteer';
import VolunteerFilterBar from '../VolunteerFilterBar/VolunteerFilterBar';
import EditVolunteer from '../PopUpComponents/EditVolunteer/EditVolunteer';
import AddVolunteer from '../PopUpComponents/AddVolunteer/AddVolunteer';

//import style 
import style from './VolunteerPage.module.css';

const columns = [
    {
        name: 'id',
        keys: ['id'],
        type: 'id',
    },
    {
        name: 'full name',
        keys: ['firstName'],
        type: 'normal'
    },
    {
        name: 'squad',
        keys: ['positions' , '0' , 'position' , 'squad' , 'gsName'],
        type: 'normal'
    },
    {
        name: 'position',
        keys: ['positions' , '0' , 'position' , 'name'],
        type: 'normal'
    },
    {
        name: 'level',
        keys: ['positions' , '0' , 'position' , 'gsLevel'],
        type: 'normal'
    },
    {
        name: 'status',
        keys: ['gsStatus'],
        type: 'status'
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

function VolunteerPage(){
    const [popUpOption , popUpDispatch] = useReducer(popUpReducer , initPopUpOption);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [curSkip , setCurSkip] = useState(0);

    const data = useSelector(selectAllVolunteer);
    const status = useSelector(selectVolunteerStatus);
    const totalCount = useSelector(selectVolunteerTotalCount);
    const resetTable = useSelector(selectVolunteerResetTable);
    const volunteerCount = useSelector(selectVolunteerCount);

    const handleAdd = () => popUpDispatch({type:'add'});

    const onChangePage = async (page , _) => {
        const skip = (page-1)*10;
        setCurSkip(skip);
        if(volunteerCount <= skip){
            try{
                await dispatch(getVolunteerPage({skip})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }

    useEffect(() => {
        const req = async () => {
            try{
                await dispatch(getVolunteers({
                    search:'', 
                    level: '',
                    status: '', 
                    position: '', 
                    squad: ''
                })).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
        
        req();
    } , []);

    return (
        <div className={style['volunteer-page']}>
            <h1 className={style['volunteers-title']}>Volunteers</h1>

            <VolunteerFilterBar handleAdd={handleAdd}/>

            <DashboardTable 
                columns={columns}
                data={data.slice(curSkip , curSkip+10)}
                pending={status==='loading' || status==='idle' ? true : false}
                rowClick={({id}) => nav(`/dashboard/user/${id}`)}
                handleDelete={(row) => popUpDispatch({type:'delete' , id: row.id})}
                handleEdit={(row) => popUpDispatch({type:'edit' , id: row.id})}
                onChangePage={onChangePage}
                totalCount={totalCount}
                resetTable={resetTable}
            />  

            <PopUp open={popUpOption.isOpen} handleClose={() => popUpDispatch({type:'close'})} index={popUpOption.index}>
                <DeleteVolunteer id={popUpOption.id} handleClose={() => popUpDispatch({type:'close'})}/>
                <EditVolunteer id={popUpOption.id} handleClose={() => popUpDispatch({type:'close'})}/>
                <AddVolunteer handleClose={() => popUpDispatch({type:'close'})}/>
            </PopUp>
        </div>
    );
}

export default VolunteerPage;