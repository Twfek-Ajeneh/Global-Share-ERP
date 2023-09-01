// import react
import React , { useState }  from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import { selectPositionById , updatePosition} from '../../PositionSlice';
import { showMessage } from '../../../snackBar/snackBarSlice';

// import components 
import InputField from '../../../../common/components/Inputs/InputField/InputField';
import SelectInputField from "../../../../common/components/Inputs/SelectInputField/SelectInputField";
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import Loader from '../../../../common/components/Loader/Loader';
import FileUpload from '../../../../common/components/Inputs/FileUpload/FileUpload';
import AsyncSelectInputField from '../../../../common/components/Inputs/AsyncSelectInputField/AsyncSelectInputField';

// import icons
import { IoCloseOutline } from "react-icons/io5";

//import static data request
import { getSquadsData } from '../../../../common/utils/selectorAPI';

//import static data
import {levelData} from '../../../../common/utils/selectorData'

//import style 
import style from './EditPosition.module.css';

function EditPosition({id , handleClose}) {
    const dispatch = useDispatch();
    const data = useSelector((state) => selectPositionById(state , id));

    const {control , register , formState: {errors , isDirty , dirtyFields} , handleSubmit , watch , setValue} = useForm({
        defaultValues:{
            name : '',
            gsName : '',
            gsLevel : null,
            weeklyHours: '',
            jobDescription: null,
            squadId: null,
        },
        values: {
            name: data.name, 
            gsName: data.gsName, 
            weeklyHours: data.weeklyHours?.toString(), 
            gsLevel: {label: data.gsLevel?.toLowerCase() , value: data.gsLevel?.toLowerCase()},
            jobDescription: null,    
            squadId: {value: data.squadId , label: data.squad?.gsName},
        }
    })

    const [isLoading , setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        setIsLoading(true);
        if(isDirty || values.jobDescription){
            const changed = {};
            for(let key of Object.keys(dirtyFields)){
                if(dirtyFields[key]){
                    if(key==='gsLevel') changed[key] = values[key]?.value?.toUpperCase();
                    else if(key==='squadId') changed[key] = values[key]?.value;
                    else if(key==='weeklyHours') changed[key] = parseInt(values[key])
                    else changed[key] = values[key];
                }
            }
            if(values.jobDescription) changed.jobDescription = values.jobDescription;
            try{
                await dispatch(updatePosition({id , ...changed})).unwrap();
                dispatch(showMessage({message: 'Position Edited successfully' , severity: 1}));
                handleClose();
            }catch(error){
                dispatch(showMessage({message: error , severity: 2}));
                setIsLoading(false);
            }
        }
    }

    if(isLoading===true){
        return (
            <div className={style["edit-position"]}>
                <Loader  transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style["edit-position"]}>
            <div className={style["edit-position-header"]}>
                <h2>Edit Position</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["edit-position-body"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.box}>
                    <InputField 
                        type='text'
                        name='name'
                        placeholder='Name'
                        width='185px'
                        height='40px'
                        control={register('name' , { required: 'Please Enter the Name' })}
                        errors={errors}
                    />
                    <InputField 
                        type='text'
                        name='gsName'
                        placeholder='Gs Name'
                        width='185px'
                        height='40px'
                        control={register('gsName' , { required: 'Please Enter The Gs Name' })}
                        errors={errors}
                    />
                </div>
                <div className={style.box}>
                    <SelectInputField
                        width='185px'
                        height='40px'
                        name='gsLevel'
                        placeholder='Levels'
                        options={Object.values(levelData)}
                        control={control}
                        required={'enter the level'}
                        errors={errors}
                        border={true}
                        menuHeight={100}
                    />
                    <InputField 
                        type='text'
                        placeholder='Weekly Hours'
                        name='weeklyHours'
                        width='185px'
                        height='40px'  
                        control={register('weeklyHours' , {
                            required: 'Please enter the weekly Hours',
                            pattern: {
                                value: /^\d+$/,
                                message: 'should be a Number'
                            }
                        })}
                        errors={errors}
                    />
                </div>
                <FileUpload
                    name='jobDescription'
                    file={watch("jobDescription")}
                    setValue={setValue}
                    width="422px"   
                    height='40px'
                    label={data.jobDescription ? data.jobDescription : 'Upload the job Description'}
                    types={["pdf", "docx"]}
                    row={true}
                />
                <div className={style.buttons}>
                    <div className={style.squad}>
                        <AsyncSelectInputField
                            width='200px'
                            height='40px'
                            name='squadId'
                            placeholder='squad'
                            defaultOptions={[]}
                            control={control}
                            required={'enter the squad'}
                            errors={errors}
                            border={true}
                            placement='top'
                            callBack={(data) => getSquadsData(data)}
                        />
                    </div>
                    <SubmitButton 
                        width='157px' 
                        height='40px'
                        disabled={(isLoading || (isDirty===false && watch('jobDescription')===null))}
                    >
                        Edit Position
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default EditPosition;