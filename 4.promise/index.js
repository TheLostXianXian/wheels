const isFunc = fn => typeof fn === 'function';
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(handler) {
    if (!isFunc(handler)) {
      throw new Error('constructor arg must be a function');
    }

    this._status = PENDING;
    this._value = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    try {
      handler(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  _resolve(value) {
    
    const run = () => {
      if (this._status !== PENDING) return;
      const runFulfilled = value => {
        this.onFulfilledCallbacks.forEach(fn => fn(value));
      };

      const runRejected = reason => {
        this.onRejectedCallbacks.forEach(fn => fn(reason));
      };

      if (value instanceof MyPromise) {
        value.then(
          value => {
            this._status = FULFILLED;
            this._value = value;
            runFulfilled(value);
          },
          error => {
            this._status = REJECTED;
            this._value = error;
            runRejected(error);
          }
        );
      } else {
        this._status = FULFILLED;
        this._value = value;
        runFulfilled(value);
      }
    };

    setTimeout(run, 0);
  }

  _reject(reason) {
    
    const run = () => {
      if (this._status !== PENDING) return;
      this._status = REJECTED;
      this._value = reason;

      this.onRejectedCallbacks.forEach(fn => fn(reason));
    };

    setTimeout(run, 0);
  }

  then(onFulfilled, onRejected) {
    const { _value, _status } = this;
    return new MyPromise((resolve, reject) => {
      const fulfilled = value => {
        try {
          if (!isFunc(onFulfilled)) {
            resolve(value);
          } else {
            const res = onFulfilled(value);
            if (res instanceof MyPromise) {
              res.then(resolve, reject);
            } else {
              resolve(res);
            }
          }
        } catch (error) {
          reject(error);
        }
      };

      const rejected = reason => {
        try {
          if (!isFunc(onRejected)) {
            reject(reason);
          } else {
            const res = onRejected(reason);
            if (res instanceof MyPromise) {
              res.then(resolve, reject);
            } else {
              resolve(res);
            }
          }
        } catch (error) {
          reject(error);
        }
      };

      switch (_status) {
        case PENDING:
          this.onFulfilledCallbacks.push(fulfilled);
          this.onRejectedCallbacks.push(rejected);
          break;
        case FULFILLED:
          fulfilled(_value);
          break;
        case REJECTED:
          rejected(_value);
          break;
        default:
          break;
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }

  static reject(error) {
    return new MyPromise((resolve, reject) => reject(error));
  }

  static all(list) {
    let count = 0;
    const values = [];
    return new MyPromise((resolve, reject) => {
      for (const [i, v] of list.entries()) {
        this.resolve(v).then(
          res => {
            count++;
            values[i] = res;
          },
          err => {
            reject(err);
          }
        );
      }

      if (count === list.length) {
        resolve(values);
      }
    });
  }

  static race(list) {
    return new MyPromise((resolve, reject) => {
      for (const v of list) {
        this.resolve(v).then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }

  finally(cb) {
    return this.then(
      value => MyPromise.resolve(cb()).then(() => value),
      error =>
        MyPromise.reject(cb()).then(undefined, () => {
          throw error;
        })
    );
  }
}

// var p1 = new MyPromise(resolve => resolve(2))
// var p2 = '123'
// var p3 = MyPromise.reject(100)
// var p4 = MyPromise.resolve(200)

// MyPromise.race([p1,p2,p3,p4]).then(res => console.log(res), err => console.log('err', err))

var p1 = new Promise(resolve => resolve(2))
var p2 = '123'
var p3 = Promise.reject(100)
var p4 = Promise.resolve(200)

Promise.race([p1,p2,p3,p4]).then(res => console.log(res), err => console.log('err', err))

