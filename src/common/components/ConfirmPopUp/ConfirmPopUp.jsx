// import react
import React from 'react';

//import components
import Button from '../Inputs/Button/Button';

// import style
import style from './ConfirmPopUp.module.css';

function ConfirmPopUp({title , confirmText , setIsConfirm}){
    
    const handleCancel = () => setIsConfirm(false);
    const handleAccept = () => setIsConfirm(true);

    return (
        <div className={style['confirm-pop-up']}>
            <p>{title}</p>
            <div className={style['confirm-buttons']}>
                <Button 
                    width='118px'
                    height='40px'
                    backgroundColor='var(--primary-dark)'
                    color='white'
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button 
                    width='118px'
                    height='40px'
                    backgroundColor='var(--error-main)'
                    color='white'
                    onClick={handleAccept}
                >
                    {confirmText}
                </Button>
            </div>
        </div>
    );
}

export default ConfirmPopUp;