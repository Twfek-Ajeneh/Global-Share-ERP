// import react
import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import { getApplicationById, selectApplicationById , selectApplicationStatus } from '../ApplicationSlice'
import {showMessage}from '../../snackBar/snackBarSlice';

//import components
import Loader from '../../../common/components/Loader/Loader';
import Error from '../../../common/components/Error/Error';
import RecruitmentStatus from '../../../common/components/StatusBoxes/RecruitmentStatus/RecruitmentStatus';
import Button from '../../../common/components/Inputs/Button/Button';
import PopUp from '../../../common/components/PopUp/PopUp';
import RefuseApplication from '../PopUpComponents/RefuseApplication/RefuseApplication';
import ChangeApplicationPosition from '../PopUpComponents/ChangeApplicationPosition/ChangeApplicationPosition';
import ApproveAsHr from '../PopUpComponents/ApproveAsHR/ApproveAsHR';
import ApproveAsOrch from '../PopUpComponents/ApproveAsOrch/ApproveAsOrch';
import ApproveHRInterview from '../PopUpComponents/ApproveHRInterview/ApproveHRInterview';
import ApproveTechInterview from '../PopUpComponents/ApproveTechInterview/ApproveTechInterview';
import ConfirmRecruitment from '../PopUpComponents/ConfirmRecruitment/ConfirmRecruitment';
import FeedbackView from '../../../common/components/QuestionsView/FeedbackView/FeedbackView';
import { Divider } from '@mui/material';
import Masonry from "react-responsive-masonry"; 
import TextView from '../../../common/components/QuestionsView/TextView/TextView';
import CheckboxView from '../../../common/components/QuestionsView/CheckboxView/CheckboxView';
import RadioView from '../../../common/components/QuestionsView/RadioView/RadioView';
import FileView from '../../../common/components/QuestionsView/FileView/FileView';

//import static data
import { questionTypeData, recruitmentStatusData } from '../../../common/utils/selectorData';

// import style 
import style from './ApplicationDetails.module.css';

const getTitle = (status) => {
    switch(status.toLowerCase()){
        case recruitmentStatusData.applied:
            return {title: 'Approve As HR' , index: 2};
        case recruitmentStatusData.hr_approved:
            return {title: 'Approve As Orch' , index: 3};
        case recruitmentStatusData.orch_approved:
            return {title :'Approve HR-Interview' , index: 4};
        case recruitmentStatusData.hr_interview_approved:
            return {title: 'Approve Tech-Interview' , index: 5};
        case recruitmentStatusData.tech_interview_approved:
            return {title:'Recruit', index: 6};
        default:
            return '';
    }
}

const initPopUpOption = {
    isOpen: false,
    index: 0,
}

const popUpReducer = (state , action) => {
    switch(action.type){
        case 'refuse': return {
            ...initPopUpOption,
            isOpen: true,
            index: 0
        }
        case 'change': return {
            ...initPopUpOption,
            isOpen: true,
            index: 1,
        }
        case 'approve': return {
            ...initPopUpOption,
            isOpen: true,
            index: action.index,
        }
        case 'close': return {
            ...state,
            isOpen: false
        }
        default:
            return state;
    }
}

function ApplicationDetails(){
    const {applicationId : id} = useParams();
    const [popUpOption , popUpDispatch] = useReducer(popUpReducer , initPopUpOption);
    const dispatch = useDispatch();
    
    const status = useSelector(selectApplicationStatus);
    const data = useSelector(state => selectApplicationById(state , id));

    const handlePopUpClose = () => popUpDispatch({type:'close'});

    useEffect(() => {
        const req = async () => {
            try{
                await dispatch(getApplicationById({id})).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }

        req();
    } , []);

    if(status==='loading' || status==='idle'){
        return (
            <div className={style['application-details-page']}>
                <Loader />
            </div>
        );
    }

    else if(status==='failed'){
        return (
            <div className={style['application-details-page']}>
                <Error />
            </div>
        );
    }

    return (
        <div className={style['application-details-page']}> 
            <div className={style['application-details']}>
                <h1 className={style['application-details-title']}>
                    Application #{data?.id}
                </h1>   
                <div className={style['application-details-info']}>
                    {data?.vacancy?.position?.name} 
                    <span>&#9679;</span>
                    {data?.vacancy?.position?.squad?.name}
                    <RecruitmentStatus recruitmentStatus={data?.status}/>
                </div>

                { data?.feedbacks?.length!==0 && 
                    <>
                    <Divider textAlign='center' role="presentation"><span className={style.divider}>feedbacks</span></Divider>
                    <Masonry className={style['application-feedbacks']} columnsCount={2} gutter='30px' >
                        {
                            data?.feedbacks?.map((feedback) => (
                                <FeedbackView key={feedback.id} feedback={feedback}/>
                            ))
                        }
                    </Masonry>
                    </>
                }

                <Divider textAlign='center'><span className={style.divider}>results</span></Divider>
                <Masonry className={style['application-questions']} columnsCount={2} gutter='30px'>
                    {
                        data?.answers?.map((answer) => {
                            if(answer?.question?.question?.type?.toLowerCase()===questionTypeData.long || 
                                answer?.question?.question?.type?.toLowerCase()===questionTypeData.short){
                                    return <TextView key={answer?.id} title={answer?.question?.question?.text} answer={answer?.content[0]}/>
                                }
                            else if(answer?.question?.question?.type?.toLowerCase()===questionTypeData.radio){
                                return <RadioView key={answer?.id} title={answer?.question?.question?.text} options={answer?.question?.question?.options} answer={answer?.content[0]} />
                            }   
                            else if(answer?.question?.question?.type?.toLowerCase()===questionTypeData.checkbox){
                                return <CheckboxView key={answer?.id} title={answer?.question?.question?.text} options={answer?.question?.question?.options} answer={answer?.content}/>
                            }
                            return <FileView key={answer?.id} title={answer?.question?.question?.text} link={answer?.content[0]} name={answer?.content[0]}/>
                        })
                    }
                </Masonry>

                { (data?.status?.toLowerCase()!==recruitmentStatusData.done && data?.status?.toLowerCase()!==recruitmentStatusData.refused) &&
                    <div className={style['application-buttons']}>
                        <Button 
                            backgroundColor='var(--error-main)'
                            color='white'
                            width='150px'
                            height='40px'
                            onClick={() => popUpDispatch({type: 'refuse'})}
                        >
                            refuse
                        </Button>
                        <Button 
                            backgroundColor='var(--secondary-dark)'
                            color='white'
                            width='150px'
                            height='40px'
                            onClick={() => popUpDispatch({type: 'approve' , index: getTitle(data?.status).index})}
                        >
                            {getTitle(data?.status).title}
                        </Button>
                    </div>
                }

                <PopUp open={popUpOption.isOpen} handleClose={handlePopUpClose} index={popUpOption.index}>
                    <RefuseApplication id={id} handleClose={handlePopUpClose}/>
                    <ChangeApplicationPosition id={id} position={data?.vacancy?.position?.name}  handleClose={handlePopUpClose}/>
                    <ApproveAsHr id={id} handleClose={handlePopUpClose}/>
                    <ApproveAsOrch id={id} handleClose={handlePopUpClose}/>
                    <ApproveHRInterview id={id} handleClose={handlePopUpClose}/>
                    <ApproveTechInterview id={id} handleClose={handlePopUpClose}/>
                    <ConfirmRecruitment id={id} handleClose={handlePopUpClose}/>
                </PopUp>
            </div>
        </div>
    );
}

export default ApplicationDetails;