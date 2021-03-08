import React from 'react';
import store from './myRedux/store'

const CountContext = React.createContext(store.getState())

export default CountContext