import { createSlice } from "@reduxjs/toolkit";

// init state
const snackBarStatus = {
    success : "success", // 1
    error: 'error', // 2
    warning: 'warning', // 3
    info: 'info' // 4
}

const initialState = {
    message: '',
    severity: snackBarStatus.success,
    isOpen: false,
}

const snackBarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers:{
        showMessage: (state , action) => {
            const {message , severity} = action.payload;
            state.isOpen = true;
            state.message = message;
            state.severity = Object.values(snackBarStatus)[severity-1];
        },
        hideMessage: (state , _) => {
            state.isOpen = false;
        }
    }
});

// selector
export const selectAllSnackbar = state => state.snackbar;

// action
export const { showMessage , hideMessage } = snackBarSlice.actions;

// reducers
export default snackBarSlice.reducer;