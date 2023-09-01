// import react
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

//import redux
import { useSelector , useDispatch} from "react-redux";
import {selectProfileSquads , getMyProfileDetails } from '../../profile/profileSlice';
import { resetSearchTerms, selectTaskStatus , getTasksBySquad, selectTaskSearchTerms} from "../taskSlice";
import { showMessage } from "../../snackBar/snackBarSlice";

//import components
import InputField from '../../../common/components/Inputs/InputField/InputField';
import SelectInputField from "../../../common/components/Inputs/SelectInputField/SelectInputField";
import MultiSelectInputField from "../../../common/components/Inputs/MultiSelectInputField/MultiSelectInputField";
import SubmitButton from "../../../common/components/Inputs/SubmitButton/SubmitButton";
import { FiSearch } from "react-icons/fi";
import { RxReset } from "react-icons/rx";

//import static data request
import { getMemberData } from "../../../common/utils/selectorAPI";

//import static data
import {priorityData , difficultyData} from '../../../common/utils/selectorData';

//import style
import style from './TaskFilterBar.module.css';

function TaskFilterBar (){
    const dispatch = useDispatch();
    const profileSquads = useSelector(selectProfileSquads);
    const squadOption = profileSquads.map(squad => ({value: squad.id , label: squad.gsName}))  ;
    const status = useSelector(selectTaskStatus);
    const {search , member , priority , difficulty , squadId} = useSelector(selectTaskSearchTerms);

    const {control , register , watch , reset , handleSubmit , setValue} = useForm({
        defaultValues:{
            search: search ? search :  '',
            member: member ? member : [],
            priority: priority ? priority : [],
            difficulty: difficulty ? difficulty :  [],
            squadId: squadId ? squadId : null
        }
    });

    const handleReset = () => {
        dispatch(resetSearchTerms());
        reset({
            search: '',
            member: [],
            priority: [],
            difficulty: [],
            squadId: null,
        });
    }

    const onSubmit = async (values) => {
        const {search , member , priority , difficulty , squadId} = values;
        try{
            await dispatch(getTasksBySquad({
                search,
                member: member,
                priority: priority,
                difficulty: difficulty,
                squadId: squadId,
            })).unwrap();
        }catch(error){
            if(error?.name==="ConditionError") return;
            dispatch(showMessage({message: error , severity: 2}));
        }
    }

    useEffect(() => {
        const req = async () => {
            try{
                const response = await dispatch(getMyProfileDetails()).unwrap();
                const {id , gsName} = response.positions[0]?.position?.squad;
                const squad = {value : id , label : gsName};
                if(squadId===undefined){
                    await dispatch(getTasksBySquad({
                        search: '',
                        member: [],
                        priority: [],
                        difficulty: [],
                        squadId: squad,
                    })).unwrap();
                    setValue('squadId' , squad);
                }
            }catch(error){  
                if(error?.name==="ConditionError") return;
                if(typeof error !== 'string') dispatch(showMessage({message: 'Network connection error' , severity: 2}));
                else dispatch(showMessage({message: error , severity: 2}));
            }
        }
        req();
    } , [])

    return (
        <form className={style['filter-bar']} onSubmit={handleSubmit(onSubmit)} >
            <InputField 
                type='text'
                name='search'
                placeholder='Search'
                width='277px'
                height='40px'
                control={register('search')}
            />
            <MultiSelectInputField 
                width='200px'
                height='40px'
                name='member'
                placeholder='All Members'
                control={control}
                options={[]}
                callBack={(data) => getMemberData({...data , squadId: watch('squadId')?.value})}
            />
            <SelectInputField
                width='200px'
                height='40px'
                name='priority'
                placeholder='All Priorities'
                options={Object.values(priorityData)}
                control={control}
                isMulti={true}
            />
            <SelectInputField
                width='200px'
                height='40px'
                name='difficulty'
                placeholder='All Complexities'
                options={Object.values(difficultyData)}
                control={control}
                isMulti={true}
            />
            <SelectInputField
                width='200px'
                height='40px'
                name='squadId'
                placeholder='All Squads'
                options={[]}
                readyOptions={squadOption}
                control={control}
            />
            <span className={style['bar-buttons']}>
                <SubmitButton 
                    width='40px'
                    height='30px'
                    disabled={(status==='loading' || watch('squadId')===null) ? true : false}
                >
                    <FiSearch size='15px'/>
                </SubmitButton> 
                <span 
                    className={style.reset} 
                    style={{
                        pointerEvents: status==='loading' ? 'none' : 'auto'
                    }}
                    onClick={handleReset}
                >
                    <RxReset size='15px'/>    
                </span>
            </span>
            <span className={style['inner-border']}></span>
        </form>
    );
}

export default TaskFilterBar;