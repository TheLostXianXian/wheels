import { combineReducers } from '../tools';

function countReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
}

function msgReducer(state, action) {
  switch (action.type) {
    case 'NUCLEAR':
      return {
        ...state,
        msg: '侦测到在途的聚变打击',
      };
    case 'FOR_THE_HORDE':
      return {
        ...state,
        msg: '为了部落',
      };
    default:
      return state;
  }
}

export default countReducer;
