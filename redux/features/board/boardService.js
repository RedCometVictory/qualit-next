import { deleteData, getData, postData, putData } from "@/utils/fetchData";

const getAllBoards = async (userData) => {
  // const res = await api.get();
  // get all boards belonging to logged in user, as these are their tasks
  const id = userData.id;
  const res = await getData(`/boards/all?userid=${id}`);
  return res;
};

const getBoard = async (formData) => {

  // const res = await getData(`/boards/board?boardid=${boardId}`);
  const res = await getData(`/boards/board/${boardId}`);
};

const createBoard = async (formData) => {
  const res = await postData(`/boards/new`);

  /*
    const { board } = getState() as { board: BoardSlice };
  const { user } = getState() as { user: SingleUser };

  const data = {
    _id: board.board._id,
    name: board.board.name,
    dateCreated: board.board.dateCreated,
    createdBy: user.id,
    backgroundImage: '/boards/board-background.jpg'
  };

  const url = `${host}/api/boards`;

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });

  const inJSON = await response.json();
  return inJSON;
  */
};

const saveBoard = async (formData) => {
  const res = await putData(`/boards/save`);
  /*
  const { board } = getState() as { board: BoardSlice };

  const data = {
    _id: board.board._id,
    name: board.board.name,
    dateCreated: board.board.dateCreated,
    createdBy: board.board.createdBy,
    backgroundImage: board.board.backgroundImage
  };

  const url = `${host}/api/boards/${data._id}`;

  const response = await fetch(url, {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });

  const json = await response.json();

  return json;
  */
};

const deleteBoard = async (formData) => {
  const id = formData.id;
  const res = await deleteData(`/boards/board/delete?boardid=${id}`);
  /*
  const { board } = getState() as { board: BoardSlice };

  const _id = board.board._id;

  const url = `${host}/api/boards/${_id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });

  const json = await response.json();

  return json;
  */
};

const boardService = {
  getAllBoards,
  getBoard,
  createBoard,
  saveBoard,
  deleteBoard
};
export default boardService;