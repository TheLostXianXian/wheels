import React, { Component } from 'react'

interface Props {
  value: {
    counter: {
      count: number
    };
    info: {
      msg: string
    };
  };
  onIncrement: () => any;
  onDecrement: () => any;
  onDetectNuclear: () => any;
  onRage: () => any;
}

class Counter extends Component<Props> {
  incrementIfOdd = () => {
    const { value, onIncrement } = this.props
    if (value.counter.count % 2 !== 0) {
      onIncrement()
    }
  }

  incrementAsync = () => {
    setTimeout(this.props.onIncrement, 1000)
  }

  render() {
    const { value, onIncrement, onDecrement, onDetectNuclear, onRage } = this.props

    return (
      <p>
        Clicked: {value.counter.count} times
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
        <button onClick={onDetectNuclear}>
          Ghost
        </button>
        <button onClick={onRage}>
          Rage
        </button>
        <span>{value.info.msg}</span>
      </p>
    )
  }
}

export default Counter