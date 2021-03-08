import React from 'react'

function Number({ count, onIncrement, onDecrement }) {
  const iffOdd = () => {
    if (count % 2 === 1) onIncrement()
  }

  const syncInc = () => {
    setTimeout(() => {
      onIncrement()
    }, 1000)
  }
  return (
    <div>
      <button onClick={onIncrement}>+</button>
      <span>{count}</span>
      <button onClick={onDecrement}>-</button>
      <button onClick={iffOdd}>if odd</button>
      <button onClick={syncInc}>1s</button>
    </div>
  )
}

export default Number