import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import projectService from './projectService';

let initProjects = typeof window !== "undefined" && localStorage.getItem("qual__project");

const initialState = {
  projects: initProjects ? JSON.parse(localStorage.getItem("qual__project")) : [],
  project: {},
  tickets: [],
  ticket: {},
  comments: [],
  uploads: [],
  upload: {}, // may not need
  loading: false,
  error: '',
  allowReset: false
};

export const getProjects = createAsyncThunk(
  'project/get/All-Projects',
  async (_, thunkAPI) => {
    try {
      return await projectService.getProjects();
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProject = createAsyncThunk(
  'project/get/Project-By-Id',
  async (project_id, thunkAPI) => {
    try {
      return await projectService.getProject(project_id);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTicket = createAsyncThunk(
  'project/get/Ticket-By-Id',
  async (ticket_id, thunkAPI) => {
    try {
      return await projectService.getTicket(ticket_id);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/post/Ticket',
  async (formData, thunkAPI) => {
    try {
      return await projectService.createTicket(formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTicket = createAsyncThunk(
  'project/post/Ticket',
  async (formData, thunkAPI) => {
    try {
      return await projectService.createTicket(formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTicketComment = createAsyncThunk(
  'project/post/Ticket-Comment',
  async ({ticket_id, formData}, thunkAPI) => {
    try {
      return await projectService.createTicketComment(ticket_id, formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTicketUpload = createAsyncThunk(
  'project/post/Ticket-Upload',
  async ({ticket_id, formData}, thunkAPI) => {
    try {
      return await projectService.createTicketUpload(ticket_id, formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/put/Project-Update',
  async ({project_id, formData}, thunkAPI) => {
    try {
      return await projectService.updateProject(project_id, formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTicket = createAsyncThunk(
  'project/put/Ticket-Update',
  async ({ticket_id, formData}, thunkAPI) => {
    try {
      return await projectService.updateTicket(ticket_id, formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTicketComment = createAsyncThunk(
  'project/put/Ticket-Update',
  async ({ticket_id, comment_id, formData}, thunkAPI) => {
    try {
      return await projectService.updateTicketComment(ticket_id, comment_id, formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTicketUpload = createAsyncThunk(
  'project/put/Ticket-Update',
  async ({ticket_id, upload_id, formData}, thunkAPI) => {
    try {
      return await projectService.updateTicket(ticket_id, upload_id, formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch projects list.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);




// ------- DELETE, only admin can do this command for security -------
// delete project, ticket, upload, comment, or remove user (as a member) from the project

// TODO: add simple actions that clear the data of tickets array, ticket {}, comments [], and uploads {} whenever switching to approprite projects list or a new prokect or ticket details page via url, upon switching to a new page, detect if state currentlyh exosts and if so erase it via dispatching slice / reducer actions, then dispatch enw actions to retrieve the appropriate data
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    projectReset: (state, action) => {
      state = initialState
    },
    clearProject: (state) => {
      // localStorage.removeItem("qual__project")
      state.project = {}
    },
    clearTickets: (state) => {
      // localStorage.removeItem("qual__tickets")
      // may save tickets [] to qual__projects, thus structure will be: {projects: [], tickets: []}
      state.tickets = []
    },
    clearTicket: (state) => {
      // localStorage.removeItem("qual__ticket")
      // structure of qual__ticket:
      // {
      //   ticket: {},
      //   comments: [],
      //   uploads: [],
      //   upload: {}
      // }
      state.ticket = {}
      state.comments = []
      state.uploads = []
      state.upload = {}
    }
  },
  extraReducers: {
    [getProjects.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getProjects.fulfilled]: (state, { payload }) => {
      state.projects = payload.projects;
    },
    [getProjects.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [getProject.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getProject.fulfilled]: (state, { payload }) => {
      state.project = payload.project;
      state.tickets = payload.tickets;
    },
    [getProject.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
  }
});
export const { projectReset, clearProject, clearTickets, clearTicket } = projectSlice.actions;
export default projectSlice.reducer;