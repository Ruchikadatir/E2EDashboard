import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getSourceGraphData,
  getMakeGraphData,
  getFulfillGraphData,
  getinventoryByNodeGraphData,
  getRevenueGrowthGraphData,
} from "./E2EApi.js";

const initialState = {
  gridData: [],
  loading: false,
  revenueGrowthGraphData: [],
  revenueGrowthGraphDataState: 'idle',
  sourceGraphData: [],
  sourceGraphDataState: 'idle',
  makeGraphData: [],
  makeGraphDataState: 'idle',
  fulfillGraphData: [],
  fulfillGraphDataState: 'idle',
  inventoryByNodeGraphData: [],
  inventoryByNodeGraphDataState: 'idle',
  error: "",
};

export const fetchSourceGraph = createAsyncThunk(
  "e2e/fetchSourceGraph",
  async (globalFilter) => {
    const response = await getSourceGraphData(globalFilter);
    return response.data;
  }
);
export const fetchMakeGraph = createAsyncThunk(
  "e2e/fetchMakeGraph",
  async (globalFilter) => {
    const response = await getMakeGraphData(globalFilter);
    return response.data;
  }
);
export const fetchFulfillGraph = createAsyncThunk(
  "e2e/fetchFulfillGraph",
  async (globalFilter) => {
    const response = await getFulfillGraphData(globalFilter);
    return response.data;
  }
);
export const fetchInventoryByNodeGraph = createAsyncThunk(
  "e2e/fetchInventoryByNodeGraph",
  async (globalFilter) => {
    const response = await getinventoryByNodeGraphData(globalFilter);
    return response.data;
  }
);
export const fetchRevenueGrowthGraph = createAsyncThunk(
  "e2e/fetchRevenueGrowthGraph",
  async (globalFilter) => {
    const response = await getRevenueGrowthGraphData(globalFilter);
    return response.data;
  }
);

const e2eSlice = createSlice({
  name: "e2e",
  initialState,
 
  extraReducers: {

    //fetchSourceGraph
    [fetchSourceGraph.pending]: (state, { payload }) => {
      state.sourceGraphDataState = 'pending';
    },
    [fetchSourceGraph.fulfilled]: (state, action) => {
      state.sourceGraphData = action.payload;
      state.sourceGraphDataState = 'fulfilled';
    },
    [fetchSourceGraph.rejected]: (state, action) => {
      state.sourceGraphDataState = 'rejected';
      state.error = action.error.message;
    },

    //fetchMakeGraph
    [fetchMakeGraph.pending]: (state, { payload }) => {
      state.makeGraphDataState = 'pending';
    },
    [fetchMakeGraph.fulfilled]: (state, action) => {
    state.makeGraphData=action.payload;      
    state.makeGraphDataState = 'fulfilled';
    },
    [fetchMakeGraph.rejected]: (state, action) => {
    state.makeGraphDataState = 'rejected';
      state.error = action.error.message;
    },

    //fetchFulfillGraph
    [fetchFulfillGraph.pending]: (state, { payload }) => {
      state.fulfillGraphDataState = 'pending';
    },
    [fetchFulfillGraph.fulfilled]: (state, action) => {
      state.fulfillGraphData = action.payload;
      state.fulfillGraphDataState = 'fulfilled';
    },
    [fetchFulfillGraph.rejected]: (state, action) => {
      state.fulfillGraphDataState = 'rejected';
      state.error = action.error.message;
    },

    //fetchInventoryByNodeGraph
    [fetchInventoryByNodeGraph.pending]: (state, { payload }) => {
      state.inventoryByNodeGraphDataState = 'pending';
    },
    [fetchInventoryByNodeGraph.fulfilled]: (state, action) => {
      state.inventoryByNodeGraphData =
        action.payload !== undefined &&
        action.payload !== null &&
        action.payload
          ? action.payload
          : [];
      state.inventoryByNodeGraphDataState = 'fulfilled';
    },
    [fetchInventoryByNodeGraph.rejected]: (state, action) => {
      state.error = action.error.message;
      state.inventoryByNodeGraphDataState = 'rejected';
    },

    //revenueGrowthGraph
    [fetchRevenueGrowthGraph.pending]: (state, { payload }) => {
      state.revenueGrowthGraphDataState = 'pending';
    },
    [fetchRevenueGrowthGraph.fulfilled]: (state, action) => {
      state.revenueGrowthGraphData = action.payload;
      state.revenueGrowthGraphDataState = 'fulfilled';
    },
    [fetchRevenueGrowthGraph.rejected]: (state, action) => {
      state.error = action.error.message;
      state.revenueGrowthGraphDataState = 'rejected';
    },
  },
});

export const { fetchRevenueGrowthRecords } = e2eSlice.actions;
export default e2eSlice.reducer;
