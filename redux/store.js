import { configureStore } from "@reduxjs/toolkit";
// import setAuthToken from "../utils/setAuthToken";
import authReducer from "./features/auth/authSlice";
import boardReducer from "./features/board/boardSlice";
import cardReducer from "./features/card/cardSlice";
import columnReducer from "./features/column/columnSlice";
import themeReducer from "./features/theme/themeSlice";
// import userReducer from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    card: cardReducer,
    column: columnReducer,
    theme: themeReducer,
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
  //   const token = currentState.auth.token;
  //   setAuthToken(token);
  // }
});
export default store;