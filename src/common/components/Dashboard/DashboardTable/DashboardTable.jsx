//import react
import React from 'react';

//import components
import DataTable from 'react-data-table-component';
import { 
    ColoredCell, 
    DateCell, 
    HeaderCell, 
    IdCell, 
    NextArrow,
    NormalCell, 
    PreviousArrow, 
    RecruitmentStatusCell, 
    StatusCell, 
    VacancyStatusCell 
} from '../DashboardCell/DashboardCell';
import Button from '../../Inputs/Button/Button';
import { CircularProgress } from '@mui/material';

// import icon & image
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import {ReactComponent as NoData} from '../../../../assets/icons/noData.svg';

// import style
import style from './DashboardTable.module.css';

function getProp(object , keys){
    let value = object;
    for(let i of keys){
        if(value) value = value[i];
    }
    return value;
}

const formatCell = (value , type) => {
    if(type==='id') return <IdCell id={value} />;
    else if(type==='normal') return <NormalCell value={value} />;
    else if(type==='status') return <StatusCell status={value} />;
    else if(type==='colored') return <ColoredCell value={value} />;
    else if(type==='recruitmentStatus') return <RecruitmentStatusCell recruitmentStatus={value} />;
    else if(type === 'vacancyStatus')  return <VacancyStatusCell vacancyStatus={value} />
    else if(type ==='date') return <DateCell date={value}/>
    return value;
}

const iconButton = (row , key , onClick) => {
    let icon  = <></>;
    
    if(key==='edit') icon = <FiEdit size="17px" color='var(--natural-alpha-1)' className={style['edit-icon']}/>;
    else if(key==='delete') icon = <BsTrash size="17px" color='var(--natural-alpha-1)' className={style['delete-icon']}/>;

    return <Button 
        onClick={() => onClick(row)} 
        backgroundColor="transparent"
    >
        {icon}
    </Button>;
}

function DashboardTable ({
        columns , data , 
        rowClick , pending ,
        handleDelete , handleEdit , onChangePage,
        totalCount, resetTable
    }){

    const initColumns = columns.map((col) => {
        if(col.type!=='button') return {
            name: <HeaderCell title={col.name}/>,
            sortable: true,
            selector: row => row[col.keys[0]],
            format: (row) => {
                if(col.keys[0]==='firstName') return formatCell(row.firstName+" "+row.lastName , col.type);
                if(col.keys[0]==='assignedTo') return formatCell(getProp(row , col.keys)+" "+getProp(row , ['assignedTo' , 'lastName']) , col.type);
                return formatCell(getProp(row , col.keys) , col.type)
            }
        }
        return {
            selector: (row) => row[col.keys[0]],
            format: (row) => iconButton(row , col.keys[0] , col.keys[0]==='delete' ? handleDelete : handleEdit),
            ignoreRowClick: true,
            button: true
        }
    });

    return (
        <DataTable
            columns={initColumns}
            data={data}
            responsive
            highlightOnHover
            pointerOnHover
            noDataComponent = {<EmptyTable />}
            // disabled
            // keyField
            onRowClicked={rowClick}
            progressPending={pending}
            progressComponent={<ProgressTable />}
            pagination
            paginationComponentOptions={{ noRowsPerPage: true }}
            paginationPerPage={10}
            paginationIconFirstPage={null}
            paginationIconLastPage={null}
            paginationIconNext={<NextArrow />}
            paginationIconPrevious={<PreviousArrow />}
            onChangePage={onChangePage}
            paginationServer={true}
            paginationTotalRows={totalCount}
            paginationResetDefaultPage={resetTable}
        />
    );
}


const EmptyTable = () => {
    return (
        <div className={style['empty-table']}>
            <NoData width='300px' height='300px'/>
            <p>Unfortunately, your query did not yield any results.</p>
        </div>
    );
}

const ProgressTable = () => {
    return (
        <div className={style['progress-table']}>
            <CircularProgress
                size='35px' 
                thickness={2} 
                sx={{ color: 'var(--primary-main)' }}
            />
        </div>
    );
}

export default DashboardTable;