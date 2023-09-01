//import redux
import { 
    createAsyncThunk, 
    createSlice,
    createEntityAdapter
} from "@reduxjs/toolkit";
import {logout} from '../auth/AuthSlice';

//import API
import * as positionAPI from './PositionAPI';

// init slice
const status = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: "failed"
}

const PositionModel = {
    id: 0,
    name: '',
    gsName: '',
    weeklyHours: 0,
    gsLevel: '',
    squadId: 0,
    squad: {}, //squad model
}

const positionAdapter = createEntityAdapter({
    selectId : (po) => po.id,
    sortComparer: (poA , poB) => poA.id - poB.id
});


//thunk actions
export const getPositions = createAsyncThunk(
    'position/getPositions',
    async (data , thunkAPI) =>{
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await positionAPI.getPositions(data, 0 , token , thunkAPI.signal);
            return {search: data , ...(response.data)};
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
            const { position : {searchTerms , status: positionStatus} } = getState()
            if (positionStatus === status.loading || (searchTerms.search===data.search
                && searchTerms.squad===data.squad && searchTerms.level===data.level)) {
                return false;
            }
        },
    }
);

export const getPositionPage = createAsyncThunk(
    'position/getPositionPage',
    async (data , thunkAPI) => {
        try{    
            const {auth: {token} , position: {searchTerms}} = thunkAPI.getState();
            const response = await positionAPI.getPositions(searchTerms , data.skip , token , thunkAPI.signal);
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

export const createPosition = createAsyncThunk(
    `position/createPosition`,
    async (data , thunkAPI) => {
        try{    
            const {auth: {token}} = thunkAPI.getState();
            const response = await positionAPI.createPosition(data , token , thunkAPI.signal);
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

export const updatePosition = createAsyncThunk(
    'position/updatePosition',
    async (data , thunkAPI) => {
        try{
            const {id , ...values} = data;
            const {auth : {token}} = thunkAPI.getState();
            const response = await positionAPI.updatePosition(id , values , token , thunkAPI.signal);
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

export const deletePosition = createAsyncThunk(
    'position/deletePosition',
    async (data , thunkAPI) => {
        try{    
            const {auth : {token}} = thunkAPI.getState();
            await positionAPI.deletePosition(data.id , token , thunkAPI.signal);
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
const positionSlice = createSlice({
    name : 'position',
    initialState: positionAdapter.getInitialState({
        status: status.idle,
        error: null,
        searchTerms: {
            search: undefined,
            level: undefined,
            squad: undefined
        },
        totalCount: 0,
        resetTable: false
    }),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPositions.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getPositions.fulfilled , (state , action) => {
                positionAdapter.setAll(state , action.payload.data);
                state.totalCount = action.payload.count ;
                state.searchTerms = action.payload.search;
                state.resetTable = !(state.resetTable);
                state.status = status.succeeded;
            })
            .addCase(getPositions.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(getPositionPage.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getPositionPage.fulfilled , (state , action) => {
                positionAdapter.setMany(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.status = status.succeeded;
            })
            .addCase(getPositionPage.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(createPosition.fulfilled , (state , action) => {
                positionAdapter.upsertOne(state , action.payload);
                state.totalCount++;
            })
            .addCase(updatePosition.fulfilled , (state , action) => {
                positionAdapter.upsertOne(state , action.payload);
            })
            .addCase(deletePosition.fulfilled , (state , action) => {
                positionAdapter.removeOne(state , action.payload);
                state.totalCount--;
            })
    }
})


//selector
export const {
    selectAll: selectAllPosition,
    selectById: selectPositionById,
    selectTotal: selectPositionCount
} = positionAdapter.getSelectors(state => state.position);
export const selectPositionStatus = state => state.position.status;
export const selectPositionError = state => state.position.error;
export const selectPositionTotalCount = state => state.position.totalCount;
export const selectPositionResetTable = state => state.position.resetTable;

//actions

// reducer
export default positionSlice.reducer;