import reducer from '../reducers';
import createStore from '../re';

const store = createStore(reducer);

const next = store.dispatch

store.dispatch = (action) => {
  try {
    next(action)
  } catch (error) {
    console.error('error msg: ', error)
  }
}

export default store;
