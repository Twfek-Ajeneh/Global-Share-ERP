// import react
import React from "react";
import { format } from 'date-fns';

// import style
import style from './DateBox.module.css';

function DateBox ({date}){
    return (
        <div className={style.date}>
            {format(new Date(date) , 'MMM dd, yyyy')}
        </div>
    )
}

export default DateBox;