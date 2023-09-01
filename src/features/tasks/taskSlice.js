//import redux
import { 
    createSlice ,
    createAsyncThunk,
    createEntityAdapter
} from "@reduxjs/toolkit"
import * as lodash from 'lodash';
import {logout} from '../auth/AuthSlice';

//import API
import * as taskAPI from './TaskAPI';

// init state
const status = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: "failed"
}

const taskStatusAdapter = createEntityAdapter({
    selectId: (taskStatus) => taskStatus.id,
    sortComparer: (taskStatusA , taskStatusB) => taskStatusA.id - taskStatusB.id
});

const taskAdapter = createEntityAdapter({
    selectId: (task) => task.id,
    sortComparer: (taskA , taskB) => new Date(taskA.deadline) - new Date(taskB.deadline)
});

const commentAdapter = createEntityAdapter({
    selectId: (comment) => comment.id,
    sortComparer: (commentA , commentB) => commentA.id - commentB.id
});

const initialState = {
    taskStatuses: taskStatusAdapter.getInitialState(),
    tasks: taskAdapter.getInitialState(),
    comments: commentAdapter.getInitialState(),
    status: status.idle,
    paginationStatus: status.idle,
    error: null,
    searchTerms:{
        search: undefined,
        difficulty: undefined,
        priority: undefined,
        member: undefined,
        squadId: undefined,
    },
    endTaskStatusIds: []
}

//thunks actions

export const getTasksBySquad = createAsyncThunk(
    'task/getTasksBySquad',
    async (data , thunkAPI) => {
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await taskAPI.getTasksBySquad(data , 0 , token , thunkAPI.signal);
            return {searchTerms: data , data: response.data};
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
        condition: (data, {getState}) => {
            const { task : {searchTerms , taskStatus , paginationStatus} } = getState()
            if (taskStatus === status.loading || paginationStatus===status.loading || (searchTerms.search===data.search 
                && searchTerms.difficulty===data.difficulty && searchTerms.priority===data.priority
                && searchTerms.member===data.member && searchTerms.squadId===data.squadId)) {
                return false;
            }
        },
    }
);

