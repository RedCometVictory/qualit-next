
import { getData, postData, putData, deleteData } from '@/utils/fetchData';
import { userReset } from "../user/userSlice";
import { loadUser as loadUserSlice, clearAuth } from "./authSlice";


const demoUser = async (router) => {
  const res = await getData('/auth/demo/admin');
  let result = res.data;
  localStorage.setItem("qual__user", JSON.stringify(result.user));
  router.push('/');
  // localStorage.setItem("__userInfo", JSON.stringify(result.userInfo));
  return result;
};

// const loadUser = async (thunkAPI) => {
//   const res = await api.get('/auth');
//   let result = res.data.data;
//   if (result.userInfo.stripe_cust_id) {
//     thunkAPI.dispatch(addCardToUser(result.userInfo.stripe_cust_id));
//   }

//   localStorage.setItem("__userInfo", JSON.stringify(result.userInfo));
//   return result;
// };

const registerUser = async (formRegData, thunkAPI) => {
  const res = await postData(`/auth/signup`, formRegData);
  const result = res.data;
  localStorage.setItem("qual__user", JSON.stringify(result.user));
  return result;
};

const loginUser = async (formData, router, thunkAPI) => {
  const res = await postData('/auth/signin', formData);
  let result = res.data;
  localStorage.setItem("qual__user", JSON.stringify(result.user));
  router.push('/');
  return result;
};

const logout = async (_, thunkAPI) => {
  await postData('/auth/signout', _);
  thunkAPI.dispatch(clearAuth());
  return; 
};

const expiredTokenLogout = async (_, thunkAPI) => {
  thunkAPI.dispatch(clearAuth());
  return; 
};

const deleteUser = async (navigate, thunkAPI) => {
  thunkAPI.dispatch(clearCartLogout());
  thunkAPI.dispatch(userReset());
  thunkAPI.dispatch(clearAuth());
  await api.delete('/auth/remove');
  return navigate('/');
};

const forgotPassword = async (email) => {
  const res = await api.post('/auth/forgot-password', {email});
  let result = res.data;
  return result;
};

const verifyPassword = async (token, email, navigate) => {
  const res = await api.post(`/auth/verify-reset?token=${token}&email=${email}`);
  let result = res.data;
  return result;
};

const resetPassword = async (token, email, passwords, navigate) => {
  const res = await api.post(`/auth/reset-password?token=${token}&email=${email}`, passwords);
  let result = res.data.status;
  navigate('/login');
  return result;
};

const refreshAccessToken = async (newAccessToken, tokenExample) => {
  localStorage.setItem("qual__token", newAccessToken);
  return newAccessToken;
};

const authService = {
  demoUser,
  loadUser,
  registerUser,
  loginUser,
  logout,
  expiredTokenLogout,
  deleteUser,
  forgotPassword,
  verifyPassword,
  resetPassword,
  refreshAccessToken
};
export default authService;