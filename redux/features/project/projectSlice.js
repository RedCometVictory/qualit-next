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
  notes: [],
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
      return await projectService.getDashboardInfo();
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

// my projects - gssp
export const getProjects = createAsyncThunk(
  'project/get/All-Projects',
  async ({keyword, pageNumber, itemsPerPage, orderBy, cookie}, thunkAPI) => {
    try {
      return await projectService.getProjects(keyword, pageNumber, itemsPerPage, orderBy, cookie);
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

// my tickets - gssp
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
      toast.error("Failed to get projects list.", {theme: "colored", toastId: "GetTicketsError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProject = createAsyncThunk(
  'project/get/Project-By-Id',
  async ({project_id, cookie}, thunkAPI) => {
    try {
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
      return await projectService.getTicket(ticket_id, cookie);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to get ticket details.", {theme: "colored", toastId: "GetTicketError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/post/Project-Create',
  async ({formData, router}, thunkAPI) => {
    try {
      return await projectService.createProject(formData, router);
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
  async ({formData, projectId, router}, thunkAPI) => {
    try {
      return await projectService.createTicket(formData, projectId, router);
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

export const createTicketNote = createAsyncThunk(
  'project/post/Ticket-Note',
  async ({ticket_id, formData}, thunkAPI) => {
    try {
      return await projectService.createTicketNote(ticket_id, formData);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to create new ticket note.", {theme: "colored", toastId: "CreateTicketNoteError"});
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
      toast.error("Failed to create new ticket comment.", {theme: "colored", toastId: "CreateTicketCommentError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const paginateMyProjects = createAsyncThunk(
  'project/get/Paginate-Project',
  async ({keyword, pageNumber, itemsPerPage, orderBy}, thunkAPI) => {
    try {
      return await projectService.paginateMyProjects(keyword, pageNumber, itemsPerPage, orderBy);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to paginate through projects.", {theme: "colored", toastId: "PaginateProjectsError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const paginateMyTickets = createAsyncThunk(
  'project/get/Paginate-Ticket',
  async ({keyword, status, priority, type, submitter = '', pageNumber, itemsPerPage, orderBy, orderChoice}, thunkAPI) => {
    try {
      return await projectService.paginateMyTickets(keyword, status, priority, type, submitter, pageNumber, itemsPerPage, orderBy, orderChoice);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to paginate through tickets.", {theme: "colored", toastId: "PaginateTicketsError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const paginateTicketComments = createAsyncThunk(
  'project/get/Ticket-Paginate-Comment',
  async ({ticket_id, pageNumber, itemsPerPage, orderBy}, thunkAPI) => {
    try {
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

export const updateProject = createAsyncThunk(
  'project/put/Project-Update',
  async ({formData, projectId, router}, thunkAPI) => {
    try {
      return await projectService.updateProject(formData, projectId, router);
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
  async ({formData, ticketId, router}, thunkAPI) => {
    try {
      return await projectService.updateTicket(formData, ticketId, router);
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

export const updateDevAssignedTicket = createAsyncThunk(
  'project/put/Dev-Assigned-Ticket-Update',
  async ({ticketId, developer}, thunkAPI) => {
    try {
      return await projectService.updateDevAssignedTicket(ticketId, developer);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to update developer assigned to this ticket.", {theme: "colored", toastId: "UpdateAssignedDevError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTicketNote = createAsyncThunk(
  'project/delete/Ticket-Note-Delete',
  async ({ticket_id, note_id}, thunkAPI) => {
    try {
      return await projectService.deleteTicketNote(ticket_id, note_id);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to delete ticket note.", {theme: "colored", toastId: "DeleteTicketNoteError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// * Below functions have not been implemented
// * Below functions have not been implemented
// * Below functions have not been implemented

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

// deleteTicketNote is used instead
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
  
// may implement later
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
      state.notes = action.payload.notes;
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
      state.project = {}
    },
    clearTickets: (state) => {
      state.tickets = []
    },
    clearTicket: (state) => {
      state.ticket = {}
      state.comments = []
      state.uploads = []
      state.upload = {}
    },
    /*
    updateUnassignmentListsAdmin: (state, { payload }) => {
      console.log(payload)
      state.assignedUsers = payload.updatedAssignedArr;
      state.unassignedUsers = [...state.unassignedUsers, ...payload.updatedUnassignedArr];
      // state.unassignedUsers = [...state.unassignedUsers, ...payload.updatedUnassignedArr];
    },
    */
    // deleteTicketNote: (state, {payload}) => {
    //   // state.notes = [payload, ...state.notes];
    //   state.notes = state.notes.filter(note => note.id !== payload.noteId);
    // },
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
      state.page = payload.page;
      state.pages = payload.pages;
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
      state.notes = payload.notes;
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
    [createProject.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [createProject.fulfilled]: (state, { payload }) => {
      // add ticket to top
      // state.projects = [payload, ...state.projects];
      state.loading = false;
    },
    [createProject.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [createTicket.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [createTicket.fulfilled]: (state, { payload }) => {
      // add ticket to top
      // state.tickets = [payload, ...state.tickets];
      state.loading = false;
    },
    [createTicket.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [createTicketNote.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [createTicketNote.fulfilled]: (state, { payload }) => {
      state.notes = [payload, ...state.notes];
      // state.loading = false;
    },
    [createTicketNote.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [createTicketComment.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [createTicketComment.fulfilled]: (state, { payload }) => {
      // add comment to top
      state.comments = [payload, ...state.comments];
      // add comment to bottom
      // state.comments = [...state.comments, payload];
      // state.loading = false;
    },
    [createTicketComment.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [paginateMyProjects.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [paginateMyProjects.fulfilled]: (state, { payload }) => {
      // state.tickets = [...state.tickets, payload];
      state.loading = false;
      // state.comments = payload.comments;
      state.projects = payload.projects;
      state.pages = payload.pages;
      state.page = payload.page;
    },
    [paginateMyProjects.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [paginateMyTickets.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [paginateMyTickets.fulfilled]: (state, { payload }) => {
      // state.tickets = [...state.tickets, payload];
      state.loading = false;
      // state.comments = payload.comments;
      state.tickets = payload.tickets;
      state.pages = payload.pages;
      state.page = payload.page;
    },
    [paginateMyTickets.rejected]: (state) => {
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

    [updateDevAssignedTicket.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [updateDevAssignedTicket.fulfilled]: (state, { payload }) => {
      state.ticket.user_id = payload.user_id;
      state.ticket.assignedUser = payload.assignedUser;
      state.loading = false;
    },
    [updateDevAssignedTicket.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },

    [deleteTicketNote.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [deleteTicketNote.fulfilled]: (state, { payload }) => {
      state.notes = state.notes.filter(note => note.id !== payload.noteId);
    },
    [deleteTicketNote.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
  }
});
export const { rehydrate, projectReset, clearProject, clearTickets, clearTicket } = projectSlice.actions;
export default projectSlice.reducer;