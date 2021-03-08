const exceptionMiddle = store => next => action => {
  try {
    next(action);
  } catch (err) {
    console.error('error msg: ', err);
  }
};
