import { getData, postData, putData, deleteData } from '@/utils/fetchData';

const fetchColumns = async (boardId) => {
  const res = await getData(`/boards/${boardId}/columns`);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Column Service***");
  console.log(result)
  console.log("----- END Column service -----")
  return result;
};

const addColumn = async (boardId, formData) => {
  const res = await postData(`/boards/${boardId}/columns`, formData)
  const result = res.data;
  //! TODO: work in a redirect from the creation form page to the noards page -- may not be needed
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Column Service***");
  console.log(result)
  console.log("----- END Column service -----")
  return result;
};

const updateColumn = async (boardId, columnId, formData) => {
  const res= await putData(`/boards/${boardId}/columns/${columnId}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Column Service***");
  console.log(result)
  console.log("----- END Column service -----")
  return result;
};

const updateColumnSequence = async (boardId, columnId, formData) => {
  const res= await putData(`/boards/${boardId}/columns/${columnId}/sequence`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Column Service***");
  console.log(result)
  console.log("----- END Column service -----")
  return result;
};

const deleteColumn = async (boardId, columnId) => {
  const res= await deleteData(`/boards/${boardId}/columns/${columnId}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Column Service***");
  console.log(result)
  console.log("----- END Column service -----")
  return result;
};

const columnService = {
  fetchColumns,
  addColumn,
  updateColumn,
  updateColumnSequence,
  deleteColumn
};
export default columnService;