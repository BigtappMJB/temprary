import { ACTION_TYPE } from "../actions/actions";

const initialState = {
  data: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
