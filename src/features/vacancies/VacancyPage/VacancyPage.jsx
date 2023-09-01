//import react
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import { 
    selectVacancyStatus,
    getVacancies, 
    selectVacancyTotalCount, 
    selectVacancyResetTable, 
    getVacanciesPage,
    selectVacancyCount,
    selectAllVacancy
} from '../VacancySlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import VacancyFilterBar from '../VacancyFilterBar/VacancyFilterBar';
import DashboardTable from '../../../common/components/Dashboard/DashboardTable/DashboardTable';
import PopUp from '../../../common/components/PopUp/PopUp';
import DeleteVacancy from '../PopUpComponents/DeleteVacancy/DeleteVacancy'

//import style
import style from './VacancyPage.module.css';

const columns = [
    {
        name: 'id',
        keys: ['id'],
        type: 'id',
    },
    {
        name: 'position',
        keys: ['position' , 'name'],
        type: 'normal'
    },
    {
        name: 'squad',
        keys: ['position' , 'squad' ,'name'],
        type: 'normal'
    },
    {   
        name: 'status',
        keys: ['isOpen'],
        type: 'vacancyStatus'
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
        case 'close': return {
            ...state,
            isOpen: false
        }
        default:
            return state;
    }
}

function VacancyPage(){
    const [popUpOption , popUpDispatch] = useReducer(popUpReducer , initPopUpOption);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [curSkip , setCurSkip] = useState(0);

    const data = useSelector(selectAllVacancy);
    const status = useSelector(selectVacancyStatus);
    const totalCount = useSelector(selectVacancyTotalCount);
    const resetTable = useSelector(selectVacancyResetTable);
    const vacancyCount = useSelector(selectVacancyCount);


    const handleAdd = () => nav('/dashboard/vacancy/add');

    const onChangePage = async (page , _) => {
        const skip = (page-1)*10;
        setCurSkip(skip);
        if(vacancyCount <= skip){
            try{
                await dispatch(getVacanciesPage({skip})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }

    useEffect(() => {
        const req = async () => {
            try{
                await dispatch(getVacancies({search: ''})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
        req();
    } , []);

    return (
        <div className={style['vacancies-page']}>
            <h1 className={style['vacancies-title']}>Vacancies</h1>

            <VacancyFilterBar handleAdd={handleAdd}/>

            <DashboardTable 
                columns={columns}
                data={data.slice(curSkip , curSkip+10)}
                pending={status==='loading' || status==='idle' ? true : false}
                rowClick={(row) => {}}
                handleDelete={(row) => popUpDispatch({type:'delete' , id: row.id})}
                handleEdit={(row) => nav(`edit/${row.id}`)}
                onChangePage={onChangePage}
                totalCount={totalCount}
                resetTable={resetTable}
            />
            
            <PopUp open={popUpOption.isOpen} handleClose={() => popUpDispatch({type:'close'})} index={popUpOption.index}>
                <DeleteVacancy id={popUpOption.id}  handleClose={() => popUpDispatch({type:'close'})}/>
            </PopUp>
        </div>
    );
}

export default VacancyPage;