import { getData, getDataSSR, postData, putData, deleteData } from '@/utils/fetchData';


const getUsersAdmin = async (projectId) => {
  const res = await getData(`/users?projectId=${projectId}`);
  const result = res.data;
  // localStorage.setItem('qual__users', JSON.stringify(result));
  console.log(result)
  return result;
};

const getUsersListAdmin = async (keyword, pageNumber, itemsPerPage, orderBy, cookie) => {
  const res = await getDataSSR(`/users/list-all?keyword=${keyword}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&orderBy=${orderBy}`, cookie);
  const result = res.data;
  // localStorage.setItem('qual__users', JSON.stringify(result));
  console.log(result)
  return result;
};

const getUserAccount = async (cookie) => {
  const res = await getDataSSR(`/users/user/my-account`, cookie);
  let result = res.data;
  console.log("my ^^^^^^^^^^^^ result")
  console.log(result)
  return result;
};

const getUserProfile = async (user_id, cookie) => {
  const res = await getDataSSR(`/users/user/${user_id}`, cookie);
  // localStorage.setItem('qual__user', JSON.stringify(result));
  let result = res.data;
  console.log("my ^^^^^^^^^^^^ result")
  console.log(result)
  return result;
};

const updateAssignmentListsAdmin = async (projectId,) => {
  // const res = await getData(`/users?projectId=${projectId}`);
  // const result = res.data;
  // localStorage.setItem('qual__users', JSON.stringify(result));
  console.log(result)
  return result;
};

const updateAndSaveProjectPersonnelList = async (projectId, assignedUsers, unassignedUsers) => {
  // TODO: get project detail and all tickets belonging to this project, place into tickets [] and project into {}
  console.log("***Project Service for POSTDATA***");
  let formData = {assignedUsers, unassignedUsers};
  console.log("project_id")
  console.log(projectId)
  console.log("formData")
  console.log(formData)
  const res = await postData(`/users/${projectId}/update-personnel`, formData);
  const result = res.data;
  // localStorage.setItem("qual__project", JSON.stringify(result));
  console.log("result")
  console.log(result)
  console.log("----- END user service -----")
  return result;
};

const updateUserProfile = async (formData, userId, router) => {
  const res = await putData(`/users/user/${userId}`, formData);
  let result = res;
  localStorage.setItem('qual__user', JSON.stringify(result));
  router.push(`/users/${userId}/view`);
  return result;
};

// ==============================



const getUserProfileAdmin = async (user_id) => {
  const res = await getData(`/users/${user_id}`);
  localStorage.setItem('qual__users', JSON.stringify(result));
  const result = res;
  return result;
};

// TODO: consider deleting
const updateUserInfo = async (userForm) => {
  const res = await putData(`/users/info`, userForm);
  let result = res;
  localStorage.setItem('qual__user', JSON.stringify(result));
  return result;
};

const createUserProfile = async (profileForm) => {
  const res = await api.post(`/users/profile`, profileForm);
  let result = res.data.data;
  localStorage.setItem('qual__user', JSON.stringify(result));
  return result;
};

const updateUserAdmin = async (user_id, userForm) => {
  const res = await api.put(`/users/${user_id}`, userForm);
  let result = res.data.data;
  localStorage.setItem('qual__user', JSON.stringify(result));
  return result;
};

const userService = {
  getUsersAdmin,
  getUsersListAdmin,
  updateAssignmentListsAdmin,
  updateAndSaveProjectPersonnelList,
  updateUserProfile,
  getUserAccount,
  getUserProfile,
  // ++++++++++++++++++
  getUserProfileAdmin,
  updateUserInfo,
  createUserProfile,
  updateUserAdmin
};
export default userService;