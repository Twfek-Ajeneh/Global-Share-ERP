// import react
import React from 'react';
import clsx from 'clsx';

//import static data
import {statusesData} from '../../../utils/selectorData';

//import style
import style from './VolunteerStatus.module.css';

function VolunteerStatus({volunteerStatus , width , height}){
    return (
        <div className={
            clsx(
                style['status-box'],
                {[style['status-box-warning']] : volunteerStatus?.toLowerCase() === statusesData.freeze},
                {[style['status-box-error']] : volunteerStatus?.toLowerCase() === statusesData.left}
            )}
            style={{width , height}}
        >
            {volunteerStatus?.toLowerCase()}
        </div>
    );
}

export default VolunteerStatus;