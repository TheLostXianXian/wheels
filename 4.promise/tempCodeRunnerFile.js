const isFunction = fn => typeof fn === 'function';

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
  constructor(handler) {
    if (!isFunction(handler)) {
      throw new Error('constructor param must be a function');
    }

    this._status = PENDING;
    this._value = undefined;

    this._onFullfilledCallbacks = [];
    this._onRejectedCallbacks = [];

    try {
      handler(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  _resolve(value) {
    const run = () => {
      const runFullfiled = val => {
        if (this._status !== PENDING) return;

        this._status = FULFILLED;
        this._value = val;

        this._onFullfilledCallbacks.forEach(fn => fn(val));
      };

      const runRejected = reason => {
        if (this._status !== PENDING) return;

        this._status = REJECTED;
        this._value = reason;

        this._onRejectedCallbacks.forEach(fn => fn(reason));
      };

      if (value instanceof MyPromise) {
        value.then(
          val => runFullfiled(val),
          err => runRejected(err)
        );
      } else {
        runFullfiled(value);
      }
    };

    setTimeout(run, 0);
  }

  _reject(reason) {
    const run = () => {
      if (this._status !== PENDING) return;

      this._status = REJECTED;
      this._value = reason;

      this._onRejectedCallbacks.forEach(fn => fn(reason));
    };

    setTimeout(run, 0);
  }

  then(onFullfilled, onRejected) {
    const { _status, _value } = this;
    const p = new MyPromise((resolve, reject) => {
      const fullfilled = value => {
        try {
          if (isFunction(onFullfilled)) {
            const res = onFullfilled(value);
            if (res instanceof MyPromise) {
              if (p === res) {
                throw new Error('cycling');
              }
              res.then(resolve, reject);
            } else {
              resolve(res);
            }
          } else {
            resolve(value);
          }
        } catch (error) {
          reject(error);
        }
      };

      const rejected = reason => {
        try {
          if (isFunction(onRejected)) {
            const res = onRejected(reason);

            if (res instanceof MyPromise) {
              if (p === res) {
                throw new Error('cycling');
              }
              res.then(resolve, reject);
            } else {
              resolve(res);
            }
          } else {
            reject(reason);
          }
        } catch (error) {
          reject(error);
        }
      };

      switch (_status) {
        case PENDING:
          this._onFullfilledCallbacks.push(fullfilled);
          this._onRejectedCallbacks.push(rejected);
          break;
        case FULFILLED:
          fullfilled(_value);
          break;
        case REJECTED:
          rejected(_value);
          break;
        default:
          break;
      }
    });

    return p;
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  static all(list) {
    let count = 0;
    const values = [];

    return new MyPromise((resolve, reject) => {
      for (const [k, p] of list.entries()) {
        MyPromise.resolve(p).then(
          val => {
            count++;
            values[k] = val;
            if (count === list.length) resolve(values);
          },
          err => reject(err)
        );
      }
    });
  }

  static race(list) {
    return new MyPromise((resolve, reject) => {
      for (const p of list) {
        MyPromise.resolve(p).then(
          val => {
            resolve(val);
          },
          err => reject(err)
        );
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(cb) {
    return this.then(
      val => MyPromise.resolve(cb()).then(() => val),
      reason =>
        MyPromise.reject(cb()).then(undefined, () => {
          throw reason;
        })
    );
  }
}

// 不能处理循环引用

// const promise = new Promise((resolve, reject) => {
//   resolve(1);
// }).then(() => {
//   return promise
// })

// var p1 = new MyPromise(resolve => resolve(2));
// var p2 = '123';
// var p3 = MyPromise.reject(100);
// var p4 = MyPromise.resolve(200);

// MyPromise.all([p1, p2, p3, p4]).then(
//   res => console.log(res),
//   err => console.log('err', err)
// ).catch(err => {
//   console.log('catch', err)
// }).finally(() => {
//   console.log('finally')
// })

var p1 = new Promise(resolve => resolve(2));
var p2 = '123';
var p3 = Promise.reject(100);
var p4 = Promise.resolve(200);

Promise.all([p1, p2, p3, p4]).then(
  res => console.log(res),
  err => console.log('err', err)
).catch(err => {
  console.log('catch', err)
}).finally(() => {
  console.log('finally')
})
