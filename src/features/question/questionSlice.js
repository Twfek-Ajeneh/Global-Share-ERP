//import redux
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice
} from '@reduxjs/toolkit';
import {logout} from '../auth/AuthSlice';

//import API
import * as questionAPI from './questionAPI';

//init slice
const status = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: "failed"
};

const questionModel = {
    id: 0,
    text: '',
    type: '', //type of question
    options: [], //array of strings
};

const questionAdapter = createEntityAdapter({
    selectId: (qu) => qu.id,
    sortComparerL: (quA , quB) => quA.id - quB.id
});

//thunk actions
export const getQuestions = createAsyncThunk(
    'question/getQuestions',
    async (data , thunkAPI) =>{
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await questionAPI.getQuestions(data.search , 0 , token , thunkAPI.signal);
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
            const { question : {searchTerms , status: questionStatus} } = getState()
            if (questionStatus === status.loading || searchTerms.search===data.search) {
                return false;
            }
        },
    }
);

export const getQuestionsPage = createAsyncThunk(
    'question/getQuestionsPage',
    async (data , thunkAPI) => {
        try{    
            const {auth: {token} , question: {searchTerms : {search}}} = thunkAPI.getState();
            const response = await questionAPI.getQuestions(search , data.skip , token , thunkAPI.signal);
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

export const createQuestion = createAsyncThunk(
    `question/createQuestion`,
    async (data , thunkAPI) => {
        try{    
            const {auth: {token}} = thunkAPI.getState();
            const response = await questionAPI.createQuestion(data , token , thunkAPI.signal);
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

export const updateQuestion= createAsyncThunk(
    'question/updateQuestion',
    async (data , thunkAPI) => {
        try{
            const {id , ...values} = data;
            const {auth : {token}} = thunkAPI.getState();
            const response = await questionAPI.updateQuestion(id , values , token , thunkAPI.signal);
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

export const deleteQuestion = createAsyncThunk(
    'question/deleteQuestion',
    async (data , thunkAPI) => {
        try{    
            const {auth : {token}} = thunkAPI.getState();
            await questionAPI.deleteQuestion(data.id , token , thunkAPI.signal);
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

// create slice
const questionSlice = createSlice({
    name: 'question',
    initialState: questionAdapter.getInitialState({
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
            .addCase(getQuestions.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getQuestions.fulfilled , (state , action) => {
                questionAdapter.setAll(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.searchTerms.search = action.payload.search;
                state.resetTable = !(state.resetTable);
                state.status = status.succeeded;
            })
            .addCase(getQuestions.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(getQuestionsPage.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getQuestionsPage.fulfilled , (state , action) => {
                questionAdapter.setMany(state , action.payload.data);
                state.totalCount = action.payload.count;
                state.status = status.succeeded;
            })
            .addCase(getQuestionsPage.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(createQuestion.fulfilled , (state , action) => {
                questionAdapter.upsertOne(state , action.payload);
                state.totalCount++;
            })
            .addCase(updateQuestion.fulfilled , (state , action) => {
                questionAdapter.upsertOne(state , action.payload);
            })
            .addCase(deleteQuestion.fulfilled , (state , action) => {
                questionAdapter.removeOne(state , action.payload);
                state.totalCount--;
            })
    }
});


//selector
export const {
    selectAll: selectAllQuestion,
    selectById: selectQuestionById,
    selectTotal: selectQuestionCount,
} = questionAdapter.getSelectors(state => state.question);
export const selectQuestionStatus = state => state.question.status;
export const selectQuestionError = state => state.question.error;
export const selectQuestionTotalCount = state => state.question.totalCount;
export const selectQuestionResetTable = state => state.question.resetTable;

//action

//reducer
export default questionSlice.reducer;