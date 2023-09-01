// import react
import React , { useState }  from 'react';
import { useForm , useFieldArray } from 'react-hook-form';

//import redux
import { useDispatch } from 'react-redux';
import { createVolunteer } from '../../VolunteerSlice';
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

//import select data request
import { getPositionDataBySquad, getRolesData, getSquadsData } from '../../../../common/utils/selectorAPI';

//import style 
import style from './AddVolunteer.module.css';

function AddVolunteer({handleClose}) {
    const dispatch = useDispatch();
    const {control , register , formState : {errors} , handleSubmit , watch , setError } = useForm({
        defaultValues:{
            firstName : '',
            lastName : '',
            email : '',
            password: '',
            positions: [{position: null , squad: null}],
            roleId: null
        }
    });


    const { 
        fields: positionsFields, 
        append: appendPosition, 
        remove: removePosition, 
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
        try{

            setIsLoading(true);
            await dispatch(createVolunteer({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                roleId: values.roleId?.value,
                positions: values.positions.map(item => ({positionId: item.position.value}))
            })).unwrap();
            dispatch(showMessage({message: 'Volunteer Added successfully' , severity: 1}));
            handleClose();
        }catch(error){
            dispatch(showMessage({message: error , severity: 2}));
            setIsLoading(false);
        }
    }

    if(isLoading===true){
        return (
            <div className={style["add-volunteer"]}>
                <Loader  transparent={true}/>
            </div>
        );
    }

    return (
        <div className={style["add-volunteer"]}>
            <div className={style["add-volunteer-header"]}>
                <h2>Add Volunteer</h2>
                <IoCloseOutline 
                    size='20px' 
                    color='var(--natural-alpha-1)' 
                    cursor='pointer' 
                    onClick={handleClose}
                />
            </div>
            <form className={style["add-volunteer-body"]} onSubmit={handleSubmit(onSubmit)}>
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
                        control={register('password' , { required: 'Please enter the password' })}
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
                            appendPosition({position: null, squad: null })
                        }}
                    >
                        Add Another Position
                    </Button>
                    <SubmitButton 
                        width='157px' 
                        height='40px'
                        disabled={isLoading}
                    >
                        Add Volunteer
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default AddVolunteer;