import { getData, postData, postFileData, putData, deleteData, getDataSSR } from '@/utils/fetchData';
import { createUpdateTicketCommentForm } from "@/utils/formDataServices";

const getDashboardInfo = async () => {
  const res = await getData(`/dashboard`);

  const result = res.data;
  return result;
};

const getProjects = async (keyword, pageNumber, itemsPerPage, orderBy, cookie) => {
  const res = await getDataSSR(`/projects/search?keyword=${keyword}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}`, cookie);

  const result = res.data;
  return result;
};

const getTickets = async (keyword, status, priority, type, submitter, pageNumber, itemsPerPage, orderBy, orderChoice, cookie) => {
  const res = await getDataSSR(`/tickets/search?keyword=${keyword}&status=${status}&priority=${priority}&type=${type}&submitter=${submitter}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}&orderChoice=${orderChoice}`, cookie); // ---

  const result = res.data;
  return result;
};


const getProject = async (project_id, cookie) => {
  const res = await getDataSSR(`/projects/${project_id}`, cookie);

  const result = res.data;
  return result;
};

const getTicket = async (ticket_id, cookie) => {
  const res = await getDataSSR(`/tickets/${ticket_id}`, cookie);

  const result = res.data;
  return result;
};

const createProject = async (formData, router) => {
  const res = await postData(`/projects`, formData);

  const result = res.data;
  router.push('/my/projects');
  return result;
};

const createTicket = async (formData, projectId, router) => {
  const res = await postData(`/tickets?projectId=${projectId}`, formData);

  const result = res.data;
  router.push('/my/tickets');
  return result;
};

const createTicketNote = async (ticket_id, formData) => {
  const res = await postData(`/tickets/${ticket_id}/note`, formData);

  const result = res.data;
  return result;
};

const createTicketComment = async (ticket_id, formData) => {
  let servicedData = createUpdateTicketCommentForm(formData);
  const res = await postFileData(`/tickets/${ticket_id}/comment`, servicedData); // ----

  const result = res.data;
  return result;
};

// TODO: need to implement for my projects page - currently not being used - instead getProject() does the operation
const paginateMyProjects = async (keyword, pageNumber, itemsPerPage, orderBy) => {
  const res = await getData(`/projects/search?keyword=${keyword}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}`); // ----

  const result = res.data;
  return result;
};

const paginateMyTickets = async (keyword, status, priority, type, submitter, pageNumber, itemsPerPage, orderBy, orderChoice) => {
  console.log("pagination service")
  const res = await getData(`/tickets/search?keyword=${keyword}&status=${status}&priority=${priority}&type=${type}&submitter=${''}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}&orderChoice=${orderChoice}`); // ----

  const result = res.data;
  return result;
};

const paginateTicketComments = async (ticket_id, pageNumber, itemsPerPage, orderBy) => {
  console.log("pagination service")
  const res = await getData(`/tickets/${ticket_id}/comment?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}`); // ----

  const result = res.data;
  return result;
};

const updateProject = async (formData, projectId, router) => {
  const res = await putData(`/projects/${projectId}`, formData);

  const result = res.data;
  router.push(`/projects/${projectId}`);
  return result;
};

const updateTicket = async (formData, ticketId, router) => {
  const res = await putData(`/tickets/${ticketId}`, formData);

  const result = res.data;
  router.push(`/tickets/${ticketId}`);
  return result;
};

const updateDevAssignedTicket = async (ticketId, developer) => {
  const res = await putData(`/tickets/${ticketId}/assignedDev`, {developer});

  const result = res.data;
  return result;
};

const deleteTicketNote = async (ticket_id, note_id) => {
  const res = await deleteData(`/tickets/${ticket_id}/note?noteId=${note_id}`);

  const result = res.data;
  return result;
};

// * Below functions have not been implemented
// * Below functions have not been implemented
// * Below functions have not been implemented

const updateTicketComment = async (ticket_id, comment_id, formData) => {
  const res = await putData(`/tickets/${ticket_id}/comment/${comment_id}`, formData);

  const result = res.data;
  return result;
};

const updateTicketUpload = async (ticket_id, upload_id, formData) => {
  // TODO: extract the form data image into via multipart/form
  let servicedData = await createUpdateUploadForm(formData);
  const res = await putData(`/tickets/${ticket_id}/upload/${upload_id}`, servicedData);

  const result = res.data;
  return result;
};

const deleteProject = async (project_id) => {
  const res = await deleteData(`/projects/${project_id}/delete`);

  const result = res.data;
  return result;
};

const deleteTicket = async (ticket_id) => {
  // TODO: ensure only ADMIN or PROJ MANAGER can delete a ticket
  // TODO: if ticket is deleted then delete all comments and uploads belonging to the ticket
  const res = await deleteData(`/projects/${ticket_id}/delete`);

  const result = res.data;
  return result;
};

// * not yet implemented
const deleteTicketComment = async (ticket_id, comment_id) => {
  const res = await deleteData(`/projects/${ticket_id}/comment/${comment_id}/delete`);

  const result = res.data;
  return result;
};

const deleteTicketUpload = async (ticket_id, upload_id) => {
  const res = await deleteData(`/projects/${ticket_id}/upload/${upload_id}/delete`);

  const result = res.data;
  return result;
};

const deleteUser = async (user_id) => {
  // TODO: user can delete their own acccount, admin or projet manager can only ban account
  const res = await deleteData(`/users/${user_id}`);

  const result = res.data;
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
  // createTicketUpload,
  updateProject,
  updateTicket,
  updateDevAssignedTicket,
  deleteTicketNote,
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