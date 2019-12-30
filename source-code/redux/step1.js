const createStore = function(initStates) {
  let state = initStates;
  const listeners = [];

  const subscribe = function(listener) {
    listeners.push(listener);
  };

  function changeState(newState) {
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
    subscribe,
    changeState
  };
};

let initState = {
  counter: {
    count: 0
  },
  info: {
    name: "",
    description: ""
  }
};

// 使用demo
const store = createStore(initState);

store.subscribe(() => {
  let state = store.getState();
  console.log(`${state.info.name}`);
});

store.changeState({
  ...store.getState(),
  info: {
    name: "张三丰",
    description: "热爱前端的人"
  }
});

let newInitState = {
  count: 0
};
let newStore = createStore(newInitState);

newStore.subscribe(() => {
  let state = newStore.getState();
  console.log(state.count);
});

newStore.changeState({
  count: newStore.getState().count + 1
});
newStore.changeState({
  count: newStore.getState().count - 1
});
newStore.changeState({
  count: "abc"
});

// 无法控制state如何修改，移步Step2改进redux
