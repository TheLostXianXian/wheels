import React from 'react'
import CountContext from '../context'

function Child() {
  return <CountContext.Consumer>
    {store =>
      <div>
        {store.getState().count}
        <button onClick={() => {
          store.dispatch({
            type: "INCREMENT"
          })
        }}>+1 in Child</button>
      </div>
    }
  </CountContext.Consumer>
}

export default Child