// import react
import React from 'react';
import clsx from 'clsx';

//import static data
import {recruitmentStatusData} from '../../../utils/selectorData.js';

//import style
import style from './RecruitmentStatus.module.css';

function RecruitmentStatus({recruitmentStatus , width , height}){
    return (
        <div className={
            clsx(
                style['status-box'],
                {[style['status-box-warning']] : recruitmentStatus?.toLowerCase()===recruitmentStatusData.applied},
                {[style['status-box-error']] : recruitmentStatus?.toLowerCase()===recruitmentStatusData.refused}
            )}
            style={{width , height}}
        >
            {recruitmentStatus?.toLowerCase()}
        </div>
    );
}

export default RecruitmentStatus;