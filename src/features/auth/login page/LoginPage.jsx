//import react
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

//import components
import InputField from '../../../common/components/Inputs/InputField/InputField';
import SubmitButton from '../../../common/components/Inputs/SubmitButton/SubmitButton';

//import redux state
import { useDispatch , useSelector } from 'react-redux';
import { login, selectAuthStatus } from '../AuthSlice';
import { showMessage } from '../../snackBar/snackBarSlice'

//import svg
import {ReactComponent as MainLogo } from '../../../assets/icons/mainLogo.svg';
import {ReactComponent as TitleLogo} from '../../../assets/icons/title.svg';

//import style
import style from './LoginPage.module.css';

function LoginPage (){
    const {register , formState: {errors} , handleSubmit} = useForm({
        defaultValues:{
            email: '',
            password: ''
        }
    });

    const nav = useNavigate();
    const dispatch = useDispatch();
    const status = useSelector(selectAuthStatus);

    const onSubmit = async (values) => {
        try{
            const response = await dispatch(login(values)).unwrap();
            localStorage.setItem("token" , response.token);
            nav('/dashboard/task');
        }catch(error){
            if(error?.name==="ConditionError") return;
            dispatch(showMessage({message: error , severity: 2}));
        }
    }

    return (
        <div className={style['login-page']}>
            <form className={style.form}  onSubmit={handleSubmit(onSubmit)}>
                <div className={style.logo}>
                    <MainLogo />
                    <TitleLogo />
                </div>
                <InputField
                    type='text'
                    placeholder='Enter your email'
                    name='email'
                    autoFocus
                    control={register('email' , {
                            required: 'Please enter your email',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "please enter a valid email"
                            },
                        }
                    )}
                    errors={errors}
                >
                    Email
                </InputField>
                <InputField
                    type='password'
                    placeholder='Enter your password'
                    name='password'
                    control={register('password' , { required: 'Please enter your password' })}
                    errors={errors}
                >
                    Password
                </InputField>
                <SubmitButton disabled={status==='loading'}>
                    Login
                </SubmitButton>
            </form>
        </div>
    );
}

export default LoginPage;