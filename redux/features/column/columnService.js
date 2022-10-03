import { getData, postData, putData, deleteData } from '@/utils/fetchData';

const fetchColumns = async (boardId) => {
  const res = await getData(`/boards/${boardId}/columns`);
  return res;
};

const addColumn = async () => {
  /*
  const { board } = getState() as { board: BoardSlice };
    const { user } = getState() as { user: SingleUser };
    const { columns } = getState() as { columns: ColumnsSlice };

    const columsArray = columns.columns;
    let sequence = 1;

    if (columns.columns.length > 0) {
      sequence = columsArray[columsArray.length - 1].sequence + 1;
    }

    const data = {
      id: columnId,
      boardId: board.board._id,
      columnName: 'Add title',
      dateCreated: new Date().toLocaleString(),
      userId: user.id,
      sequence
    };

    const url = `${host}/api/boards/${data.boardId}/columns`;

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

const updateColumn = async () => {
  /*
  const { board } = getState() as { board: BoardSlice };

    const data = {
      _id: obj.columnId,
      boardName: board.board.name,
      columnName: obj.columnName
    };

    const url = `${host}/api/boards/${board.board._id}/columns/${obj.columnId}`;

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

const updateColumnSequence = async () => {
  /*
  const { board } = getState() as { board: BoardSlice };
    const { _id, sequence } = obj;

    const data = {
      _id,
      sequence
    };

    const url = `${host}/api/boards/${board.board._id}/columns/${_id}`;

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

const deleteColumn = async () => {
    /*
    const { board } = getState() as { board: BoardSlice };

    const url = `${host}/api/boards/${board.board._id}/columns/${columnId}`;

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
    */
};

const columnService = {
  fetchColumns,
  addColumn,
  updateColumn,
  updateColumnSequence,
  deleteColumn
};
export default columnService;