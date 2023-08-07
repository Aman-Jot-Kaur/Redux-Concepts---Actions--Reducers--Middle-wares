import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import axios from "axios";
import thunk from "redux-thunk";
//action name constants
const increment = "account/increment";
const incrementbyamount = "account/incrementbyamount";
const incrementBonus = "bonus/increment";
const bonusincrementbyamount = "bonus/incrementbyamount";
const getUserPending = "account/getUserAccount/pending";
const getUserFulfilled = "account/getUserAccount/fulfilled";
const getUserRejected = "account/getUserAccount/rejected";
//store
const store = createStore(
  combineReducers({
    account: accountReducer,
    bonus: bonusReducer,
  }),
  applyMiddleware(logger.default, thunk.default)
);

const history = [];

//reducer
function accountReducer(state = { amount: 1 }, action) {
  switch (action.type) {
    case increment:
      return { amount: state.amount + 1 };
      case getUserPending:
        console.log("pemding😊")
      return { ...state, pending:true};
    case incrementbyamount:
      return { amount: state.amount + action.payload,pending:false };

    case getUserFulfilled:
      return {...state,pending:false };


    case getUserRejected:
      console.log("reached");
      return { ...state, error: action.error, pending: false };
    default:
      return state;
  }
}

function bonusReducer(state = { points: 0 }, action) {
  switch (action.type) {
    case incrementBonus:
      return { points: state.points + 1 };

    case bonusincrementbyamount:
      if (action.payload > 100) return { points: state.points + 10 };

    default:
      return state;
  }
}
//global state

// store.subscribe(()=>{
//     history.push(store.getState())
//     console.log(history)
//     })

//action creators
function incrementFunction() {
  return { type: increment };
}
function incrementbyamountFunction(value) {
  return { type: incrementbyamount, payload: value };
}
function getuserpending() {
  return { type: getUserPending };
}
function getuserfulfilled(value) {
  return { type: getUserFulfilled, payload: value };
}
function getuserrejected(error) {
  return { type: getUserRejected, error: error };
}
//async api call
function getUserAccount(id) {
  return async (dispatch, getState) => {
    try {
        dispatch(getuserpending)
      const { data } = await axios.get(`http://localhost:3000/account/${id}`);

      dispatch(getuserfulfilled(data.amount));
    } catch (error) {
      dispatch(getuserrejected(error.message));
    }
  };
}

// setInterval(()=>{
//     store.dispatch(getUser)
// },2000)
store.dispatch(getUserAccount(2));
