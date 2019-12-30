const createStore = function(reducer, initState) {
  let state = initState;
  const listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
  }

  function dispatch(action) {
    const newState = reducer(state, action);
    state = newState;
    for (let listener of listeners) {
      listener();
    }
  }

  function getState() {
    return state;
  }
  return {
    getState,
    dispatch,
    subscribe
  };
};

const initState = {
  counter: {
    count: 0
  },
  info: {
    name: "jaluik",
    description: "热爱前端的人"
  }
};

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1
      };
    case "DECREMENT": {
      return {
        ...state,
        count: state.count - 1
      };
    }
    default:
      return state;
  }
}

function infoReducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return {
        ...state,
        name: action.name
      };
    case "SET_DESCRIPTION":
      return {
        ...state,
        description: action.description
      };
    default:
      return state;
  }
}

const reducer = combineReducers({
  counter: counterReducer,
  info: infoReducer
});

function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const nextState = {};
  return function combination(state = {}, action) {
    for (let key of reducerKeys) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
    }
    return nextState;
  };
}

const store = createStore(reducer, initState);

store.subscribe(() => {
  console.log(`${store.getState().counter.count}`);
});
store.subscribe(() => {
  console.log(
    `${store.getState().info.name}---${store.getState().info.description}`
  );
});

store.dispatch({
  type: "INCREMENT"
});
store.dispatch({
  type: "DECREMENT"
});
store.dispatch({
  type: "SET_NAME",
  name: "new jaluik"
});
store.dispatch({
  type: "SET_DESCRIPTION",
  description: "introduction to me"
});
store.dispatch({
  type: "INCREMENT"
});

// 此处的关键在于initState下面的key值必须与reducer下面的key值一一对应，否则是不成立的
// 接下来我们可以拆分state, 进入step4
