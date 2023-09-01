// import react
import React , { useEffect, useState }  from 'react';
import { useForm , useFieldArray } from 'react-hook-form';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import {getRoles, selectVolunteerById , selectVolunteerRoles, updateVolunteer } from '../../VolunteerSlice';
import { showMessage } from '../../../snackBar/snackBarSlice';

// import components 
import InputField from '../../../../common/components/Inputs/InputField/InputField';
import Button from '../../../../common/components/Inputs/Button/Button';
import SubmitButton from '../../../../common/components/Inputs/SubmitButton/SubmitButton';
import Loader from '../../../../common/components/Loader/Loader';
import AsyncSelectInputField from '../../../../common/components/Inputs/AsyncSelectInputField/AsyncSelectInputField';

// import icons
import { IoCloseOutline } from "react-icons/io5";
import { BsTrash } from "react-icons/bs";

//import static data request
import { getPositionDataBySquad, getRolesData, getSquadsData } from '../../../../common/utils/selectorAPI';

//import style 
import style from './EditVolunteer.module.css';

function EditVolunteer({id , handleClose}) {
    const dispatch = useDispatch();
    const data = useSelector((state) => selectVolunteerById(state , id));
    const roles = useSelector(selectVolunteerRoles);
    const label = roles.filter(item => item.value===data.roleId);

    const {setError, control , register , formState: {errors , isDirty , dirtyFields} , handleSubmit , watch } = useForm({
        defaultValues:{
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            password: '',
            positions: data?.positions?.map(
                    element => ({
                            position: {value: element.position.id , label: element.position.name}, 
                            squad:{value: element.position.squadId , label: element.position.squad.gsName}
                        })),
            roleId: label?.at(0),
        },
        values:{
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            password: '',
            positions: data?.positions?.map(
                    element => ({
                            position: {value: element.position.id , label: element.position.name}, 
                            squad:{value: element.position.squadId , label: element.position.squad.gsName}
                        })),
            roleId: label?.at(0)
        }
    });

    const { 
        fields: positionsFields, 
        append: appendPosition, 
        remove: removePosition 
    } = useFieldArray({
        name: 'positions',
        control, 
    });

    const handleDelete = (e , index) => {
        e.preventDefault();
        if(positionsFields.length===1){
            setError(`positions.0.position` , { type: 'custom', message: 'at least one position required' })
            return;
        }
        removePosition(index)
    }

    const [isLoading , setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        setIsLoading(true);
        if(isDirty){
            const changed = {};
            for(let key of Object.keys(dirtyFields)){
                if(dirtyFields[key]){
                    if(key==='positions') changed[key] = values[key].map(item => ({positionId: item.position.value}))
                    else if(key==='roleId') changed[key] = values[key]?.value;
                    else changed[key] = values[key];
                }
            }
            try{
                await dispatch(updateVolunteer({id , ...changed})).unwrap();
                dispatch(showMessage({message: 'Volunteer Edited successfully' , severity: 1}));
                handleClose();
            }catch(error){
                dispatch(showMessage({message: error , severity: 2}));
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        dispatch(getRoles());
    } , [])

    if(isLoading===true){
        return (
            <div className={style["edit-volunteer"]}>
                <Loader transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style["edit-volunteer"]}>
            <div className={style["edit-volunteer-header"]}>
                <h2>Edit volunteer</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["edit-volunteer-body"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.box}>
                <InputField 
                        type='text'
                        name='firstName'
                        placeholder='First Name'
                        width='200px'
                        height='40px'
                        control={register('firstName' , { required: 'Please Enter The First Name' })}
                        errors={errors}
                    />
                    <InputField 
                        type='text'
                        name='lastName'
                        placeholder='Last Name'
                        width='200px'
                        height='40px'
                        control={register('lastName' , { required: 'Please Enter The Last Name' })}
                        errors={errors}
                    />
                </div>
                <div className={style.box}>
                    <InputField 
                        type='text'
                        name='email'
                        placeholder='Email'
                        width='230px'
                        height='40px'   
                        control={register('email' , {
                            required: 'Please enter the email',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "The email don't match the pattern"
                            },
                        })}
                        errors={errors}
                    />
                    <InputField 
                        type='password'
                        placeholder='Password'
                        name='password'
                        width='200px'
                        height='40px'  
                        control={register('password')}
                        errors={errors}
                    />
                </div>
                <div className={style.box}>
                    <AsyncSelectInputField
                        width='180px'
                        height='40px'
                        name='roleId'
                        placeholder='Role'
                        defaultOptions={[]}
                        control={control}
                        required={'enter the role'}
                        errors={errors}
                        border={true}
                        menuHeight={150}
                        callBack={(data) => getRolesData(data)}
                    />
                </div>
                <div className={style.break}></div>
                <div className={style.positions}>
                    { 
                        positionsFields?.map((field , index) => (
                            <div key={field.id}>
                                <div className={style.box}>
                                <AsyncSelectInputField
                                        width='180px'
                                        height='40px'
                                        name={`positions.${index}.squad`}
                                        placeholder='All Squads'
                                        defaultOptions={[]}
                                        control={control}
                                        required={'enter the squad'}
                                        errors={{[`positions.${index}.squad`]: errors.positions?.at(index)?.squad}}
                                        border={true}
                                        menuHeight={100}
                                        callBack={(data) => getSquadsData({...data})}
                                    />
                                    <AsyncSelectInputField
                                        width='210px'
                                        height='40px'
                                        name={`positions.${index}.position`}
                                        placeholder='All Positions'
                                        defaultOptions={[]}
                                        control={control}
                                        required='enter the position'
                                        errors={{[`positions.${index}.position`]: errors.positions?.at(index)?.position}}
                                        border={true}
                                        menuHeight={100}
                                        callBack={(data) => getPositionDataBySquad({...data , squadId: watch(`positions.${index}.squad`)?.value })}
                                    />
                                    <Button backgroundColor="var(--error-background)" width="40px" height="40px" onClick={(e) => handleDelete(e , index)}>
                                        <BsTrash size="18px" color='var(--error-main)'/>
                                    </Button>
                                </div>
                                <div className={style.break}></div>   
                            </div>
                        ))
                    }
                </div>
                <div className={style.buttons}>
                    <Button 
                        backgroundColor="var(--secondary-dark)" 
                        width="202px" 
                        height="40px" 
                        onClick={(e) => {
                            e.preventDefault();
                            appendPosition({position: '', squad: '' })
                        }}
                    >
                        Add Another Position
                    </Button>
                    <SubmitButton 
                        width='157px' 
                        height='40px'
                        disabled={isLoading || !isDirty}
                    >
                        Save
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default EditVolunteer;