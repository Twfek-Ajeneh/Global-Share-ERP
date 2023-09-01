//import react
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

//import redux
import { useDispatch , useSelector } from 'react-redux';
import { 
    selectAllApplication,
    selectApplicationCount,
    selectApplicationResetTable,
    selectApplicationTotalCount,
    selectApplicationStatus,
    getApplicationsPage,
    getApplications,
} from '../ApplicationSlice';
import { showMessage } from '../../snackBar/snackBarSlice';

//import components
import ApplicationFilterBar from '../ApplicationFilterBar/ApplicationFilterBar';
import DashboardTable from '../../../common/components/Dashboard/DashboardTable/DashboardTable';

//import style
import style from './ApplicationPage.module.css';

const columns = [
    {
        name: 'id',
        keys: ['id'],
        type: 'id',
    },
    {
        name: 'vacancy id',
        keys: ['vacancyId'],
        type: 'id'
    },
    {
        name: 'Position',
        keys: ['vacancy' , 'position' , 'name'],
        type: 'normal'
    },
    {
        name: 'Squad',
        keys: ['vacancy' , 'position' , 'squad' , 'name'],
        type: 'normal',
    },
    {   
        name: 'status',
        keys: ['status'],
        type: 'recruitmentStatus'
    },
];

function ApplicationPage() {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [curSkip , setCurSkip] = useState(0);

    const data = useSelector(selectAllApplication);
    const status = useSelector(selectApplicationStatus);
    const totalCount = useSelector(selectApplicationTotalCount);
    const resetTable = useSelector(selectApplicationResetTable);
    const applicationCount = useSelector(selectApplicationCount);

    const onRowClick = (row) => nav(`${row.id}`);

    const onChangePage = async (page , _) => {
        const skip = (page-1)*10;
        setCurSkip(skip);
        if(applicationCount <= skip){
            try{
                await dispatch(getApplicationsPage({skip})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }

    useEffect(() => {
        const req = async () => {
            try{
                await dispatch(getApplications({search: ''})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
        
        req();
    } , []);


    return (
        <div className={style["application-page"]}>
            <h1 className={style['application-title']}>applications</h1>

            <ApplicationFilterBar />

            <DashboardTable 
                columns={columns}
                data={data.slice(curSkip , curSkip+10)}
                pending={status==='loading' || status ==='idle' ? true : false}
                rowClick={onRowClick}
                onChangePage={onChangePage}
                totalCount={totalCount}
                resetTable={resetTable}
            />
        </div>
    );
}

export default ApplicationPage;