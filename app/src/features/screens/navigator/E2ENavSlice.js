import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTabs: "",
  sufficiencyResActiveTab :"e2e_tab"
};

export const e2eNavSlice = createSlice({
  name: "e2eNav",
  initialState,
  reducers: {
    tabchanges: (state, action) => {
      state.activeTabs = action.payload;
    },
    updateSufficiencyResActiveTab:(state,action)=>{
      state.sufficiencyResActiveTab = action.payload;
    }
  },
});

export const { tabchanges ,updateSufficiencyResActiveTab} = e2eNavSlice.actions;
export default e2eNavSlice.reducer;
