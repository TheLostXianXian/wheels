import React, { Component } from 'react'

interface Props {
  value: number;
  onIncrement: () => any;
  onDecrement: () => any;
}

class Counter extends Component<Props> {
  incrementIfOdd = () => {
    const { value, onIncrement } = this.props
    if (value % 2 !== 0) {
      onIncrement()
    }
  }

  incrementAsync = () => {
    setTimeout(this.props.onIncrement, 1000)
  }

  render() {
    const { value, onIncrement, onDecrement } = this.props

    return (
      <p>
        Clicked: {value} times
        {' '}
        <button onClick={onIncrement}>
          +
        </button>
        {' '}
        <button onClick={onDecrement}>
          -
        </button>
        {' '}
        <button onClick={this.incrementIfOdd}>
          Increment if odd
        </button>
        {' '}
        <button onClick={this.incrementAsync}>
          Increment async
        </button>
      </p>
    )
  }
}

export default Counter