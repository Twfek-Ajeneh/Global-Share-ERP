// import react
import React from 'react';

//import static data
import {recruitmentStatusData} from '../../../utils/selectorData.js';

// import style
import style from './FeedbackView.module.css';

function FeedbackView({feedback :{type , text}}){
    let title = '';
    switch(type?.toLowerCase()){
        case recruitmentStatusData.hr_approved:
            title = 'hr feedback';
            break;
        case recruitmentStatusData.orch_approved:
            title = 'orch feedback';
            break;
        case recruitmentStatusData.hr_interview_approved:
            title = 'HR-Interview feedback';
            break;
        case recruitmentStatusData.tech_interview_approved:
            title = 'tech-Interview feedback';
            break;
        case recruitmentStatusData.done:
            title = 'recruitment feedback'
            break;
        default:
            title = '';
    }
    
    return (
        <div className={style.feedback}>
            <h2>{title}</h2>
            <div>{text}</div>
        </div>
    );
}

export default FeedbackView;