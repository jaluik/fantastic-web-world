let initState = {
  count: 0
};

function counterReducer(state = initState, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1
      };
    case "DECREMENT":
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
}

function createStore(reducer, initState) {
  let state = initState;
  let listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
  }

  function getState() {
    return state;
  }
  function dispatch(action) {
    state = reducer(state, action);
    for (let listener of listeners) {
      listener();
    }
  }
  // 用于传递初始化的值， 因为每个reducer内部需要定义一个初始化值
  dispatch({ type: Symbol() });

  return {
    getState,
    dispatch,
    subscribe
  };
}
// -----------------------------------------------------------
// 简单的重写dispatch函数，让使用者可以方便使用自定义的dispatch函数
// const store = createStore(counterReducer);
// const next = store.dispatch;
// store.dispatch = function(action) {
//   console.log("this state", store.getState());
//   console.log("action", action);
//   next(action);
//   console.log("new state", store.getState());
// };
// store.dispatch({ type: "INCREMENT" });
// -----------------------------------------------------------

// 将store和next函数作为参数传入，使得中间件不依赖store和next
// const store = createStore(counterReducer);
// const next = store.dispatch;
// const loggerMiddleware = store => next => action => {
//   console.log("this state", store.getState());
//   console.log("action", action);
//   next(action);
//   console.log("next state", store.getState());
// };
// const exceptionMiddleware = store => next => action => {
//   try {
//     next(action);
//     console.log("错误报告中间件");
//   } catch (err) {
//     console.log("错误报告: ", err);
//   }
// };
// const timeMiddleware = store => next => action => {
//   console.log("time", new Date().getTime());
//   next(action);
// };
// const logger = loggerMiddleware(store);
// const exeption = exceptionMiddleware(store);
// const time = timeMiddleware(store);
// store.dispatch = time(exeption(logger(next)));
// store.dispatch({ type: "INCREMENT" });
// -----------------------------------------------------------

const applyMiddleware = function(...middlewares) {
  return function rewriteCreateStoreFunc(oldcreateStore) {
    return function(reducer, initstate) {
      const store = oldcreateStore(reducer, initstate);
      const chain = middlewares.map(middleware => middleware(store));
      let dispatch = store.dispatch;
      chain.reverse().map(middleware => {
        dispatch = middleware(dispatch);
      });
      store.dispatch = dispatch;
      return store;
    };
  };
};

const finalCreateMiddleware = (reducer, initState, rewriteCreateStoreFunc) => {
  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(createStore);
    return newCreateStore(reducer, initState);
  }
  return createStore(reducer, initState);
};

// 最终用法
const exceptionMiddleware = store => next => action => {
  try {
    next(action);
    console.log("错误报告中间件");
  } catch (err) {
    console.log("错误报告: ", err);
  }
};
const timeMiddleware = store => next => action => {
  console.log("time", new Date().getTime());
  next(action);
};

const rewriteCreateStoreFunc = applyMiddleware(
  exceptionMiddleware,
  timeMiddleware
);
const store = finalCreateMiddleware(
  counterReducer,
  initState,
  rewriteCreateStoreFunc
);
store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
