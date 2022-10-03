import { getData, postData, putData, deleteData } from '@/utils/fetchData';

const fetchCards = async (boardData) => {
  // TODO: access subabase url
  // response from supa
  const res = await getData(`/boards/${boardData}/cards`);
  // let result = res.data.data;
  return res;
};

const addCard = async (formData) => {
  const res = postData(`/boards/board/card/new`)
  return res;
  /*
  const { board } = getState() as { board: BoardSlice };
  const { user } = getState() as { user: SingleUser };
  const { cards } = getState() as { cards: CardSlice };

  const filteredCards = cards.cards.filter((card) => card.columnId === columnId);

  let sequence = 1;

  if (filteredCards.length > 0) {
    sequence = filteredCards[filteredCards.length - 1].sequence + 1;
  }

  const cardId = shortId.generate();

  const data = {
    id: cardId,
    columnId: columnId,
    boardId: board.board._id,
    title: 'Add title',
    type: '',
    description: '',
    dateCreated: new Date().toLocaleString(),
    userId: user.id,
    assignedTo: '',
    sequence
  };

  const url = `${host}/api/boards/${data.boardId}/columns/${columnId}/cards`;

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

const updateCard = async (formData) => {
  const res = await putData(`/boards/board/card?card=${formData}`)
  return res;
  /*
  const { board } = getState() as { board: BoardSlice };

    const url = `${host}/api/boards/${board.board._id}/cards/${obj._id}`;

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
      body: JSON.stringify(obj)
    });

    const inJSON = await response.json();

    return inJSON;
  */
};

const updateCardSequence = async (formData) => {
  const boardId = formData.id;
  const cardId = formData.cardId;
  const res = await putData(`/boards/${boardId}/cards/${cardId}`); 
  return res;
  /*
  const { board } = getState() as { board: BoardSlice };
    const { _id, title, description, columnId, sequence } = obj;

    const data = {
      title,
      description,
      columnId,
      sequence
    };

    const url = `${host}/api/boards/${board.board._id}/cards/${_id}`;

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

    const inJSON = await response.json();

    return inJSON;
  */
};

const deleteCard = async (boardData) => {
  const res = deleteData(`/boards/delete?boardid=${boardData}`)
  return res;
  /*
  const { board } = getState() as { board: BoardSlice };

    const url = `${host}/api/boards/${board.board._id}/cards/${cardId}`;

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

    const inJSON = await response.json();

    return inJSON;
  }
  */
};

const cardService = {
  fetchCards,
  addCard,
  updateCard,
  updateCardSequence,
  deleteCard
};
export default cardService;