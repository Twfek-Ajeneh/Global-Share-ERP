//import react
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import {getMyProfileDetails, selectProfileData, selectProfileStatus , updateProfileDetails} from '../profileSlice';
import {showMessage} from '../../snackBar/snackBarSlice';

//import components
import SubmitButton from '../../../common/components/Inputs/SubmitButton/SubmitButton';
import InputField from '../../../common/components/Inputs/InputField/InputField';
import Loader from '../../../common/components/Loader/Loader';
import Error from '../../../common/components/Error/Error';
import Button from '../../../common/components/Inputs/Button/Button';
import TextAreaField from '../../../common/components/Inputs/TextAreaField/TextAreaField';
import { Avatar } from '@mui/material';

//import icon & image
import profileImage from '../../../assets/images/profile.png';

//import style
import style from './EditProfile.module.css';
import FileUpload from '../../../common/components/Inputs/FileUpload/FileUpload';

function EditProfile (){
    const nav = useNavigate();
    const dispatch = useDispatch();

    const status = useSelector(selectProfileStatus);
    const data = useSelector(selectProfileData);

    const {
        register, 
        formState: {errors , isDirty , dirtyFields}, 
        handleSubmit, 
        setValue, 
        watch
    } = useForm({
        defaultValues:{ 
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
            additionalEmail: '',
            arabicFullName: '',
            joinDate: '',
            phoneNumber: '',
            appointlet: '',
            bio: '',
            cv: null
        },
        values: {
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            email: data.email,
            additionalEmail: data.additionalEmail,
            arabicFullName: data.arabicFullName,
            joinDate: data.joinDate,
            phoneNumber: data.phoneNumber,
            appointlet: data.appointlet,
            bio: data.bio,
            cv: null
        }
    })

    const onSubmit = async (values) => {
        if(isDirty || values.cv){
            const changed = {};
            for(let key of Object.keys(dirtyFields)){
                if(dirtyFields[key]){
                    changed[key] = values[key];
                }
            }
            if(values.cv) changed.cv = values.cv;
            try{
                await dispatch(updateProfileDetails(changed)).unwrap();
                nav('/dashboard/profile');
            }
            catch(error){
                dispatch(showMessage({message: error , severity: 2}));
            }
        }
    }

    useEffect(() => {
        const req = async() => {
            try{
                await dispatch(getMyProfileDetails()).unwrap();
            }catch(error){
                if(error?.name==="ConditionError") return;
                dispatch(showMessage({message: error , severity: 2}));
            }
        }

        req();
    }, [])


    if(status === 'loading' || status === 'idle'){
        return(
            <div className={style['profile-page']}>
                <Loader />
            </div>
        );  
    }

    else if(status === 'failed'){
        return (
            <div className={style['profile-page']}>
                <Error />
            </div>
        );
    }

    else{
        return (
            <div className={style['profile-page']}>
                <div className={style['profile-header']}>
                    <div className={style['header-background']}></div>
                    <div className={style['header-content']}>
                        <div className={style.image}>
                            <Avatar 
                                src={profileImage}
                                alt='Ahmad Alshahal' 
                                sx={{ width: '150px',  height: '150px' , backgroundColor: 'white'}} 
                            />
                        </div>

                        <div className={style['header-info']}>
                            <div className={style['header-name']}>
                                <h2>{`${data?.firstName} ${data?.middleName} ${data?.lastName}`}</h2>
                            </div>
                        </div>
                        <Button 
                            width='80px' 
                            height='40px' 
                            color='black' 
                            backgroundColor='white' 
                            onClick={() => nav('/dashboard/profile')}
                        >
                            cancel
                        </Button>
                    </div>
                </div>

                <form className={style['profile-body']} onSubmit={handleSubmit(onSubmit)}>
                    <div className={style.box}>
                        <InputField
                            type='text'
                            name='firstName'
                            placeholder='First Name'
                            width='233px'
                            height='45px'   
                            control={register('firstName' , { required: 'Please enter your first name' })}
                            errors={errors}
                        >
                            First Name
                        </InputField>
                        <InputField
                            type='text'
                            name='middleName'
                            placeholder='Middle name'
                            width='233px'
                            height='45px'   
                            control={register('middleName' , { required: 'Please enter your middle name' })}
                            errors={errors}
                        >
                            Middle name
                        </InputField>
                        <InputField
                            type='text'
                            name='lastName'
                            placeholder='Last name'
                            width='233px'
                            height='45px'   
                            control={register('lastName' , { required: 'Please enter your last name' })}
                            errors={errors}
                        >
                            Last name
                        </InputField>
                        <InputField
                            type='email'
                            name='email'
                            placeholder='Email'
                            width='233px'
                            height='45px'   
                            control={register('email' , { required: 'Please enter your email', disabled: true })}
                            errors={errors}
                        >
                            Email
                        </InputField>
                    </div>
                    <div className={style.break}></div>
                    <div className={style.box}>
                        <InputField
                            type='text'
                            name='additionalEmail'
                            placeholder='Additional Email'
                            width='233px'
                            height='45px'   
                            control={register('additionalEmail' , {
                                    required: 'Please enter your Additional email',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "The email don't match the pattern"
                                    },
                                }
                            )}
                            errors={errors}
                        >
                            Additional email
                        </InputField>
                        <InputField
                            type='text'
                            name='arabicFullName'
                            placeholder='Full arabic name'
                            width='233px'
                            height='45px'   
                            control={register('arabicFullName' , { required: 'Please enter your arabic name' })}
                            errors={errors} 
                        >
                            Full arabic name
                        </InputField>
                        <InputField
                            type='date'
                            name='joinDate'
                            width='233px'
                            height='45px'   
                            control={register('joinDate' , { required: 'Please enter your birth date' })}
                            errors={errors}
                        >
                            Join Date
                        </InputField>
                        <InputField
                            type='tel'
                            name='phoneNumber'
                            placeholder='Phone number'
                            width='233px'
                            height='45px'   
                            control={register('phoneNumber' , {
                                    required: 'Please enter your Phone number',
                                    pattern: {
                                        value: /^(\+?963|0)?9\d{8}$/,
                                        message: 'Please enter a valid phone number'
                                    }
                                }
                            )}
                            errors={errors}
                        >
                            Phone number
                        </InputField>
                    </div>
                    <div className={style.break}></div>
                    <div className={style.box}>
                        <InputField
                            type='text'
                            name='appointlet'
                            placeholder='Appointlet'
                            width='233px'
                            height='45px'   
                            control={register('appointlet' , { required: 'Please enter your appointlet link' })}
                            errors={errors}
                        >
                            Appointlet
                        </InputField>
                    </div>
                    <div className={style.box}>
                        <TextAreaField
                            id='bio'
                            name='bio'
                            placeholder='Bio'
                            width='495px'
                            height='126px'
                            control={register('bio' , { required: 'Please enter your bio' })}
                            errors={errors}
                        >
                            Bio
                        </TextAreaField>
                        <FileUpload
                            name='cv'
                            file={watch("cv")}
                            setValue={setValue}
                            width="495px"
                            height='125px'
                            types={['PDF']}
                            required={false}
                            label={data?.cv ? data?.cv : 'Click to upload or drag and drop PDF (max, 32MB)'}
                        >
                            Resume
                        </FileUpload>
                    </div>
                    <div className={style.buttons}>
                        <SubmitButton 
                            width='80px' 
                            height='40px'
                            disabled={(isDirty===false && watch('cv')===null)}
                        >
                            Save
                        </SubmitButton>
                    </div>  
                </form>
            </div>
        );
    }
}

export default EditProfile;