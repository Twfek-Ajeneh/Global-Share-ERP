// import react
import React , { useState }  from 'react';
import { useForm } from 'react-hook-form';

//import redux
import { useDispatch } from 'react-redux';
import {createPosition} from '../../PositionSlice';
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
import {getSquadsData} from '../../../../common/utils/selectorAPI';

//import static data
import {levelData} from '../../../../common/utils/selectorData'

//import style 
import style from './AddPosition.module.css';

function AddPosition({handleClose}) {
    const dispatch = useDispatch();
    const {control , register , formState : {errors} , handleSubmit , watch , setValue} = useForm({
        defaultValues:{
            name : '',
            gsName : '',
            gsLevel : null,
            weeklyHours: '',
            jobDescription: null,
            squadId: null,
        }
    })

    const [isLoading , setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        try{
            setIsLoading(true);
            await dispatch(createPosition({
                name: values.name,
                gsName: values.gsName,
                gsLevel: values.gsLevel?.value?.toUpperCase(),
                weeklyHours: parseInt(values.weeklyHours),
                squadId: values.squadId?.value,
                jobDescription: values.jobDescription
            })).unwrap();
            dispatch(showMessage({message: 'Position Added successfully' , severity: 1}));
            handleClose();
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading===true){
        return (
            <div className={style["add-position"]}>
                <Loader  transparent={true}/>
            </div>
        );
    }
    
    return (
        <div className={style["add-position"]}>
            <div className={style["add-position-header"]}>
                <h2>Add Position</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["add-position-body"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.box}>
                    <InputField 
                        type='text'
                        name='name'
                        placeholder='Name'
                        width='200px'
                        height='40px'
                        control={register('name' , { required: 'Please Enter the Name' })}
                        errors={errors}
                    />
                    <InputField 
                        type='text'
                        name='gsName'
                        placeholder='Gs Name'
                        width='200px'
                        height='40px'
                        control={register('gsName' , { required: 'Please Enter The Gs Name' })}
                        errors={errors}
                    />
                </div>
                <div className={style.box}>
                    <SelectInputField
                        width='200px'
                        height='40px'
                        name='gsLevel'
                        placeholder='Levels'
                        options={Object.values(levelData)}
                        control={control}
                        required={'enter the level'}
                        errors={errors}
                        border={true}
                        menuHeight={150}
                    />
                    <InputField 
                        type='text'
                        placeholder='Weekly Hours'
                        name='weeklyHours'
                        width='200px'
                        height='40px'  
                        control={register('weeklyHours' , {
                            required: 'enter the weekly Hours',
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
                    label='Upload the job Description'
                    types={["pdf", "docx"]}
                    row={true}
                    required={true}
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
                        disabled={isLoading}
                    >
                        Add Position
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default AddPosition;