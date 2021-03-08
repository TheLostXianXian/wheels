/**
 * createStore
 * subscribe, dispatch, getState,
 */
function createStore(reducer, initState?: { [props: string]: any } & ((...args: any[]) => any), rewriteCreateStoreFunc?: (...args : any[]) => any) {
  let state = initState;
  const listeners = [];

  if (typeof initState === 'function') {
    rewriteCreateStoreFunc = initState
    initState
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners.splice(listeners.indexOf(fn), 1);
    };
  }

  function dispatch(action) {
    state = reducer(state, action);

    listeners.forEach(fn => fn());
  }

  function getState() {
    return state;
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



