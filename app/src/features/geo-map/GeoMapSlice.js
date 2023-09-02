import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllConnections, getAllNodes, getFulfillTooltip, getMakeTooltip, getSourceTooltip } from "./GeoMapAPI.js";
import { createSlice } from "@reduxjs/toolkit";

export const getE2eNodes = createAsyncThunk("geoMap/getE2eNodes", async (globalFilter) => {
  const response = await getAllNodes(globalFilter);
  return response.data;
});

export const getE2eConnections = createAsyncThunk(
  "geoMap/getE2eConnections",
  async (globalFilter) => {
    const response = await getAllConnections(globalFilter);
    return response.data;
  }
);
export const fetchSourceTooltip = createAsyncThunk(
  "source/fetchSourceTooltip",
  async (globalFilter) => {
    const response = getSourceTooltip(globalFilter);
    return response;
  }
);

export const fetchMakeTooltip = createAsyncThunk(
  "make/fetchMakeTooltip",
  async (globalFilter) => {
    const response = getMakeTooltip(globalFilter);
    return response;
  }
);

export const fetchFulfillTooltip = createAsyncThunk(
  "fulfill/fetchFulfillTooltip",
  async (globalFilter) => {
    const response = getFulfillTooltip(globalFilter);
    return response;
  }
);

const geoMapSlice = createSlice({
  name: "geoMap",

  initialState: {

    nodes: [],
    nodesState: "idle",
    connections: [],
    connectionsState: "idle",
    sourceTooltipData: [],
    sourceTooltipDataState: "idle",
    makeTooltipData: [],
    makeTooltipDataState: "idle",
    fulfillTooltipData: [],
    fulfillTooltipDataState: "idle",

    status: "idle",
    error: null,
    loading: false,
    isSuccess: false,
  },

  extraReducers: {

    //nodes
    [getE2eNodes.pending]: (state, { payload }) => {
      state.nodesState =  'pending';
    },
    [getE2eNodes.fulfilled]: (state, { payload }) => {
      state.nodes = payload;
      state.nodesState = 'fulfilled';
    },
    [getE2eNodes.rejected]: (state, { payload }) => {
      state.nodesState = 'rejected';
    },

    //connections
    [getE2eConnections.pending]: (state, { payload }) => {
      state.connectionsState = 'pending';
    },
    [getE2eConnections.fulfilled]: (state, { payload }) => {
      state.connections = payload;
      state.connectionsState = 'fulfilled';
    },
    [getE2eConnections.rejected]: (state, { payload }) => {
      state.connectionsState = 'rejected';
    },

    //SourceTooltip
    [fetchSourceTooltip.pending]: (state, { payload }) => {
      state.sourceTooltipDataState = 'pending';
    },
    [fetchSourceTooltip.fulfilled]: (state, action) => {
      state.sourceTooltipData = action.payload;
      state.sourceTooltipDataState = 'fulfilled';
    },
    [fetchSourceTooltip.rejected]: (state, action) => {
      state.sourceTooltipDataState = 'rejected';
      state.error = action.error.message;
    },

    //MakeTooltip
    [fetchMakeTooltip.pending]: (state, { payload }) => {
      state.makeTooltipDataState = 'pending';
    },
    [fetchMakeTooltip.fulfilled]: (state, action) => {
      state.makeTooltipData = action.payload;
      state.makeTooltipDataState = 'fulfilled';
    },
    [fetchMakeTooltip.rejected]: (state, action) => {
      state.makeTooltipDataState = 'rejected';
      state.error = action.error.message;
    },

    //FulfillTooltip
    [fetchFulfillTooltip.pending]: (state, { payload }) => {
      state.fulfillTooltipDataState = 'pending';
    },
    [fetchFulfillTooltip.fulfilled]: (state, action) => {
      state.fulfillTooltipData = action.payload;
      state.fulfillTooltipDataState = 'fulfilled';
    },
    [fetchFulfillTooltip.rejected]: (state, action) => {
      state.fulfillTooltipDataState = 'rejected';
      state.error = action.error.message;
    },
  },
});

export const nodeSliceInfo = (state) => state.geoMap.nodes.data || {};
export const linkSliceInfo = (state) => state.geoMap.connections.data || [];

export default geoMapSlice.reducer;
