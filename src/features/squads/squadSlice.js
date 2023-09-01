//import redux
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice 
} from '@reduxjs/toolkit';
import {logout} from '../auth/AuthSlice';

//import API
import * as squadAPI from './squadAPI';

//init slice
const status = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: "failed"
}

const squadModel = {
    id: 0,
    name: '',
    gsName: '',
    description: '',
    imageUrl: '',
    positions: [
        {
            id: 0,
            name: '',
            gsName: '',
            weeklyHours: 0,
            gsLevel: '',
            squadId: 0,
        }
    ], //position model
}   

const squadAdapter = createEntityAdapter({
    selectId: (sq) => sq.id,
    sortComparer: (sqA , sqB) => sqA.id - sqB.id
});

//thunk actions
export const getSquads = createAsyncThunk(
    'squad/getSquads',
    async (data , thunkAPI) =>{
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await squadAPI.getSquads(data.search , 0 , token , thunkAPI.signal);
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
            const { squad : {searchTerms , status : squadStatus} } = getState()
            if (squadStatus === status.loading || searchTerms.search===data.search) {
                return false;
            }
        },
    }
);

export const getSquadsPage = createAsyncThunk(
    'squad/getSquadsPage',
    async (data , thunkAPI) => {
        try{    
            const {auth: {token} , squad: {searchTerms : {search}}} = thunkAPI.getState();
            const response = await squadAPI.getSquads(search , data.skip , token , thunkAPI.signal);
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

export const createSquad = createAsyncThunk(
    `squad/createSquad`,
    async (data , thunkAPI) => {
        try{    
            const {auth: {token}} = thunkAPI.getState();
            const response = await squadAPI.createSquad(data , token , thunkAPI.signal);
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

export const updateSquad = createAsyncThunk(
    'squad/updateSquad',
    async (data , thunkAPI) => {
        try{
            const {id , ...values} = data;
            const {auth : {token}} = thunkAPI.getState();
            const response = await squadAPI.updateSquad(id , values , token , thunkAPI.signal);
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

export const deleteSquad = createAsyncThunk(
    'squad/deleteSquad',
    async (data , thunkAPI) => {
        try{    
            const {auth : {token}} = thunkAPI.getState();
            await squadAPI.deleteSquad(data.id , token , thunkAPI.signal);
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
const squadSlice = createSlice({
    name:'squad',
    initialState: squadAdapter.getInitialState({
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
            .addCase(getSquads.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getSquads.fulfilled , (state , action) => {
                squadAdapter.setAll(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.searchTerms.search = action.payload.search;
                state.resetTable = !(state.resetTable);
                state.status = status.succeeded;
            })
            .addCase(getSquads.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(getSquadsPage.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getSquadsPage.fulfilled , (state , action) => {
                squadAdapter.setMany(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.status = status.succeeded;
            })
            .addCase(getSquadsPage.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(createSquad.fulfilled , (state , action) => {
                squadAdapter.upsertOne(state , action.payload);
                state.totalCount++;
            })
            .addCase(updateSquad.fulfilled , (state , action) => {
                squadAdapter.upsertOne(state , action.payload);
            })
            .addCase(deleteSquad.fulfilled , (state , action) =>{
                squadAdapter.removeOne(state , action.payload);
                state.totalCount--;
            })
    }
});


//selector
export const {
    selectAll: selectAllSquad,
    selectById: selectSquadById,
    selectTotal: selectSquadCount,
} = squadAdapter.getSelectors(state => state.squad);
export const selectSquadStatus = state => state.squad.status;
export const selectSquadError = state => state.squad.error;
export const selectSquadTotalCount = state => state.squad.totalCount;
export const selectSquadResetTable = state => state.squad.resetTable;

//actions

//reducer
export default squadSlice.reducer;