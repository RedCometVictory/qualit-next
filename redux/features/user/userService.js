import { getData, postData, putData, deleteData } from '@/utils/fetchData';

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

const getUsersAdmin = async () => {
  const res = await getData(`/users`);
  const result = res;
  // localStorage.setItem('qual__users', JSON.stringify(result));
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
  getUserProfile,
  getUserProfileAdmin,
  getUsersAdmin,
  updateUserInfo,
  createUserProfile,
  updateUserAdmin
};
export default userService;