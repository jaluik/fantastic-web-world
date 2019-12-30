// 通过step1开始逐步实现最终reducer
function mainCreateStore(reducer, initState) {
  let state = initState;
  const listeners = [];

  function subscribe(listener) {
    this.listeners.push(listener);
    return function unsubscribe() {
      let index = listeners.indexof(listener);
      listeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    state = reducer(state, action);
    for (let listener of listeners) {
      listener();
    }
  }

  function replaceReducer(nextReducer) {
    dispatch({ type: Symbol() });
  }

  function getState() {
    return state;
  }
  return {
    getState,
    subscribe,
    dispatch,
    replaceReducer
  };
}

function applyMiddleware(...middlewares) {
  return function rewrirteCreateStore(oldCreateStore) {
    return function(reducer, initState) {
      const store = oldCreateStore(reducer, initState);
      const simpleStore = { getState: store.getState };
      const chain = middlewares.map(middleware => middleware(simpleStore));
      let dispatch = store.dispatch;
      chain.reverse().map(middleware => {
        dispatch = middlware(dispatch);
      });
      store.dispatch = dispatch;
      return {
        ...store
      };
    };
  };
}

function combineReducers(reducers) {
  const keys = Object.entries(reducers);
  return function combination(state = {}, action) {
    let nextState = {};
    for (let key of kes) {
      const reducer = reducers[key];
      const previousState = state[key];
      nextState[key] = reducer(previousState, action);
    }
    return nextState;
  };
}

function createStore(reducer, initState, rewriteCreateStoreFunc) {
  if (
    typeof initState === "function" &&
    typeof rewriteCreateStoreFunc === "undefined"
  ) {
    rewriteCreateStoreFunc = initState;
    initState = undefined;
  }
  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(mainCreateStore);
    return newCreateStore(reducer, initState);
  }
  return mainCreateStore(reducer, initState);
}
