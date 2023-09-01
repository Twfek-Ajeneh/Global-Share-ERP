//import redux
import { 
    createAsyncThunk, 
    createSlice,
    createEntityAdapter
} from "@reduxjs/toolkit";
import {logout} from '../auth/AuthSlice';

//import API
import * as emailAPI from './EmailAPI';

// init slice
const status = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: "failed"
}

const EmailModel = {
    id: 0,
    title: '',
    recruitmentStatus: '',
    body: '',
    cc: []
}

const emailAdapter = createEntityAdapter({
    selectId : (em) => em.id,
    sortComparer: (emA , emB) => emA.id - emB.id
});


//thunk actions
export const getEmails = createAsyncThunk(
    'email/getEmails',
    async (data , thunkAPI) =>{
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await emailAPI.getEmails(data.search , 0 , token , thunkAPI.signal);
            return {search : data.search , ...(response.data)};
        } catch(error){
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
        condition: (data, {getState}) => {
            const { email : {searchTerms , emailStatus} } = getState()
            if (emailStatus === status.loading || searchTerms.search===data.search) {
                return false;
            }
        },
    }
);

export const getEmailsPage = createAsyncThunk(
    'email/getEmailsPage',
    async (data , thunkAPI) => {
        try{    
            const {auth: {token} , email: {searchTerms : {search}}} = thunkAPI.getState();
            const response = await emailAPI.getEmails(search , data.skip , token , thunkAPI.signal);
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
);

export const createEmail = createAsyncThunk(
    `email/createEmail`,
    async (data , thunkAPI) => {
        try{    
            const {auth: {token}} = thunkAPI.getState();
            const response = await emailAPI.createEmail(data , token , thunkAPI.signal);
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
);

export const updateEmail= createAsyncThunk(
    'email/updateEmail',
    async (data , thunkAPI) => {
        try{
            const {id , ...values} = data;
            const {auth : {token}} = thunkAPI.getState();
            const response = await emailAPI.updateEmail(id , values , token , thunkAPI.signal);
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

export const deleteEmail = createAsyncThunk(
    'email/deleteEmail',
    async (data , thunkAPI) => {
        try{    
            const {auth : {token}} = thunkAPI.getState();
            await emailAPI.deleteEmail(data.id , token , thunkAPI.signal);
            return data.id;
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


//create slice
const emailSlice = createSlice({
    name : 'email',
    initialState: emailAdapter.getInitialState({
        status: status.idle,
        error: null,
        searchTerms: {
            search: undefined
        },
        totalCount: 0,
        resetTable: false
    }),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEmails.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getEmails.fulfilled , (state , action) => {
                emailAdapter.setAll(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.searchTerms.search = action.payload.search;
                state.resetTable = !(state.resetTable);
                state.status = status.succeeded;
            })
            .addCase(getEmails.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(getEmailsPage.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getEmailsPage.fulfilled , (state , action) => {
                emailAdapter.setMany(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.status = status.succeeded;
            })
            .addCase(getEmailsPage.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(createEmail.fulfilled , (state , action) => {
                emailAdapter.upsertOne(state , action.payload);
                state.totalCount++;
            })
            .addCase(updateEmail.fulfilled , (state , action) => {
                emailAdapter.upsertOne(state , action.payload);
            })
            .addCase(deleteEmail.fulfilled , (state , action) => {
                emailAdapter.removeOne(state , action.payload);
                state.totalCount--;
            })
    }
})

//selector
export const {
    selectAll: selectAllEmail,
    selectById: selectEmailById,
    selectTotal: selectEmailCount,
} = emailAdapter.getSelectors(state => state.email);
export const selectEmailStatus = state => state.email.status;
export const selectEmailError = state => state.email.error;
export const selectEmailTotalCount = state => state.email.totalCount;
export const selectEmailResetTable = state => state.email.resetTable;

//action

//reducer
export default emailSlice.reducer;