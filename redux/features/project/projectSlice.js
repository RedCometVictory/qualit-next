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
  error: '',
  page: null,
  pages: null,
  loading: false,
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
      toast.error("Failed to fetch dashboard information.", {theme: "colored", toastId: "DashBoardError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// my projects
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
      toast.error("Failed to get projects list.", {theme: "colored", toastId: "GetProjectsError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// my tickets
export const getTickets = createAsyncThunk(
  'project/get/All-Tickets',
  async ({keyword, status, priority, type, submitter, pageNumber, itemsPerPage, orderBy, orderChoice, cookie}, thunkAPI) => {
    try {
      return await projectService.getTickets(keyword, status, priority, type, submitter, pageNumber, itemsPerPage, orderBy, orderChoice, cookie);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to get projects list.", {theme: "colored", toastId: "GetProjectsError"});
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
      toast.error("Failed to get project details.", {theme: "colored", toastId: "GetProjectError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTicket = createAsyncThunk(
  'project/get/Ticket-By-Id',
  async ({ticket_id, cookie}, thunkAPI) => {
    try {
      console.log("GET-PROJECT SERVICE");
      console.log(ticket_id)
      console.log("- - - - -")
      console.log(cookie)
      console.log("GET-PROJECT SERVICE END");
      return await projectService.getTicket(ticket_id, cookie);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to get ticket details.", {theme: "colored", toastId: "TicketError"});
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
      toast.error("Failed to create new project.", {theme: "colored", toastId: "CreateProjectError"});
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
      toast.error("Failed to create new ticket.", {theme: "colored", toastId: "CreateTicketError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTicketComment = createAsyncThunk(
  'project/post/Ticket-Comment',
  async ({ticket_id, formData}, thunkAPI) => {
    try {
      // console.log(formData.getAll("message"))
      // console.log(formData.getAll("upload"))
      return await projectService.createTicketComment(ticket_id, formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to create new ticket comment.", {theme: "colored", toastId: "CreateTicketCommentError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// START Pagination Section

export const paginateProjectTickets = createAsyncThunk(
  'project/get/Ticket-Paginate-Comment',
  async ({ticket_id, pageNumber, itemsPerPage, orderBy}, thunkAPI) => {
    try {
      console.log("{{{SLICE - PAGINATE}}}")
      console.log(ticket_id)
      console.log(pageNumber)
      console.log(itemsPerPage)
      console.log(orderBy)
      return await projectService.paginateTicketComments(ticket_id, pageNumber, itemsPerPage, orderBy);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to paginate through comments.", {theme: "colored", toastId: "PaginateCommentError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const paginateTicketComments = createAsyncThunk(
  'project/get/Ticket-Paginate-Comment',
  async ({ticket_id, pageNumber, itemsPerPage, orderBy}, thunkAPI) => {
    try {
      console.log("{{{SLICE - PAGINATE}}}")
      console.log(ticket_id)
      console.log(pageNumber)
      console.log(itemsPerPage)
      console.log(orderBy)
      return await projectService.paginateTicketComments(ticket_id, pageNumber, itemsPerPage, orderBy);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to paginate through comments.", {theme: "colored", toastId: "PaginateCommentError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// END Pagination Section

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
      toast.error("Failed to create ticket upload.", {theme: "colored", toastId: "TicketUploadError"});
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
      toast.error("Failed to update project details.", {theme: "colored", toastId: "UpdateProjectError"});
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
      toast.error("Failed to update ticket details.", {theme: "colored", toastId: "UpdateTicketError"});
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
      toast.error("Failed to update ticket comment.", {theme: "colored", toastId: "UpdateTicketCommentError"});
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
      toast.error("Failed to update ticket upload.", {theme: "colored", toastId: "UpdateTicketUploadError"});
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
      toast.error("Failed to delete project.", {theme: "colored", toastId: "DeleteProjectError"});
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
      toast.error("Failed to delete ticket.", {theme: "colored", toastId: "DeleteTicketError"});
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
      toast.error("Failed to delete ticket comment.", {theme: "colored", toastId: "DeleteTicketCommentError"});
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
        toast.error("Failed to delete ticket upload.", {theme: "colored", toastId: "DeleteTicketUploadError"});
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
      toast.error("Failed to delete user from project.", {theme: "colored", toastId: "DeleteUserError"});
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
      state.page = action.payload.page;
      state.pages = action.payload.pages;
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
    [getTickets.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getTickets.fulfilled]: (state, { payload }) => {
      state.tickets = payload.tickets;
      // state.comments = payload.comments;
      // state.history = payload.history;
      state.page = payload.page;
      state.pages = payload.pages;
      state.loading = false;
    },
    [getTickets.rejected]: (state) => {
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
      state.page = payload.page;
      state.pages = payload.pages;
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
      state.page = payload.page;
      state.pages = payload.pages;
      state.loading = false;
    },
    [getTicket.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [createTicketComment.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [createTicketComment.fulfilled]: (state, { payload }) => {
      state.comments = [...state.comments, payload];
      // state.loading = false;
    },
    [createTicketComment.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [paginateProjectTickets.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [paginateProjectTickets.fulfilled]: (state, { payload }) => {
      // state.tickets = [...state.tickets, payload];
      state.loading = false;
      // state.comments = payload.comments;
      state.tickets = payload.tickets;
      state.pages = payload.pages;
      state.page = payload.page;
    },
    [paginateProjectTickets.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [paginateTicketComments.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [paginateTicketComments.fulfilled]: (state, { payload }) => {
      // state.comments = [...state.comments, payload];
      state.loading = false;
      state.comments = payload.comments;
      state.pages = payload.pages;
      state.page = payload.page;
    },
    [paginateTicketComments.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
  }
});
export const { rehydrate, projectReset, clearProject, clearTickets, clearTicket } = projectSlice.actions;
export default projectSlice.reducer;