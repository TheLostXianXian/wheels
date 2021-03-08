const applyMiddleware = (...middlewares) => oldCreateStore => (
  reducer,
  initState
) => {
  const store = oldCreateStore(reducer, initState);

  const chain = middlewares.map(middlewares => middlewares(store));

  let dispatch = store.dispatch;

  chain.reverse().forEach(middleware => {
    dispatch = middleware(dispatch);
  });

  store.dispatch = dispatch

  return store;
};

const compose = (...funcs: ((...args: any[]) => any)[]) => {
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

const combineReducers = (reducers) => {
  return (state = {}, action) => {
    const nextState = {}

    Object.keys(reducers).forEach(key => {
      nextState[key] = reducers[key](state[key], action)
    })

    return nextState
  }
}

export {
  applyMiddleware,
  compose,
  combineReducers
}