//import react
import React from "react";
import { useSelector , useDispatch} from "react-redux";
import { selectAllSnackbar , hideMessage} from '../snackBarSlice'

//import components
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function formatString(message){
    return message?.charAt(0)?.toUpperCase() + message?.slice(1);
}

function SnackBar (){
    const dispatch = useDispatch();
    const {isOpen , message , severity} = useSelector(selectAllSnackbar);

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        dispatch(hideMessage());
    };

    return (
            <Snackbar 
                open={isOpen} 
                autoHideDuration={6000} 
                anchorOrigin={{vertical:'bottom' , horizontal : 'center'}}
                onClose={handleClose}
            >
                <Alert 
                    onClose={handleClose} 
                    severity={severity}
                    sx={{minWidth: '300px', maxWidth: '600px' , fontFamily: 'DM Sans, sans-serif'}}
                >
                    {formatString(message)}
                </Alert>
            </Snackbar>
    );
}

export default SnackBar;