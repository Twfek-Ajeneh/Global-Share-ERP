// import react
import React from 'react';
import clsx from 'clsx';

//import static data
import { difficultyData } from '../../../utils/selectorData';

// import style
import style from './DifficultyBox.module.css';

function DifficultyBox({difficulty , width , height}){
    return(
        <div
            className={clsx(
                style['difficulty-box'],
                {[style['difficulty-box-medium']] : difficulty?.toLowerCase()===difficultyData.medium},
                {[style['difficulty-box-high']] : difficulty?.toLowerCase()===difficultyData.high}
            )}
            style={{width , height}}
        >
            {difficulty?.toLowerCase()}
        </div>
    )
}

export default DifficultyBox;