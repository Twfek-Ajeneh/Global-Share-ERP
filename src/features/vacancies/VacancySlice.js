//import redux
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice 
} from '@reduxjs/toolkit';
import {logout} from '../auth/AuthSlice';

//import API
import * as vacancyAPI from './VacancyAPI';

//init slice
const status = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: "failed"
} 

const vacancyModel = {
    id: 0,
    positionId: 0,
    isOpen: false,
    effect: '',
    brief: '',
    tasks: '',
    required: '',
    preferred: '',
    position: null,
    questionsIds: [], //questions Id
};  



const vacancyAdapter = createEntityAdapter({
    selectId: (sq) => sq.id,
    sortComparer: (sqA , sqB) => sqA.id - sqB.id
});


//thunk actions
export const getVacancies = createAsyncThunk(
    'vacancy/getVacancies',
    async (data , thunkAPI) =>{
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await vacancyAPI.getVacancies(data.search , 0 , token , thunkAPI.signal);
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
            const { vacancy : {searchTerms , vacancyStatus} } = getState()
            if (vacancyStatus === status.loading || searchTerms.search===data.search) {
                return false;
            }
        },
    }
);

export const getVacanciesPage = createAsyncThunk(
    'vacancy/getVacanciesPage',
    async (data , thunkAPI) => {
        try{    
            const {auth: {token} , vacancy: {searchTerms : {search}}} = thunkAPI.getState();
            const response = await vacancyAPI.getVacancies(search , data.skip , token , thunkAPI.signal);
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

export const getVacancyById = createAsyncThunk(
    'vacancy/getVacancyByID',
    async (data , thunkAPI) =>{
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await vacancyAPI.getVacancyById(data.id , token , thunkAPI.signal);
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
);

export const createVacancy = createAsyncThunk(
    `vacancy/createVacancy`,
    async (data , thunkAPI) => {
        try{    
            const {auth: {token}} = thunkAPI.getState();
            const response = await vacancyAPI.createVacancy(data , token , thunkAPI.signal);
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

export const updateVacancy= createAsyncThunk(
    'vacancy/updateVacancy',
    async (data , thunkAPI) => {
        try{
            const {id , ...values} = data;
            const {auth : {token}} = thunkAPI.getState();
            const response = await vacancyAPI.updateVacancy(id , values , token , thunkAPI.signal);
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

export const deleteVacancy = createAsyncThunk(
    'vacancy/deleteVacancy',
    async (data , thunkAPI) => {
        try{    
            const {auth : {token}} = thunkAPI.getState();
            await vacancyAPI.deleteVacancy(data.id , token , thunkAPI.signal);
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
const vacancySlice = createSlice({
    name:'vacancy',
    initialState: vacancyAdapter.getInitialState({
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
            .addCase(getVacancies.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getVacancies.fulfilled , (state , action) => {
                vacancyAdapter.setAll(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.searchTerms.search = action.payload.search;
                state.resetTable = !(state.resetTable);
                state.status = status.succeeded;
            })
            .addCase(getVacancies.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(getVacanciesPage.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getVacanciesPage.fulfilled , (state , action) => {
                vacancyAdapter.setMany(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.status = status.succeeded;
            })
            .addCase(getVacanciesPage.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(createVacancy.fulfilled , (state , action) => {
                vacancyAdapter.upsertOne(state , action.payload);
                state.totalCount++;
            })
            .addCase(updateVacancy.fulfilled , (state , action) => {
                vacancyAdapter.upsertOne(state , action.payload);
            })
            .addCase(deleteVacancy.fulfilled , (state , action) => {
                vacancyAdapter.removeOne(state , action.payload);
                state.totalCount--;
            })
            .addCase(getVacancyById.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getVacancyById.fulfilled , (state , action) => {
                vacancyAdapter.upsertOne(state , action.payload);
                state.status = status.succeeded;
            })
            .addCase(getVacancyById.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
    }
});


//selector
export const {
    selectAll: selectAllVacancy,
    selectById: selectVacancyById,
    selectTotal: selectVacancyCount,
} = vacancyAdapter.getSelectors(state => state.vacancy);
export const selectVacancyStatus = state => state.vacancy.status;
export const selectVacancyError = state => state.vacancy.error;
export const selectVacancyTotalCount = state => state.vacancy.totalCount;
export const selectVacancyResetTable = state => state.vacancy.resetTable;

//action

//reducer
export default vacancySlice.reducer;