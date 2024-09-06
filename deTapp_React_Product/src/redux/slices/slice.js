import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Define your initial state here
  useremail: "",
  loginDetails: {},
  menuDetails: [], // Ensure this is initialized to an appropriate type
};

const applicationSlice = createSlice({
  name: "applicationSlice",
  initialState,
  reducers: {
    // Define your reducers here
    storeLoginDetails: (state, action) => {
      
      state.useremail = action.payload.username;
      state.loginDetails = action.payload.userDetails;
    },
    storeMenuDetails: (state, action) => {
      state.menuDetails = action.payload;
      
    },
    // Reset action
    resetStore(state) {
      return initialState;
    },
    
  },
});

export const { storeLoginDetails, storeMenuDetails, resetStore } =
  applicationSlice.actions;
export default applicationSlice.reducer;
