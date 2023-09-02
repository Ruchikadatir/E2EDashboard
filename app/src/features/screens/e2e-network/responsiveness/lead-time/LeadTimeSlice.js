import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getLeadtimeBreakdownGraphData,
  getLeadTimeDistributioneGraphData,
  getPrioritySubcategoryGraphData,
  getSalesRegionGraphData,
  getDistributionByBrandGraphData,
  getFinishedGoodGrid,
  getSourceLeadTimeGrid
} from "./LeadTimeApi.js";

const initialState = {
  breakdownState: "idle",
  distributionState: "idle",
  priorityState: "idle",
  salesRegionState: "idle",
  distributionByBrandState: "idle",
  salesRegionGraphData: {},
  priorityGraphData: {},
  breakdownGraphData: {},
  distributionGraphData: {},
  finishedGoodGrid: [],
  finishedGoodGridState: "idle",
  sourceLeadtimeGrid: {},
  sourceLeadtimeState: "idle",
  error: "",
  isSuccess: false,
  loading: false,
};

export const fetchLeadtimeBreakdownGraphData = createAsyncThunk(
  "leadtime/fetchLeadtimeBreakdownGraphData",
  async (filterRequest) => {
    const response = await getLeadtimeBreakdownGraphData(filterRequest);
    return response.data;
  }
);
export const fetchLeadtimeDistributionGraphData = createAsyncThunk(
  "leadtime/fetchLeadtimeDistributionGraphData",
  async (filterRequest) => {
    const response = await getLeadTimeDistributioneGraphData(filterRequest);
    return response.data;
  }
);

export const fetchPrioritySubcategoryGraphData = createAsyncThunk(
  "leadtime/fetchPrioritySubcategoryGraphData",
  async (filterRequest) => {
    const response = await getPrioritySubcategoryGraphData(filterRequest);
    return response.data;
  }
);

export const fetchSalesRegionGraphData = createAsyncThunk(
  "leadtime/fetchSalesRegionGraphData",
  async (filterRequest) => {
    const response = await getSalesRegionGraphData(filterRequest);
    return response.data;
  }
);

export const fetchDistributionByBrandGraphData = createAsyncThunk(
  "leadtime/fetchDistributionByBrandGraphData",
  async (filterRequest) => {
    const response = await getDistributionByBrandGraphData(filterRequest);
    return response.data;
  }
);
export const fetchFinishedGood = createAsyncThunk(
  "leadtime/fetchFinishedGood",
  async (globalFilter) => {
    const response = await getFinishedGoodGrid(globalFilter);
    return response.data;
  }
);

export const fetchSourceLeadtime = createAsyncThunk(
  "leadtime/fetchSourceLeadtime",
  async (globalFilter) => {
    const response = await getSourceLeadTimeGrid(globalFilter);
    return response.data;
  }
);
const leadtimeSlice = createSlice({
  name: "leadtime",
  initialState: initialState,
  reducers: {
    setLeadTimeAPILoading: (state, action) => {
      let call = action.payload;
      if (call) {
        state.breakdownState = "idle";
        state.distributionState = "idle";
        state.priorityState = "idle";
        state.salesRegionState = "idle";
        state.distributionByBrandState = "idle";
        state.finishedGoodGridState = "idle";
        state.sourceLeadtimeState = "idle"
      }
    },
  },
  extraReducers: {
    //fetchLeadtimeBreakdownGraphData
    [fetchLeadtimeBreakdownGraphData.pending]: (state, { payload }) => {
      state.loading = true;
      state.breakdownState = "pending"
    },
    [fetchLeadtimeBreakdownGraphData.fulfilled]: (state, action) => {
      let graphData = action.payload;
      state.breakdownGraphData = graphData;
      state.breakdownState = "fulfilled"
      state.loading = false;
      state.isSuccess = true;
    },
    [fetchLeadtimeBreakdownGraphData.rejected]: (state, { payload }) => {
      state.isSuccess = false;
      state.breakdownState = "rejected"
    },
    //fetchLeadtimeDistributionGraphData
    [fetchLeadtimeDistributionGraphData.pending]: (state, { payload }) => {
      state.distributionState = "pending";
    },
    [fetchLeadtimeDistributionGraphData.fulfilled]: (state, { payload }) => {
      state.distributionState = "fulfilled";
      state.distributionGraphData = payload;
      state.isSuccess = true;
    },
    [fetchLeadtimeDistributionGraphData.rejected]: (state, { payload }) => {
      state.distributionState = "rejected";
      state.isSuccess = false;
    },

    //fetchPrioritySubcategoryGraphData
    [fetchPrioritySubcategoryGraphData.pending]: (state, { payload }) => {
      state.priorityState = "pending";
      state.loading = true;
    },
    [fetchPrioritySubcategoryGraphData.fulfilled]: (state, { payload }) => {
      state.priorityState = "fulfilled";
      state.priorityGraphData = payload;
      state.isSuccess = true;
    },
    [fetchPrioritySubcategoryGraphData.rejected]: (state, { payload }) => {
      state.priorityState = "rejected";
      state.isSuccess = false;
    },

    //fetchSalesRegionGraphData
    [fetchSalesRegionGraphData.pending]: (state, { payload }) => {
      state.salesRegionState = "pending";
    },
    [fetchSalesRegionGraphData.fulfilled]: (state, { payload }) => {
      state.salesRegionState = "fulfilled";
      state.salesRegionGraphData = payload;
      state.isSuccess = true;
    },
    [fetchSalesRegionGraphData.rejected]: (state, { payload }) => {
      state.salesRegionState = "rejected";
    },

    //fetchDistributionByBrandGraphData
    [fetchDistributionByBrandGraphData.pending]: (state, { payload }) => {
      state.distributionByBrandState = "pending";
    },
    [fetchDistributionByBrandGraphData.fulfilled]: (state, { payload }) => {
      state.distributionByBrandState = "fulfilled";
      state.distributionByBrandGraphData = payload;
      state.isSuccess = true;
    },
    [fetchDistributionByBrandGraphData.rejected]: (state, { payload }) => {
      state.distributionByBrandState = "rejected";
    },
    [fetchFinishedGood.pending]: (state, { payload }) => {
      state.finishedGoodGridState = "pending";
    },
    [fetchFinishedGood.fulfilled]: (state, action) => {
      state.finishedGoodGrid =
        action.payload

      state.finishedGoodGridState = "fulfilled";
    },
    [fetchFinishedGood.rejected]: (state, action) => {
      state.finishedGoodGridState = "rejected";
      state.finishedGoodGrid = [];
    },
    [fetchSourceLeadtime.pending]: (state, { payload }) => {
      state.sourceLeadtimeState = "pending";
    },
    [fetchSourceLeadtime.fulfilled]: (state, action) => {
      state.sourceLeadtimeGrid = action.payload?.records ? action.payload.records : []
      state.sourceLeadtimeState = "fulfilled";
    },
    [fetchSourceLeadtime.rejected]: (state, action) => {
      state.sourceLeadtimeState = "rejected";
      state.sourceLeadtimeGrid = [];
    },
  },
});

export const { setLeadTimeAPILoading } = leadtimeSlice.actions;
export default leadtimeSlice.reducer;
