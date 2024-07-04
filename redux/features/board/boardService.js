import { deleteData, getData, getDataSSR, postData, putData } from "@/utils/fetchData";

const getAllBoards = async (cookie) => {
  const res = await getDataSSR(`/boards`, cookie);
  const result = res.data;
  return result;
};

const getBoard = async (boardId, cookie) => {
  const res = await getDataSSR(`/boards/${boardId}`, cookie);
  const result = res.data;
  return result;
};

const createBoard = async (formData) => {
  const res = await postData(`/boards`, formData);
  const result = res.data;
  return result;
};

const saveBoard = async (boardFormData, boardId) => {
  const res = await putData(`/boards/${boardId}`, boardFormData);
  const result = res.data;
  return result;
};

const deleteBoard = async (boardId) => {
  const res = await deleteData(`/boards/${boardId}`);
  const result = res.data;
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