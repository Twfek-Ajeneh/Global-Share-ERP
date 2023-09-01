//import redux
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice 
} from '@reduxjs/toolkit';
import {logout} from '../auth/AuthSlice';

//import API
import * as applicationAPI from './ApplicationAPI';

//init slice
const status = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: "failed"
} 

const applicationModel = {
    id: 0,
    vacancyId: 0,
    vacancy: {
        position: {
            name: '',
            squad: {
                name: '',
            }
        }
    },
    status: 'applied',
    feedbacks: [], //feedback model
    answers: [], //answer model
};  

const feedbackModel = {
    id: 0,
    applicationId: 0,
    application: {},
    type: '', // recruitmentStatus,
    text: '',
};

const answersModel = {
    id: 0,
    text: '',
    applicationId: 0,
    application: {},
    questionId : '',
    question: {}, //vacancy question model
};


const applicationAdapter = createEntityAdapter({
    selectId: (ap) => ap.id,
    sortComparer: (apA , apB) => apA.id - apB.id
});


//thunk actions
export const getApplications = createAsyncThunk(
    'application/getApplication',
    async (data , thunkAPI) =>{
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await applicationAPI.getApplications(data.search , 0 , token , thunkAPI.signal);
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
            const { application : {searchTerms , applicationStatus} } = getState()
            if (applicationStatus === status.loading || searchTerms.search===data.search) {
                return false;
            }
        },
    }
);

export const getApplicationsPage = createAsyncThunk(
    'application/getApplicationsPage',
    async (data , thunkAPI) => {
        try{    
            const {auth: {token} , application: {searchTerms : {search}}} = thunkAPI.getState();
            const response = await applicationAPI.getApplications(search , data.skip , token , thunkAPI.signal);
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

export const getApplicationById = createAsyncThunk(
    'application/getApplicationByID',
    async (data , thunkAPI) =>{
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await applicationAPI.getApplicationById(data.id , token , thunkAPI.signal);
            return response.data;
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
            const { application : {status} } = getState()
            if (status === status.loading) {
                return false;
            }
        },
    }
);

export const updateApplication = createAsyncThunk(
    'application/updateApplication',
    async (data , thunkAPI) => {
        try{
            const {id , ...values} = data;
            const {auth : {token}} = thunkAPI.getState();
            const response = await applicationAPI.updateApplication(id , values , token , thunkAPI.signal);
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

//create slice
const applicationSlice = createSlice({
    name:'application',
    initialState: applicationAdapter.getInitialState({
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
            .addCase(getApplications.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getApplications.fulfilled , (state , action) => {
                applicationAdapter.setAll(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.searchTerms.search = action.payload.search;
                state.resetTable = !(state.resetTable);
                state.status = status.succeeded;
            })
            .addCase(getApplications.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(getApplicationsPage.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getApplicationsPage.fulfilled, (state , action) => {
                applicationAdapter.setMany(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.status = status.succeeded;
            })
            .addCase(getApplicationsPage.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(updateApplication.fulfilled , (state , action) => {
                const data = action.payload;
                delete data.answers;
                applicationAdapter.upsertOne(state , data);
            })
            .addCase(getApplicationById.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getApplicationById.fulfilled , (state , action) => {
                applicationAdapter.upsertOne(state , action.payload);
                state.status = status.succeeded;
            })
            .addCase(getApplicationById.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
    }   
});


//selector
export const {
    selectAll: selectAllApplication,
    selectById: selectApplicationById,
    selectTotal: selectApplicationCount
} = applicationAdapter.getSelectors(state => state.application);
export const selectApplicationStatus = state => state.application.status;
export const selectApplicationError = state => state.application.error;
export const selectApplicationTotalCount = state => state.application.totalCount;
export const selectApplicationResetTable = state => state.application.resetTable;

//action

//reducer
export default applicationSlice.reducer;