function createStore(
  reducer,
  initState,
  rewriteCreateStoreFunc?: (...args: any[]) => any
) {
  if (typeof initState === 'function') {
    rewriteCreateStoreFunc = initState;
    initState = undefined;
  }

  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(createStore);
    return newCreateStore(reducer, initState);
  }
  let state = initState;
  const listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
    return function unSubscribe() {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }

  dispatch({
    type: Symbol(),
  });

  return {
    subscribe,
    dispatch,
    getState,
  };
}

export default createStore;
