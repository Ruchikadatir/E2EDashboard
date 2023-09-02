import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllNodes } from "./NodeChartApi.js";
import { createSlice } from "@reduxjs/toolkit";

export const getAllNodesAndConnections = createAsyncThunk("nodeChart/getAllNodesAndConnections", async (globalFilter) => {
  const response = await getAllNodes(globalFilter);
  return response.data;
});

const nodeChartSlice = createSlice({
  name: "nodeChart",
  initialState: {
    nodes: [],
    level:[],
    nodesState: "idle",
    status: "idle",
    error: null,
    loading: false,
    isSuccess: false,
  },

  extraReducers: {
    //nodes
    [getAllNodesAndConnections.pending]: (state, { payload }) => {
      state.nodesState = 'pending';
    },
    [getAllNodesAndConnections.fulfilled]: (state, { payload }) => {
      state.nodes = payload;
     const level = []
     payload?.data.nodes?.forEach(item =>level.push(item.level) )
     state.level =level
      state.nodesState = 'fulfilled';
    },
    [getAllNodesAndConnections.rejected]: (state, { payload }) => {
      state.nodesState = 'rejected';
    }
  },
});

export const nodeSliceInfo = (state) => state.nodeChart.nodes || {};


export default nodeChartSlice.reducer;
