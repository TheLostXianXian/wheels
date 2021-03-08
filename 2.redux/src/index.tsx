import React, { useReducer, createContext, useContext, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/Counter'
import Number from './components/Number'
import Parent from './components/Parent'
import store from './myRedux/store'
import CountContext from './context'
import counterReducer from './myRedux/reducers'


const logMiddleware = store => next => (action) => {
  console.log(store)
  console.log(action)
  next(action)
}

const OtherComponent = React.lazy(() => new Promise(resolve => {
  setTimeout(() => resolve(import('./components/OtherComponent')), 3000)
}))

const LazyComponent = ({ children }) => {
  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}


function Temp() {
  let [state, dispatch] = useReducer(counterReducer, { count: 100 })
  const Context = createContext(state)
  const s = useContext(Context)

  const next = dispatch

  // dispatch = function(action) {
  //   next(action)
  // }

  const logger = logMiddleware(state)

  dispatch = logger(next)


  return (
    <Context.Provider value={state}>
      <div>
        {state.count}
        <button onClick={
          () => {
            dispatch({
              type: 'INCREMENT'
            })
          }
        }>+1</button>
        <button onClick={
          () => {
            dispatch({
              type: 'DECREMENT'
            })
          }
        }>-1</button>
        <div>
          <div>
            <h2>{s.count}</h2>
          </div>
        </div>
        {state.count % 2 === 0 ? <LazyComponent>
          <OtherComponent />
        </LazyComponent> : null}
      </div>
    </Context.Provider>

  )
}

const render = () => ReactDOM.render(
  <Temp />,
  document.getElementById('app')
)

render()

store.subscribe(render)