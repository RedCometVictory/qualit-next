import { deleteData, getData, getDataSSR, postData, putData } from "@/utils/fetchData";

const getAllBoards = async (cookie) => {
  // const res = await api.get();
  // get all boards belonging to logged in user, as these are their tasks
  // const id = userData.id;
  // const res = await getData(`/boards/all?userid=${id}`);
  // const res = await getData(`/boards?userId=${id}`);
  // const res = await getDataSSR(`/boards?userId=${id}`);
  const res = await getDataSSR(`/boards`, cookie);
  // const res = await getDataSSR(`/boards?userId=${id}`, cookie);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Board Service***");
  console.log(result)
  console.log("----- END Board service -----")
  return result;
};

const getBoard = async (boardId, cookie) => {
  // const res = await getData(`/boards/board?boardid=${boardId}`);
  // const res = await getData(`/boards/board/${boardId}`);
  const res = await getDataSSR(`/boards/${boardId}`, cookie);
  const result = res.data;

  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Board Service***");
  console.log(result)
  console.log("----- END Board service -----")
  return result;
};

const createBoard = async (formData) => {
  // const res = await postData(`/boards/new`, formData);
  console.log("^^^^^^^^^^^^^^^^^^")
  console.log("^^^^^^^^^^^^^^^^^^")
  console.log(formData)
  console.log("^^^^^^^^^^^^^^^^^^")
  console.log("^^^^^^^^^^^^^^^^^^")
  const res = await postData(`/boards`, formData);
  const result = res.data;
  //! TODO: work in a redirect from the creation form page to the noards page
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Board Service***");
  console.log(result)
  console.log("----- END Board service -----")
  return result;
};

const saveBoard = async (boardFormData, boardId) => {
  const res = await putData(`/boards/${boardId}`, boardFormData);
  const result = res.data;

  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Board Service***");
  console.log(result)
  console.log("----- END Board service -----")
  return result;
};

const deleteBoard = async (boardId) => {
  // const res = await deleteData(`/boards/board/delete?boardid=${id}`);
  const res = await deleteData(`/boards/${boardId}`);

  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Board Service***");
  console.log(result)
  console.log("----- END Board service -----")
  return result;
};

const boardService = {
  getAllBoards,
  getBoard,
  createBoard,
  saveBoard,
  deleteBoard
};
export default boardService;