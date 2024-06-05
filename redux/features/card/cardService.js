import { getData, postData, putData, deleteData } from '@/utils/fetchData';

const fetchCards = async (boardId) => {
  const res = await getData(`/boards/${boardId}/cards`);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Card Service***");
  console.log(result)
  console.log("----- END Card service -----")
  return result;
};

const addCard = async (boardId, columnId, formData) => {
  // const res = postData(`/boards/board/card/new`)
  const res = await postData(`/boards/${boardId}/columns/${columnId}/cards`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Card Service***");
  console.log(result)
  console.log("----- END Card service -----")
  return result;
};

const updateCard = async (boardId, cardId, formData) => {
  const res = await putData(`/boards/${boardId}/cards/${cardId}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Card Service***");
  console.log(result)
  console.log("----- END Card service -----")
  return result;
};

const updateCardSequence = async (boardId, cardId, formdata) => {
  const res = await putData(`/boards/${boardId}/cards/${cardId}/sequence`, formData); 
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Card Service***");
  console.log(result)
  console.log("----- END Card service -----")
  return result;
};

const deleteCard = async (boardId, cardId, formData) => {
  const res = await putData(`/boards/${boardId}/cards/${cardId}`, formData); 
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Card Service***");
  console.log(result)
  console.log("----- END Card service -----")
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