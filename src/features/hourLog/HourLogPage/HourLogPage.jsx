//import react
import React, { useEffect , useState} from 'react';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import {
    getHourLog,
    getHourLogPage,
    selectAllHourLog,
    selectHourLogCount,
    selectHourLogResetTable,
    selectHourLogStatus,
    selectHourLogTotalCount
} from '../hourLogSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import HourLogFilterBar from '../HourLogFilterBar/HourLogFilterBar';
import DashboardTable from '../../../common/components/Dashboard/DashboardTable/DashboardTable';

// import style
import style from './HourLogPage.module.css';
import { useNavigate } from 'react-router';

const columns = [
    {
        name: 'id',
        keys: ['id'],
        type: 'id'
    },
    {
        name: 'title',
        keys: ['title'],
        type: 'normal'
    },
    {
        name: 'assignee',
        keys: ['assignedTo' , 'firstName'],
        type: 'normal'
    },
    {
        name: 'Deadline',
        keys: ['deadline'],
        type: 'date'
    },
    {
        name: 'Hours Taken',
        keys: ['takenHours'],
        type: 'colored'
    }
]

function HourLogPage () {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [curSkip , setCurSkip] = useState(0);

    const data = useSelector(selectAllHourLog);
    const status = useSelector(selectHourLogStatus);
    const totalCount = useSelector(selectHourLogTotalCount);
    const resetTable = useSelector(selectHourLogResetTable);
    const hourLogCount = useSelector(selectHourLogCount);

    const onChangePage = async (page , _) => {
        const skip = (page-1)*10;
        setCurSkip(skip);
        if(hourLogCount <= skip){
            try{
                await dispatch(getHourLogPage({skip})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }

    useEffect(() => {
        const req = async () => {
            try{
                await dispatch(getHourLog({search: '' , squadId: ''})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
        
        req();
    } , []);

    return (
        <div className={style['hour-log-page']}>
            <h1 className={style['hour-log-title']}>Hour Log</h1>

            <HourLogFilterBar />

            <DashboardTable 
                columns={columns}
                data={data.slice(curSkip , curSkip+10)}
                pending={status==='loading' || status==='idle' ? true : false}
                rowClick={(row) => nav(`/dashboard/user/${row.assignedTo.id}`) }
                onChangePage={onChangePage}
                totalCount={totalCount}
                resetTable={resetTable}
            />  
        </div>
    ); 
}

export default HourLogPage;