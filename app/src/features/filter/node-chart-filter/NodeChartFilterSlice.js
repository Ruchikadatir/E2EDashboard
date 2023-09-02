import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNodeChartFilterDropdownOptions } from "./NodeChartFilterApi.js";

const initialState = {
  itemCodes: [],
  itemDescs: [],
  nodeChartFilterState: "idle"
}

export const fetchNodeChartFilterDropdownOptions = createAsyncThunk(
  "nodeChartFilter/fetchNodeChartFilterDropdownOptions",
  async (filterRequest) => {
    const response = await getNodeChartFilterDropdownOptions(filterRequest);
    return response.data;
  }
);


const nodeChartFilterSlice = createSlice({
  name: "nodeChartFilter",
  initialState: initialState,
  extraReducers: {

    [fetchNodeChartFilterDropdownOptions.pending]: (state, { payload }) => {

      state.nodeChartFilterState = "pending"
    },
    [fetchNodeChartFilterDropdownOptions.fulfilled]: (state, action) => {
      state.itemCodes = action.payload?.materialCode;
      state.itemDescs = action.payload?.materialDesc;
      state.nodeChartFilterState = "fulfilled";
    },
    [fetchNodeChartFilterDropdownOptions.rejected]: (state, { payload }) => {
      state.nodeChartFilterState = "rejected";
    },
  },
});

export default nodeChartFilterSlice.reducer;
