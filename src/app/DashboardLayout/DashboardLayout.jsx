//import react
import React, { useState } from 'react';
import { useNavigate , Outlet , NavLink } from 'react-router-dom';
import clsx from 'clsx';

//import redux
import { useSelector , useDispatch} from 'react-redux';
import { selectAuthInfo , logout } from '../../features/auth/AuthSlice';

//import components
import Avatar from '@mui/material/Avatar';

//import icon & image
import profileImage from '../../assets/images/profile.png';
import {FaTasks} from 'react-icons/fa';
import {BsBookHalf} from 'react-icons/bs';
import {HiUserGroup} from 'react-icons/hi'
import {MdEmail} from 'react-icons/md';
import {SiGoogleanalytics} from 'react-icons/si';
import {IoIosArrowForward} from 'react-icons/io';
import {AiFillAppstore} from "react-icons/ai";
import {MdWork} from "react-icons/md";
import {BiSpreadsheet} from 'react-icons/bi';
import {MdViewTimeline , MdLogout} from 'react-icons/md';

//import style
import style from './DashboardLayout.module.css';

//static data
const drawerList = [
    {
        title: 'task management',
        path: 'task',
        icon: <FaTasks />
    },
    {
        title: 'hour Log',
        path: 'hourLog',
        icon: <MdViewTimeline />
    },
    {
        title: 'volunteer',
        path: 'volunteer',
        icon: <BsBookHalf />
    },
    {
        title: 'squad',
        path: 'squad',
        icon: <HiUserGroup />
    },
    {
        title: 'position',
        path: 'position',
        icon: <SiGoogleanalytics />
    },
    {
        title: 'email',
        path: 'email',
        icon: <MdEmail />
    },
    {
        title: 'application',
        path: 'application',
        icon: <AiFillAppstore />
    },
    {
        title: 'vacancy',
        path: 'vacancy',
        icon: <MdWork />
    },
    {
        title: 'question',
        path: 'question',
        icon: <BiSpreadsheet />
    }
];

function Navbar(){
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [isOpen , setIsOpen] = useState(false);
    const authInfo = useSelector(selectAuthInfo);

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen((state) => !state);
    }

    const handleClose = () => setIsOpen(false);

    const handleLogout = async() => {
        await dispatch(logout()).unwrap();
        nav('/home');
    }

    const handleInfoClick = () =>{
        nav('profile');
        handleClose();
    }

    return (
        <>
            <div className={clsx(style.cover , {[style['cover-open']] : isOpen})} onClick={handleClose}></div>
            <nav className={
                    clsx(
                        style.navbar ,
                        {[style['navbar-open']] : isOpen}
                    )}
            >
                <div className={style.container}>
                    <div 
                        className={clsx(
                            style['navbar-profile-info'],
                            {[style['navbar-profile-info-open']] : isOpen}
                        )}
                        onClick={handleInfoClick}
                    >
                        <Avatar 
                            alt={authInfo?.name} 
                            src={profileImage}
                            variant="rounded"
                            sx={{
                                width: '50px', 
                                height: '50px', 
                                borderRadius: '12px'
                            }}
                        >T</Avatar>
                        <div className={clsx(
                            style['navbar-profile-info-name'],
                            {[style['navbar-profile-info-name-open']] : isOpen}
                            )}>
                            <span>hello 👋</span>
                            <p>{authInfo?.name}</p>
                        </div>
                    </div>
                    <span onClick={handleToggle}> <IoIosArrowForward size='21px'/> </span>
                    <ul className={style['navbar-list']}>
                    {
                        drawerList.map(({title , path , icon} , index) => (
                            <li key={title} className={style['navbar-list-item']}>
                                <NavLink  
                                    className={({isActive}) => 
                                        clsx(
                                            style['navbar-link'], 
                                            {[style['navbar-link-alt-hover']] : !isOpen},
                                            {[style['navbar-link-hover']] : !isActive},
                                            {[style['navbar-link-hover-open']] : !isActive && isOpen},
                                            {[style['navbar-link-background']] : isActive}, 
                                            {[style['navbar-link-background-open']] : isActive && isOpen}
                                        )
                                    }
                                    to={path}
                                    onClick={handleClose}
                                >
                                    {icon} <span className={clsx(style['navbar-link-title'] , {[style['navbar-link-title-open']] : isOpen})}>{title}</span>
                                </NavLink>
                                <span 
                                    style={{top: `${147 + (57*index)}px`}} 
                                    className={clsx(style['navbar-link-alt'])}
                                >
                                    {title}
                                </span>
                            </li>
                        ))
                    }
                        <li 
                            className={clsx(
                                style['navbar-list-item'] , style.logout)}
                            onClick={handleLogout}
                        >
                            <div className={
                                clsx(
                                    style['navbar-link'], 
                                    {[style['navbar-link-alt-hover']] : !isOpen})
                            }>
                                <MdLogout size={20}/> 
                            </div>
                            <span 
                                className={clsx(
                                    style['navbar-link-title'], 
                                    {[style['navbar-link-title-open']] : isOpen}
                                )}
                            >
                                logout
                            </span>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}

function DashboardLayout (){
    return (
        <div className={style["dashboard-layout"]}>
            <Navbar />
            <Outlet />
        </div>
    );
}

export default DashboardLayout;