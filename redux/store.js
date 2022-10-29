import { createWrapper } from "next-redux-wrapper";
import { configureStore } from "@reduxjs/toolkit";
// import setAuthToken from "../utils/setAuthToken";
import authReducer from "./features/auth/authSlice";
import boardReducer from "./features/board/boardSlice";
import cardReducer from "./features/card/cardSlice";
import columnReducer from "./features/column/columnSlice";
import projectReducer from "./features/project/projectSlice";
import themeReducer from "./features/theme/themeSlice";
// import userReducer from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    card: cardReducer,
    column: columnReducer,
    theme: themeReducer,
    project: projectReducer,
    // order: orderReducer,
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
const wrapper = createWrapper(store);
// const wrapper = createWrapper(store, {
  // debug: false,
// });
export default wrapper;
// export default store;








/* ORIGINAL STORE DO NOT DELETE UNTIL WRAPPER WOrks
import { configureStore } from "@reduxjs/toolkit";
// import setAuthToken from "../utils/setAuthToken";
import authReducer from "./features/auth/authSlice";
import boardReducer from "./features/board/boardSlice";
import cardReducer from "./features/card/cardSlice";
import columnReducer from "./features/column/columnSlice";
import projectReducer from "./features/project/projectSlice";
import themeReducer from "./features/theme/themeSlice";
// import userReducer from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    card: cardReducer,
    column: columnReducer,
    theme: themeReducer,
    project: projectReducer,
    // order: orderReducer,
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

 */










/* EXAMPLE - 01
import { HYDRATE, createWrapper, MakeStore } from 'next-redux-wrapper';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { AnyAction, combineReducers, Reducer } from 'redux';
import count from '../features/countSlice';

const combinedReducer = combineReducers({ count });

// export type RootState = ReturnType<typeof combinedReducer>;
// type HydratedReducer = Reducer<RootState, AnyAction>;

const reducer: HydratedReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState: RootState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };

    if (state && state.count.count !== 0)
      nextState.count.count = state.count.count; // preserve count value on client side navigation
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

const makeStore: MakeStore = (_) => {
  return configureStore({ reducer });
};

export const wrapper = createWrapper(makeStore);

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
*/