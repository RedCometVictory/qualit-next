import { getData, postData, p, deleteData } from '@/utils/fetchData';

const getProjects = async() => {
  const res = await getData(`/projects`);
  const result = res.data;
  localStorage.setItem("qual__projects", JSON.stringify(result.projects));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const getProject = async(project_id) => {
  // TODO: get project detail and all tickets belonging to this project, place into tickets [] and project into {}
  const res = await getData(`/projects/${project_id}`);
  const result = res.data;
  localStorage.setItem("qual__project", JSON.stringify(result));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};
const getTicket = async(ticket_id) => {
  // TODO: get ticket detail (place into ticket: {}) ALSO, get all comments and uplaods belonging to this indiv ticket (place into comments [] and uploads [] respectively)
  const res = await getData(`/tickets/${ticket_id}`);
  const result = res.data;
  localStorage.setItem("qual__project", JSON.stringify(result.tickets));
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const createProject = async(formData) => {
  const res = await postData(`/projects`, formData);
  const result = res.data;
  // localStorage.setItem("qual__projects", JSON.stringify(result.project));
  // TODO: place newly created project ointo projects [] and save new state into LS qual__projects
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const createTicket = async(formData) => {
  const res = await postData(`/tickets`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place newly created ticket ointo tickets [] and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const createTicketComment = async(ticket_id, formData) => {
  const res = await postData(`/tickets/${ticket_id}/comment`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place newly created ticket comment ointo comments [] and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const createTicketUpload = async(ticket_id, formData) => {
  // TODO: extract the form data image into via multipart/form
  let servicedData = await createUploadForm(formData);
  const res = await postData(`/tickets/${ticket_id}/upload`, servicedData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place newly created ticket upload ointo uploads [] and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const updateProject = async(project_id, formData) => {
  const res = await postData(`/projects/${project_id}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};

const updateTicket = async(ticket_id, formData) => {
  const res = await postData(`/tickets/${ticket_id}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated ticket data into ticket {} and save new state into LS qual__project
  console.log("***Project Service***");
  console.log(result)
  console.log("----- END project service -----")
  return result;
};


const projectService = {
  getProjects,
  getProject,
  getTicket,
  createProject,
  createTicket,
  createTicketComment,
  createTicketUpload,
  updateProject,
  updateTicket
};
export default projectService;