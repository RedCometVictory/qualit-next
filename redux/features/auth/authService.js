// import api from "../../../utils/api";
// import { addCardToUser, stripeReset } from "../stripe/stripeSlice";
import { getData, postData, putData, deleteData } from '@/utils/fetchData';
import { userReset } from "../user/userSlice";
// import { clearCartLogout } from "../cart/cartSlice";
// import { orderReset } from "../order/orderSlice";
/*
let currentTheme;
currentTheme = typeof window !== "undefined" && localStorage.getItem('qual__theme');

if(typeof window !== "undefined" && !currentTheme) {
  localStorage.setItem('qual__theme', 'light');
  currentTheme = localStorage.getItem('qual__theme');
}

const initialState = {
  // theme: 'light',
  theme: currentTheme ? currentTheme : false,
  drawer: false,
  backgroundImage: '',
  error: ''
};

*/
import { loadUser as loadUserSlice, clearAuth } from "./authSlice";


const demoUser = async () => {
  const res = await api.get('/auth/demo');
  let result = res.data.data;
  localStorage.setItem("token", JSON.stringify(result.token));
  localStorage.setItem("__userInfo", JSON.stringify(result.userInfo));
  return result;
};

const loadUser = async (thunkAPI) => {
  const res = await api.get('/auth');
  let result = res.data.data;
  if (result.userInfo.stripe_cust_id) {
    thunkAPI.dispatch(addCardToUser(result.userInfo.stripe_cust_id));
  }

  localStorage.setItem("__userInfo", JSON.stringify(result.userInfo));
  return result;
};

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
  console.log("55555555555555")
  console.log("55555555555555")
  console.log("logging out")
  console.log("55555555555555")
  console.log("55555555555555")
  // thunkAPI.dispatch(userReset());
  // if (localStorage.getItem('qual__user')) localStorage.removeItem('qual__user');
  // if (localStorage.getItem('qual__user')) localStorage.removeItem('qual__user');
  await postData('/auth/signout', _);
  console.log("88888888888888888888")
  console.log("clearin auth - logout")
  console.log("88888888888888888888")
  thunkAPI.dispatch(clearAuth());
  return; 
};

const expiredTokenLogout = async (_, thunkAPI) => {
  console.log("55555555555555")
  console.log("55555555555555")
  console.log("expired log out")
  console.log("55555555555555")
  console.log("55555555555555")
  // thunkAPI.dispatch(userReset());
  // if (localStorage.getItem('qual__user')) localStorage.removeItem('qual__user');
  // if (localStorage.getItem('qual__user')) localStorage.removeItem('qual__user');
  // await postData('/auth/expiredSignout', _);
  thunkAPI.dispatch(clearAuth());
  console.log("88888888888888888888")
  console.log("clearin auth - expiredauth")
  console.log("88888888888888888888")
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