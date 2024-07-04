import { getData, postData, putData, deleteData, getDataSSR } from '@/utils/fetchData';

const fetchColumns = async (boardId, cookie = null) => {
  let res;
  if (cookie === null || !cookie) {
    res = await getData(`/boards/${boardId}/columns`);
  } else {
    res = await getDataSSR(`/boards/${boardId}/columns`, cookie);
  };

  const result = res.data;
  return result;
};

const addColumn = async (boardId, formData) => {
  const res = await postData(`/boards/${boardId}/columns`, formData);
  const result = res.data;
  
  return result;
};

const updateColumn = async (boardId, columnId, formData) => {
  const res = await putData(`/boards/${boardId}/columns/${columnId}`, formData);
  const result = res.data;

  return result;
};

const updateColumnSequence = async (boardId, columnId, formData) => {
  const res = await putData(`/boards/${boardId}/columns/${columnId}/sequence`, formData);

  const result = res.data;
  return result;
};

const deleteColumn = async (boardId, columnId) => {
  const res= await deleteData(`/boards/${boardId}/columns/${columnId}`);
  const result = res.data;
  
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