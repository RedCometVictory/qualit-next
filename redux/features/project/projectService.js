import { getData, postData, postFileData, putData, deleteData, getDataSSR } from '@/utils/fetchData';
import { createUpdateTicketCommentForm } from "@/utils/formDataServices";
// import api from '@/utils/api';

const getDashboardInfo = async () => {
  console.log("|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|")
  console.log("***Project Service***");
  console.log("*** get res***");
  const res = await getData(`/dashboard`);
  console.log("res");
  console.log(res);
  const result = res.data;
  // localStorage.setItem("qual__projects", JSON.stringify(result.projects));
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const getProjects = async (keyword, pageNumber, itemsPerPage, orderBy, cookie) => {
  const res = await getDataSSR(`/projects/search?keyword=${keyword}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}`, cookie);
  const result = res.data;
  // localStorage.setItem("qual__projects", JSON.stringify(result.projects));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const getTickets = async (keyword, status, priority, type, submitter, pageNumber, itemsPerPage, orderBy, orderChoice, cookie) => {
  const res = await getDataSSR(`/tickets/search?keyword=${keyword}&status=${status}&priority=${priority}&type=${type}&submitter=${submitter}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}&orderChoice=${orderChoice}`, cookie); // ----
  // const res = await getData(`/tickets/search?keyword=${keyword}&status=${status}&priority=${priority}&type=${type}&submitter=${submitter}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}&orderChoice=${orderChoice}`); // ----
  const result = res.data;
  // localStorage.setItem("qual__projects", JSON.stringify(result.projects));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};


const getProject = async (project_id, cookie) => {
  // TODO: get project detail and all tickets belonging to this project, place into tickets [] and project into {}
  console.log("***Project Service for SSR***");
  console.log("project_id")
  console.log(project_id)
  console.log("cookie")
  console.log(cookie)
  const res = await getDataSSR(`/projects/${project_id}`, cookie);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result));
  console.log("result")
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const getTicket = async (ticket_id, cookie) => {
  const res = await getDataSSR(`/tickets/${ticket_id}`, cookie);
  const result = res.data;
  // localStorage.setItem("qual__ticket", JSON.stringify(result));
  return result;
};

const createProject = async (formData, router) => {
  console.log("***Project Service***");
  console.log("***formdats***");
  console.log(formData);
  const res = await postData(`/projects`, formData);
  const result = res.data;
  // localStorage.setItem("qual__projects", JSON.stringify(result.project));
  // TODO: place newly created project ointo projects [] and save new state into LS qual__projects
  console.log(result)
  console.log("----- END project service -----")
  router.push('/my/projects');
  // return router.push('/my/projects');
  return result;
};

const createTicket = async (formData, projectId, router) => {
  const res = await postData(`/tickets?projectId=${projectId}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  router.push('/my/tickets');
  return result;
};

const createTicketNote = async (ticket_id, formData) => {
  console.log("++++ PROJECT SERVICE ++++")
  console.log(ticket_id)
  console.log("++++++++++")
  console.log(formData)
  console.log("+++++ END +++++")
  const res = await postData(`/tickets/${ticket_id}/note`, formData);
  const result = res.data;
  return result;
};

const createTicketComment = async (ticket_id, formData) => {
  let servicedData = createUpdateTicketCommentForm(formData);
  const res = await postFileData(`/tickets/${ticket_id}/comment`, servicedData); // ----
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  return result;
};
// TODO: need to implement for my projects page
const paginateMyProjects = async (keyword, pageNumber, itemsPerPage, orderBy) => {
  console.log("pagination service")
  const res = await getData(`/projects/search?keyword=${keyword}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}`); // ----
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  console.log("|_+|_|+|_|+|_|+|_|+|_|+|_|+|_|+|_|")
  console.log("result")
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const paginateMyTickets = async (keyword, status, priority, type, submitter, pageNumber, itemsPerPage, orderBy, orderChoice) => {
  console.log("pagination service")
  const res = await getData(`/tickets/search?keyword=${keyword}&status=${status}&priority=${priority}&type=${type}&submitter=${''}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}&orderChoice=${orderChoice}`); // ----
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  console.log("|_+|_|+|_|+|_|+|_|+|_|+|_|+|_|+|_|")
  console.log("result")
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const paginateTicketComments = async (ticket_id, pageNumber, itemsPerPage, orderBy) => {
  console.log("pagination service")
  const res = await getData(`/tickets/${ticket_id}/comment?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}`); // ----
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  console.log("|_+|_|+|_|+|_|+|_|+|_|+|_|+|_|+|_|")
  console.log("result")
  console.log(result)
  console.log("----- END project service -----")
  return result;
};



const createTicketUpload = async (ticket_id, formData) => {
  // TODO: extract the form data image into via multipart/form
  let servicedData = await createUpdateUploadForm(formData);
  const res = await postData(`/tickets/${ticket_id}/upload`, servicedData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place newly created ticket upload ointo uploads [] and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const updateProject = async (project_id, formData) => {
  const res = await putData(`/projects/${project_id}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const updateTicket = async (ticket_id, formData) => {
  const res = await putData(`/tickets/${ticket_id}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated ticket data into ticket {} and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const updateTicketComment = async (ticket_id, comment_id, formData) => {
  const res = await putData(`/tickets/${ticket_id}/comment/${comment_id}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place newly created ticket upload ointo uploads [] and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const updateTicketUpload = async (ticket_id, upload_id, formData) => {
  // TODO: extract the form data image into via multipart/form
  let servicedData = await createUpdateUploadForm(formData);
  const res = await putData(`/tickets/${ticket_id}/upload/${upload_id}`, servicedData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place newly created ticket upload ointo uploads [] and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const deleteProject = async (project_id) => {
  const res = await deleteData(`/projects/${project_id}/delete`);
  const result = res.data;
  // TODO: if (localStorage.getItem("qual__project")) { if id of project matches the project id to be deleted then remove the data from LS }
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const deleteTicket = async (ticket_id) => {
  // TODO: ensure only ADMIN or PROJ MANAGER can delete a ticket
  // TODO: if ticket is deleted then delete all comments and uploads belonging to the ticket
  const res = await deleteData(`/projects/${ticket_id}/delete`);
  const result = res.data;
  // TODO: if (localStorage.getItem("qual__project")) { if id of project matches the project id to be deleted then remove the data from LS }
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const deleteTicketComment = async (ticket_id, comment_id) => {
  const res = await deleteData(`/projects/${ticket_id}/comment/${comment_id}/delete`);
  const result = res.data;
  // TODO: if (localStorage.getItem("qual__project")) { if id of project matches the project id to be deleted then remove the data from LS }
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const deleteTicketUpload = async (ticket_id, upload_id) => {
  const res = await deleteData(`/projects/${ticket_id}/upload/${upload_id}/delete`);
  const result = res.data;
  // TODO: if (localStorage.getItem("qual__project")) { if id of project matches the project id to be deleted then remove the data from LS }
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const deleteUser = async (user_id) => {
  // TODO: user can delete their own acccount, admin or projet manager can only ban account
  const res = await deleteData(`/users/${user_id}`);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const projectService = {
  getDashboardInfo,
  getProjects,
  getTickets,
  getProject,
  getTicket,
  createProject,
  createTicket,
  createTicketNote,
  createTicketComment,
  paginateMyProjects,
  paginateMyTickets,
  paginateTicketComments,
  createTicketUpload,
  updateProject,
  updateTicket,
  updateTicketComment,
  updateTicketUpload,
  deleteProject,
  deleteTicket,
  deleteTicketComment,
  deleteTicketUpload,
  deleteUser
};
export default projectService;