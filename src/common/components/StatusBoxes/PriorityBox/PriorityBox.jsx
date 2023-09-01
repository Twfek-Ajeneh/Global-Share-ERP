// import react
import React from 'react';
import clsx from 'clsx';

//import static data
import { priorityData } from '../../../utils/selectorData';

// import style
import style from './Priority.module.css';

function PriorityBox({priority , width , height}){
    return(
        <div
            className={clsx(
                style['priority-box'],
                {[style['priority-box-important']] : priority?.toLowerCase()===priorityData.important},
                {[style['priority-box-urgent']] : priority?.toLowerCase()===priorityData.urgent}
            )}
            style={{width , height}}
        >
            {priority?.toLowerCase()}
        </div>
    )
}

export default PriorityBox;