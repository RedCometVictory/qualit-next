import { configureStore } from "@reduxjs/toolkit";
// import setAuthToken from "../utils/setAuthToken";
import themeReducer from "./features/theme/themeSlice";
// import alertReducer from "/features/alert";
// import authReducer from "./features/auth/authSlice";
// import cartReducer from "./features/cart/cartSlice";
// import imageReducer from "./features/image/imageSlice";
// import orderReducer from "./features/order/orderSlice";
// import productReducer from "./features/product/productSlice";
// import slideReducer from "./features/slide/slideSlice";
// import stripeReducer from "./features/stripe/stripeSlice";
// import userReducer from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    // alert: alertReducer,
    // auth: authReducer,
    // cart: cartReducer,
    // image: imageReducer,
    // order: orderReducer,
    // product: productReducer,
    // slide: slideReducer,
    // stripe: stripeReducer,
    // user: userReducer
  },
  // devTools: false, // fasle = disable devtools for prod
});
let currentState = store.getState();

console.log("current state - one")
console.log(currentState)
store.subscribe(() => {
  let previousState = currentState;
  currentState = store.getState(); // from rootReducer
  console.log("current state")
  console.log(currentState)
  // if (previousState.auth.token !== currentState.auth.token) {
    // const token = currentState.auth.token;
    // setAuthToken(token);
  // }
});
export default store;