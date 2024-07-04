import { getData, postData, putData, deleteData, getDataSSR } from '@/utils/fetchData';

const fetchCards = async (boardId, cookie = null) => {
  let res;
  if (cookie === null || !cookie) {
    res = await getData(`/boards/${boardId}/cards`);
  } else {
    res = await getDataSSR(`/boards/${boardId}/cards`, cookie);
  };

  const result = res.data;
  return result;
};

const addCard = async (boardId, columnId, formData) => {
  const res = await postData(`/boards/${boardId}/columns/${columnId}/cards`, formData);

  const result = res.data;
  return result;
};

const updateCard = async (boardId, cardId, formData) => {
  const res = await putData(`/boards/${boardId}/cards/${cardId}`, formData);

  const result = res.data;
  return result;
};

const updateCardSequence = async (boardId, cardId, formData) => {
  const res = await putData(`/boards/${boardId}/cards/${cardId}/sequence`, formData); 

  const result = res.data;
  return result;
};

const deleteCard = async (boardId, cardId) => {
  const res = await deleteData(`/boards/${boardId}/cards/${cardId}`); 

  const result = res.data;
  return result;
};

const cardService = {
  fetchCards,
  addCard,
  updateCard,
  updateCardSequence,
  deleteCard
};
export default cardService;