export const getTasksBySquadPage = createAsyncThunk(
    'task/getTasksBySquadPage',
    async (data , thunkAPI) => {
        try{
            const {auth: {token} , task:{searchTerms}} = thunkAPI.getState();
            const response = await taskAPI.getTasksBySquad(searchTerms , data.skip , token , thunkAPI.signal);
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
        condition: (data, {getState}) => {
            const { task : {taskStatus , paginationStatus} } = getState()
            if (taskStatus === status.loading || taskStatus===status.failed || paginationStatus===status.loading) {
                return false;
            }
        },
    }
);

export const createTaskStatus = createAsyncThunk(
    'task/createTaskStatus',
    async (data , thunkAPI) => {
        try{    
            const {auth: {token}} = thunkAPI.getState();
            const response = await taskAPI.createStatus(data , token , thunkAPI.signal);
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

export const deleteTaskStatus = createAsyncThunk(
    'task/deleteTaskStatus',
    async(data , thunkAPI) => {
        try{
            const {auth: {token}} = thunkAPI.getState();
            await taskAPI.deleteStatus(data.id , token , thunkAPI.signal);
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

export const createTask = createAsyncThunk(
    'task/createTask',
    async (data , thunkAPI) => {
        try{
            const {auth: {token}} = thunkAPI.getState();
            const response = await taskAPI.createTask(data , token , thunkAPI.signal);
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

export const updateTask = createAsyncThunk(
    'task/updateTask',
    async (data , thunkAPI) => {
        try{
            const {id , sourceStatusId , ...values} = data;
            const {auth: {token}} = thunkAPI.getState();
            const response = await taskAPI.updateTask(id , values , token , thunkAPI.signal);
            return {data: response.data , source: sourceStatusId};
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

export const createTaskComment = createAsyncThunk(
    'task/createTaskComment',
    async (data , thunkAPI) => {
        try{
            const {auth: {token , info}} = thunkAPI.getState();
            const response = await taskAPI.createComment(data , token , thunkAPI.signal);
            return {comment: response.data , info: info};
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

export const deleteTaskComment = createAsyncThunk(
    'task/deleteTaskComment',
    async (data , thunkAPI) => {
        try{
            const {auth: {token}} = thunkAPI.getState();
            await taskAPI.deleteComment(data.id , token , thunkAPI.signal);
            return data;
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


//creating tasks slice
const tasksSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        resetSearchTerms: (state , _) => {
            state.searchTerms = {
                search: undefined,
                difficulty: undefined,
                priority: undefined,
                member: undefined,
                squadId: undefined,
            };
            state.status = status.idle;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasksBySquad.pending , (state , _) => {
                state.status = status.loading;
            })
            .addCase(getTasksBySquad.fulfilled , (state , action) => {
                state.searchTerms = action.payload.searchTerms;
                
                commentAdapter.removeAll(state.comments);
                taskAdapter.removeAll(state.tasks)
                taskStatusAdapter.removeAll(state.taskStatuses);

                action.payload.data?.forEach(taskStatus => {
                    if(taskStatus.name?.toLowerCase()==='done' && taskStatus.crucial) state.endTaskStatusIds.push(taskStatus.id);
                    const tasks = taskStatus.tasks.map(task => task);
                    const taskIds = taskStatus.tasks.map(task => task.id);
                    taskStatusAdapter.setOne(state.taskStatuses , {...taskStatus , tasks: taskIds});
                    tasks?.forEach(task => {
                        const comments = task.comments?.map(comment => comment);
                        const commentIds = task.comments?.map(comment => comment.id);
                        commentAdapter.setMany(state.comments , comments);
                        taskAdapter.setOne(state.tasks , {...task , comments: commentIds});
                    })
                });

                state.status = status.succeeded;
            })
            .addCase(getTasksBySquad.rejected , (state , action) => {
                state.error = action.payload;
                state.status = status.failed;
            })
            .addCase(getTasksBySquadPage.pending , () => {})
            .addCase(getTasksBySquadPage.fulfilled , () => {})
            .addCase(getTasksBySquadPage.rejected , () => {})
            .addCase(createTaskStatus.fulfilled , (state , action) => {
                taskStatusAdapter.upsertOne(state.taskStatuses , {...(action.payload) , tasks: []});
            })
            .addCase(deleteTaskStatus.fulfilled , (state , action) => {
                taskStatusAdapter.removeOne(state.taskStatuses ,  action.payload);
            })
            .addCase(createTask.fulfilled , (state , action) => {
                const task = action.payload;
                state.taskStatuses.entities[task.statusId].tasks.push(task.id);
                taskAdapter.upsertOne(state.tasks , task);
            })
            .addCase(updateTask.fulfilled , (state , action) => {
                const {data: task , source} = action.payload;
                const {data: {statusId : destination}}  = action.payload;
                delete task.comments;
                
                state.taskStatuses.entities[destination].tasks.push(task.id);
                const temp = state.taskStatuses.entities[source].tasks;
                state.taskStatuses.entities[source].tasks = lodash.remove(temp , (item) => item!==parseInt(task.id));
                
                taskAdapter.upsertOne(state.tasks , task);
            })
            .addCase(createTaskComment.fulfilled , (state , action) => {
                const {comment , info} = action.payload;
                comment.author = {
                    id: info.id,
                    firstName: info.firstName,
                    lastName: info.lastName,
                    middleName: info.middleName,
                    email: info.email,
                }
                state.tasks.entities[comment.taskId].comments.push(comment.id);
                commentAdapter.upsertOne(state.comments , comment);
            })
            .addCase(deleteTaskComment.fulfilled , (state , action) => {
                const {taskId , id} = action.payload;
                const temp = state.tasks.entities[taskId].comments;
                state.tasks.entities[taskId].comments = lodash.remove(temp , (item) => item!==parseInt(id));
                commentAdapter.removeOne(state.comments , action.payload.id);
            })
    }
});

// selectors
export const{
    selectAll: selectAllTaskStatus,
    selectById: selectTaskStatusById,
    selectTotal: selectTaskStatusCount,
    selectIds: selectTaskStatusesIds
} = taskStatusAdapter.getSelectors(state => state.task.taskStatuses);

export const{
    selectAll: selectAllTask,
    selectById: selectTaskById,
    selectTotal: selectTaskCount,
} = taskAdapter.getSelectors(state => state.task.tasks);

export const{
    selectAll: selectAllComment,
    selectById: selectCommentById,
    selectTotal: selectCommentCount,
} = commentAdapter.getSelectors(state => state.task.comments);

export const selectTaskStatus = state => state.task.status;
export const selectTaskError = state => state.task.error;
export const selectTaskSearchTerms = state => state.task.searchTerms;
export const selectEndTaskStatusIds = state => state.task.endTaskStatusIds;


// actions
export const {resetSearchTerms} = tasksSlice.actions

// reducer
export default tasksSlice.reducer;