//import redux
import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import {logout} from '../auth/AuthSlice';

//import API
import * as profileAPI from "./ProfileAPI";

// import utils
import { format } from "date-fns";

//init slice
const status = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: "failed"
}

const userModel = {
    id: 0,
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    additionalEmail: "",
    middleName: "",
    arabicFullName: "",
    appointlet: "",
    bio: "",
    gsStatus: "",
    joinDate: "2000-1-1",
    tasksCompleted: 0,
    volunteeredHours: 0,
    position: {},
}

const initialState = {
    status: status.idle,
    error: null,
    data : {},
    profileSquads: [],
}

//thunk action
export const getMyProfileDetails = createAsyncThunk(
    'profile/getMyProfileDetails',
    async (_ , thunkAPI) => {
        try{
            const {auth : {token}} = thunkAPI.getState();
            const response = await profileAPI.getMyProfileDetails(token , thunkAPI.signal);
            return response.data;
        }catch(error){
            let message = "Network connection error";
            if(error?.response?.data?.statusCode===401) {
                message = error?.response?.data?.message;
                thunkAPI.dispatch(logout());
            }
            else if(error?.response?.data?.message){
                if(Array.isArray(error.response.data.message))
                    message = error.response.data.message[0];
                else 
                    message = error.response.data.message;
            }
            return thunkAPI.rejectWithValue(message);
        }
    },
    {
        condition: (_, {getState}) => {
            const { profile : {status : profileStatus} } = getState()
            if (profileStatus === status.loading) {
                return false
            }
        },
    }
);

export const getProfileDetailsById = createAsyncThunk(
    'profile/getProfileDetailsById',
    async (data , thunkAPI) => {
        try{
            const {auth : {token}} = thunkAPI.getState();
            const response = await profileAPI.getProfileDetailsById(data.id , token , thunkAPI.signal);
            return response.data;
        }catch(error){
            let message = "Network connection error";
            if(error?.response?.data?.statusCode===401) {
                message = error?.response?.data?.message;
                thunkAPI.dispatch(logout());
            }
            else if(error?.response?.data?.message){
                if(Array.isArray(error.response.data.message))
                    message = error.response.data.message[0];
                else 
                    message = error.response.data.message;
            }
            return thunkAPI.rejectWithValue(message);
        }
    },
    {
        condition: (_, {getState}) => {
            const { profile : {status : profileStatus} } = getState()
            if (profileStatus === status.loading) {
                return false
            }
        },
    }
);

export const updateProfileDetails = createAsyncThunk(
    'profile/updateProfileDetails',
    async (data , thunkAPI) => {
        try{
            const {auth : {token}} = thunkAPI.getState();
            const response = await profileAPI.updateMyProfileDetails(data , token , thunkAPI.signal);
            return response.data;
        }catch(error){
            let message = "Network connection error";
            if(error?.response?.data?.statusCode===401) {
                message = error?.response?.data?.message;
                thunkAPI.dispatch(logout());
            }
            else if(error?.response?.data?.message){
                if(Array.isArray(error.response.data.message))
                    message = error.response.data.message[0];
                else 
                    message = error.response.data.message;
            }
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//creating profile slice
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(getMyProfileDetails.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getMyProfileDetails.fulfilled , (state , action) => {
                const details = action.payload;

                for(let key of Object.keys(details)){
                    if(details[key]===null) details[key] = '';
                    if(key==='joinDate') details[key] = format(new Date(details[key]) , 'yyyy-MM-dd');
                }
                
                state.profileSquads = [];
                details.positions?.forEach(element => {
                    state.profileSquads.push(element.position.squad);
                });

                state.data = details;
                state.status = status.succeeded;
            })
            .addCase(getMyProfileDetails.rejected , (state , action) => {
                state.status = status.failed;
                state.error = action.payload;
            })
            .addCase(getProfileDetailsById.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getProfileDetailsById.fulfilled , (state , action) => {
                const details = action.payload;
                for(let key of Object.keys(details)){
                    if(details[key]===null) details[key] = '';
                    if(key==='joinDate') details[key] = format(new Date(details[key]) , 'yyyy-MM-dd');
                }   
                state.data = details;
                state.status = status.succeeded;
            })
            .addCase(getProfileDetailsById.rejected , (state , action) => {
                state.status = status.failed;
                state.error = action.payload;
            })
            .addCase(updateProfileDetails.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(updateProfileDetails.fulfilled , (state , action) => {  
                const details = action.payload;
                for(let key of Object.keys(details)){
                    if(details[key]===null) details[key] = '';
                    if(key==='joinDate') details[key] = format(new Date(details[key]) , 'yyyy-MM-dd');
                }   
                state.data = details;
                state.status = status.succeeded;
            })
            .addCase(updateProfileDetails.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.succeeded;
            })
    },
});

//selectors
export const selectAllProfile = state => state.profile;
export const selectProfileStatus = state => state.profile.status;
export const selectProfileError = state => state.profile.error;
export const selectProfileData = state => state.profile.data;
export const selectProfileSquads = state => state.profile.profileSquads;

//actions


//reducer
export default profileSlice.reducer;