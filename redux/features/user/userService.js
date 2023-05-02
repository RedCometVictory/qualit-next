import { getData, postData, putData, deleteData } from '@/utils/fetchData';


const getUsersAdmin = async (projectId) => {
  const res = await getData(`/users?projectId=${projectId}`);
  const result = res.data;
  // localStorage.setItem('qual__users', JSON.stringify(result));
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

// ==============================

const getUserProfile = async (card) => {
  const res = await getData(`/users/me`);
  localStorage.setItem('qual__user', JSON.stringify(result));
  let result = res;
  return result;
};

const getUserProfileAdmin = async (user_id) => {
  const res = await getData(`/users/${user_id}`);
  localStorage.setItem('qual__users', JSON.stringify(result));
  const result = res;
  return result;
};


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
  updateAssignmentListsAdmin,
  updateAndSaveProjectPersonnelList,
  // ++++++++++++++++++
  getUserProfile,
  getUserProfileAdmin,
  updateUserInfo,
  createUserProfile,
  updateUserAdmin
};
export default userService;