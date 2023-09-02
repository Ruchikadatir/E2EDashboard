import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRSRGGraphData } from "./FulfillApi.js";
const initialState = {
  loading: false,
  SRGraphData: [],
  error: "",
};

export const fetchRSRGraphData = createAsyncThunk(
  "fulfill/fetchRSRGraphData",
  async (globalFilterRequestData) => {
    const response = await getRSRGGraphData(globalFilterRequestData);
    return response.data;
  }
);
const fulfillSlice = createSlice({
  name: "fulfill",
  initialState,
  extraReducers: {
    //fetchRSRGraphData
    [fetchRSRGraphData.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [fetchRSRGraphData.fulfilled]: (state, action) => {
      state.SRGraphData =
        action.payload && action.payload !== undefined ? action.payload : [];
      state.loading = false;
    },
    [fetchRSRGraphData.rejected]: (state, action) => {
      state.loading = true;
      state.error = action.error.message;
    },
  },
});

export default fulfillSlice.reducer;
