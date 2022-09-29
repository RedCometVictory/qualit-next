// import api from "../../../utils/api";
// import { addCardToUser, stripeReset } from "../stripe/stripeSlice";
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
  const res = await api.post('/auth/register', formRegData);
  const result = res.data.data;
  // return thunkAPI.dispatch(loadUserSlice())
  localStorage.setItem("token", JSON.stringify(result.token));
  localStorage.setItem("__userInfo", JSON.stringify(result.userInfo));
  return result;
};

const loginUser = async (formData, thunkAPI) => {
  const res = await api.post('/auth/login', formData);
  let result = res.data.data;
  // return thunkAPI.dispatch(loadUserSlice())
  localStorage.setItem("token", JSON.stringify(result.token));
  localStorage.setItem("__userInfo", JSON.stringify(result.userInfo));
  return result;
};

const logout = async (navigate, history = null, thunkAPI) => {
  thunkAPI.dispatch(clearCartLogout());
  thunkAPI.dispatch(stripeReset());
  thunkAPI.dispatch(userReset());
  thunkAPI.dispatch(orderReset());
  thunkAPI.dispatch(clearAuth());
  if (localStorage.getItem('__cart')) localStorage.removeItem('__cart');
  if (localStorage.getItem('__paymentMethod')) localStorage.removeItem('__paymentMethod');
  if (localStorage.getItem('__shippingAddress')) localStorage.removeItem('__shippingAddress');
  if (localStorage.getItem('__userInfo')) localStorage.removeItem('__userInfo');
  if (navigate) navigate('/');
  if (history && !navigate) history.push("/");
  await api.post('/auth/logout');
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
  localStorage.setItem("token", newAccessToken);
  return newAccessToken;
};

const authService = {
  demoUser,
  loadUser,
  registerUser,
  loginUser,
  logout,
  deleteUser,
  forgotPassword,
  verifyPassword,
  resetPassword,
  refreshAccessToken
};
export default authService;