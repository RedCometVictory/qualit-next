import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";
import { toast } from 'react-toastify';
import projectService from './projectService';

let initProjects = typeof window !== "undefined" && localStorage.getItem("qual__project");

const initialState = {
  projects: initProjects ? JSON.parse(localStorage.getItem("qual__project")) : [],
  project: {},
  tickets: [],
  ticket: {},
  comments: [],
  history: [],
  loading: false,
  error: '',
  allowReset: false
};

export const getDashboardInfo = createAsyncThunk(
  'project/get/dashboard',
  async (_, thunkAPI) => {
    try {
      console.log("$$$$$$ project SLCIE $$$$$");
      return await projectService.getDashboardInfo();
      console.log("failed to return data")
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
  async ({project_id, cookie}, thunkAPI) => {
    try {
      console.log("GET-PROJECT SERVICE");
      console.log(project_id)
      console.log("- - - - -")
      console.log(cookie)
      console.log("GET-PROJECT SERVICE END");
      return await projectService.getProject(project_id, cookie);
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

export const deleteProject = createAsyncThunk(
  'project/delete/Project-Delete',
  async (project_id, thunkAPI) => {
    try {
      return await projectService.deleteProject(project_id);
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

export const deleteTicket = createAsyncThunk(
  'project/delete/Ticket-Delete',
  async (ticket_id, thunkAPI) => {
    try {
      return await projectService.deleteTicket(ticket_id);
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

export const deleteTicketComment = createAsyncThunk(
  'project/delete/Ticket-Comment-Delete',
  async ({ticket_id, comment_id}, thunkAPI) => {
    try {
      return await projectService.deleteTicketComment(ticket_id, comment_id);
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

export const deleteTicketUpload = createAsyncThunk(
  'project/delete/Ticket-Upload-Delete',
  async ({ticket_id, upload_id}, thunkAPI) => {
    try {
      return await projectService.deleteTicketUpload(ticket_id, upload_id);
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
  
  
export const deleteUser = createAsyncThunk(
  'project/delete/User-Delete',
  async (user_id, thunkAPI) => {
    try {
      return await projectService.deleteUser(user_id);
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

// TODO: add simple actions that clear the data of tickets array, ticket {}, comments [], and uploads {} whenever switching to approprite projects list or a new prokect or ticket details page via url, upon switching to a new page, detect if state currentlyh exosts and if so erase it via dispatching slice / reducer actions, then dispatch enw actions to retrieve the appropriate data
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    rehydrate(state, action) {
      state.projects = action.payload.projects;
      state.project = action.payload.project;
      state.tickets = action.payload.tickets;
      state.ticket = action.payload.ticket;
      state.comments = action.payload.comments;
      state.history = action.payload.history;
      state.allowReset = action.payload.allowReset;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
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
    // [HYDRATE]: (state, action) => {
    //   console.log("HYDRATE", action.payload);
    //   return {
    //     ...state,
    //     ...action.payload.project
    //   }
    // },
    [getDashboardInfo.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getDashboardInfo.fulfilled]: (state, { payload }) => {
      state.tickets = payload.tickets;
      state.projects = payload.projects;
      state.loading = false;
    },
    [getDashboardInfo.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [getProjects.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getProjects.fulfilled]: (state, { payload }) => {
      state.projects = payload.projects;
      state.loading = false;
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
      console.log("SLICE")
      console.log(payload)
      state.project = payload.project;
      state.tickets = payload.tickets;
      state.loading = false;
    },
    [getProject.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [getTicket.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getTicket.fulfilled]: (state, { payload }) => {
      state.ticket = payload.ticket;
      state.comments = payload.comments;
      state.history = payload.history;
      state.loading = false;
    },
    [getTicket.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
  }
});
export const { rehydrate, projectReset, clearProject, clearTickets, clearTicket } = projectSlice.actions;
export default projectSlice.reducer;