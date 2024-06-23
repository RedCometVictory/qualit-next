import { getData, postData, putData, deleteData, getDataSSR } from '@/utils/fetchData';

const fetchColumns = async (boardId, cookie = null) => {
  let res;
  if (cookie === null || !cookie) {
    console.log("999999999999999999999999999999")
    console.log("999999999999999999999999999999")
    console.log("getData for column via front end already loaded")
    console.log("boardId")
    console.log(boardId)
    console.log("999999999999999999999999999999")
    console.log("999999999999999999999999999999")
    res = await getData(`/boards/${boardId}/columns`);
  } else {
    console.log("111111111111111111111111111111111")
    console.log("111111111111111111111111111111111")
    console.log("fetching columns via getDataSSR()")
    console.log("boardId")
    console.log(boardId)
    console.log("111111111111111111111111111111111")
    console.log("111111111111111111111111111111111")
    res = await getDataSSR(`/boards/${boardId}/columns`, cookie);
  };

  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Column FETCH RESULT Service***");
  console.log(result)
  console.log("----- END Column service -----")
  return result;
};

const addColumn = async (boardId, formData) => {
  console.log("FFFFFFFFFFFFFFFFFFFFFFFFFF")
  console.log("formData")
  console.log(formData)
  console.log("FFFFFFFFFFFFFFFFFFFFFFFFFF")
  console.log("FFFFFFFFFFFFFFFFFFFFFFFFFF")
  const res = await postData(`/boards/${boardId}/columns`, formData);
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
  console.log("777777777777777")
  console.log("777777777777777")
  console.log("formData")
  console.log(formData)
  console.log("777777777777777")
  console.log("777777777777777")
  const res = await putData(`/boards/${boardId}/columns/${columnId}`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Column Service***");
  console.log(result)
  console.log("----- END Column service -----")
  return result;
};

const updateColumnSequence = async (boardId, columnId, formData) => {
  // const res= await putData(`/boards/${boardId}/columns/${columnId}/sequence`, formData);
  const res= await putData(`/boards/${boardId}/columns/${formData.id}/sequence`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result.project));
  // TODO: place updated project data into project {} and save new state into LS qual__project
  console.log("***Column Service***");
  console.log(result)
  console.log("----- END Column service -----")
  return result;
};

const deleteColumn = async (boardId, columnId) => {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
  console.log("boardId")
  console.log(boardId)
  console.log("---===---")
  console.log("columnId")
  console.log(columnId)
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
  const res= await deleteData(`/boards/${boardId}/columns/${columnId}`);
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