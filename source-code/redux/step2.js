const createStore = function(plan, initState) {
  let state = initState;
  const listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
  }

  function changeState(action) {
    const newState = plan(state, action);
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
    changeState,
    subscribe
  };
};

const initState = {
  count: 3
};

function plan(state, action) {
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

const store = createStore(plan, initState);

store.subscribe(() => {
  console.log(store.getState());
});
store.changeState({ type: "INCREMENT" });
store.changeState({ type: "INCREMENT" });
store.changeState({ type: "INCREMENT" });

// 如果state里面包含的数据量太多太冗杂，reducer业务逻辑就会掺杂在一起，可以尝试把reducer进行拆分
