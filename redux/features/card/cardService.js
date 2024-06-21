import { getData, postData, putData, deleteData, getDataSSR } from '@/utils/fetchData';

const fetchCards = async (boardId, cookie = null) => {
  let res;
  if (cookie === null || !cookie) {
    console.log("999999999999999999999999999999")
    console.log("999999999999999999999999999999")
    console.log("getData for card via front end already loaded")
    console.log("boardId")
    console.log(boardId)
    console.log("999999999999999999999999999999")
    console.log("999999999999999999999999999999")
    res = await getData(`/boards/${boardId}/cards`);
  } else {
    console.log("111111111111111111111111111111111")
    console.log("111111111111111111111111111111111")
    console.log("fetching cards via getDataSSR()")
    res = await getDataSSR(`/boards/${boardId}/cards`, cookie);
    console.log("boardId")
    console.log(boardId)
    console.log("111111111111111111111111111111111")
    console.log("111111111111111111111111111111111")
  };

  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Card Service***");
  console.log(result)
  console.log("----- END Card service -----")
  return result;
};

const addCard = async (boardId, columnId, formData) => {
// const addCard = async (boardId, columnId) => {
  // const res = postData(`/boards/board/card/new`)
  console.log("OPOPOPOPOPOPOPOPOPOPOPO")
  console.log("OPOPOPOPOPOPOPOPOPOPOPO")
  console.log("boardId")
  console.log(boardId)
  console.log("columnId")
  console.log(columnId)
  console.log("formData")
  console.log(formData)
  console.log("OPOPOPOPOPOPOPOPOPOPOPO")
  console.log("OPOPOPOPOPOPOPOPOPOPOPO")
  const res = await postData(`/boards/${boardId}/columns/${columnId}/cards`, formData);
  // const res = await postData(`/boards/${boardId}/columns/${columnId}/cards`);
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

const updateCardSequence = async (boardId, cardId, formData) => {
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