import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGlobalFilters, getSourceChartFilters, getMakeChartFilters } from "./FilterApi";
import { globalFilter, globalFilterType, makeChartFilter, sourceChartFilter, sourceFilterType, makeFilterType } from "../../variables";

const initialState = {
  globalFilterLoading: false,
  globalFilterAPIResponse: [],
  globalFilterInitialAPIResponse: [],
  sourceChartFilterLoaded: false,
  makeChartFilterLoaded: false,
  sourceChartFilterRefresh: false,
  makeChartFilterRefresh: false,
  sourceChartFilterGlobalApply: false,
  sourceChartFilterResponse: [],
  sourceChartFilterInitialAPIResponse: [],
  makeChartFilterResponse: [],
  selectedSourceChartFilters: sourceChartFilter,
  selectedMakeChartFilters: makeChartFilter,
  selectedSufficiencyGlobalFilters: globalFilter,
  selectedDemandScenarioGlobalFilters: globalFilter,
  selectedResponsivenessGlobalFilters: globalFilter,
  selectedGrowthCalYearFilter: "FY25",
  selectedGrowthCalQuarterFilter: '',
  sendAPICall: false,
  e2eAPICall: false,
  sourceAPICall: false,
  makeAPICall: false,
  fulFillAPICall: false,
  demandScenarioAPICall: false,
  growthCalFiltersAPICall: false,
  error: "",
  sourceChartIndexOf: 100,
  makeChartIndexOf: 100,
  globalFilterIndexOf: 100,
  globalFilterPreviousState: {},
  sourceChartFilterPreviousState: {},
  makeChartFilterPreviousState: {},
};
export const fetchGlobalFilterRequest = createAsyncThunk(
  "filter/fetchGlobalFilterRequest",
  async (globalFilter) => {
    const response = await getGlobalFilters(globalFilter);
    return response.data;
  }
);
export const fetchMakeChartFilterRequest = createAsyncThunk(
  "filter/fetchMakeChartFilterRequest",
  async (BarChartFilter) => {
    const response = await getMakeChartFilters({ "globalFilter": BarChartFilter.globalFilter, "makeChartFilter": BarChartFilter.makeChartFilter });
    return response.data;
  }
);
export const fetchSourceChartFilterRequest = createAsyncThunk(
  "filter/fetchSourceChartFilterRequest",
  async (BarChartFilter) => {
    const response = await getSourceChartFilters({ "globalFilter": BarChartFilter.globalFilter, "sourceChartFilter": BarChartFilter.sourceChartFilter });
    return response.data;
  }
);
export const fetchSourceChartInitialFilterRequest = createAsyncThunk(
  "filter/fetchSourceChartInitialFilterRequest",
  async (BarChartFilter) => {

    const response = await getSourceChartFilters({ "globalFilter": BarChartFilter.globalFilter, "sourceChartFilter": BarChartFilter.sourceChartFilter });
    return response.data;
  }
);
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    globalFilterResponse: (state, action) => {
      state.sendAPICall = true;
      var location = action.payload.location;
      if (location.includes("sufficiency")) {
        state.selectedSufficiencyGlobalFilters = action.payload.result;
        state.makeAPICall = true;
        state.fulFillAPICall = true;
        state.sourceAPICall = true;
        state.e2eAPICall = true;
        state.sourceChartFilterGlobalApply = true;
        state.selectedSourceChartFilters = sourceChartFilter;
      }
      if (location.includes("demand-scenario")) {

        state.selectedDemandScenarioGlobalFilters = action.payload.result;
        state.demandScenarioAPICall = true;
      }
      if (location.includes("responsiveness")) {
        state.selectedResponsivenessGlobalFilters = action.payload.result;
      }

    },
    setGrowthCalYearFilterResponse: (state, action) => {
      state.selectedGrowthCalYearFilter = action.payload;
      state.growthCalFiltersYearAPICall = true;
    },
    setGrowthCalQuarterFilterResponse: (state, action) => {
      state.selectedGrowthCalQuarterFilter = action.payload;
      state.growthCalFiltersQuarterAPICall = true;
    },
    setDropDownReponse: (state, action) => {
      state.globalFilterAPIResponse = action.payload;
    },
    setChartFilterDropDownResponse: (state, action) => {
      let type = action.payload.chartFilterType;
      if (type === "source") {
        state.selectedSourceChartFilters = action.payload.filterResponse;
        state.sourceChartFilterRefresh = true;
      }
      else {
        state.selectedMakeChartFilters = action.payload.filterResponse;
        state.makeChartFilterRefresh = true;
      }

    },
    setDropDownReponse: (state, action) => {
      state.globalFilterAPIResponse = action.payload;

    },
    setChartFilterDropDownResponse: (state, action) => {
      let type = action.payload.chartFilterType;
      if (type === "source") {
        state.selectedSourceChartFilters = action.payload.filterResponse;
        state.sourceChartFilterRefresh = action.payload.setResponse;
      }
      else {
        state.selectedMakeChartFilters = action.payload.filterResponse;
        state.makeChartFilterRefresh = action.payload.setResponse;
      }

    },
    setChartFilterRefreshState: (state, action) => {
      let type = action.payload;
      if (type === "source")
        state.sourceChartFilterRefresh = false;
      else
        state.makeChartFilterRefresh = false;

    },
    setAPICall: (state, action) => {
      let type = action.payload;

      if (type === "barChartFilter-Source")
        state.sourceChartFilterGlobalApply = false;
      if (type === "Filters")
        state.sendAPICall = false;
      if (type === "source")
        state.sourceAPICall = false;
      if (type === "make")
        state.makeAPICall = false;
      if (type === "fulfill")
        state.fulFillAPICall = false;
      if (type === "e2e")
        state.e2eAPICall = false;
      if (type === "demand-scenario")
        state.demandScenarioAPICall = false;
      if (type === "growthCal") {
        state.growthCalFiltersYearAPICall = false;
        state.growthCalFiltersQuarterAPICall = false;
      }
    },
  },
  extraReducers: {
    //fetchGlobalFilterRequest
    [fetchGlobalFilterRequest.pending]: (state, { payload }) => {
      state.globalFilterLoading = false;
    },
    [fetchGlobalFilterRequest.fulfilled]: (state, action) => {
      let selected_index = action.meta.arg["index_of"] === 0 ? action.meta.arg["index_of"] : action.meta.arg["index_of"] - 1
      let result = {};
      let previous_result = {}
      let response = action.payload;
      if (!Object.keys(action.meta.arg).find((i) => i === "Priority Subcategory") && !Object.keys(action.meta.arg).find((i) => i === "Major Category") && selected_index === 0) {
        state.globalFilterPreviousState = action.payload
        state.globalFilterAPIResponse = action.payload
      }
      if (state.globalFilterIndexOf === 0 && selected_index === 0) {
        Object.entries(globalFilterType).forEach(([key, value], index) => {
          if (index === selected_index && index === 0) {
            result[key] = state.globalFilterPreviousState[key]
            previous_result[key] = state.globalFilterPreviousState[key]
          }
          else {
            result[key] = response[key]
            previous_result[key] = response[key]
          }

        });
        state.globalFilterAPIResponse = result !== undefined ? result : [];
        state.globalFilterPreviousState = previous_result !== undefined ? previous_result : [];
      }
      else {
        if (state.globalFilterIndexOf === 100) {
          state.globalFilterAPIResponse = response !== undefined ? response : [];
          state.globalFilterPreviousState = response !== undefined ? response : [];
        }
        if (selected_index < state.globalFilterIndexOf && state.globalFilterIndexOf !== 100) {
          Object.entries(globalFilterType).forEach(([key, value], index) => {
            if (index <= selected_index) {
              result[key] = state.globalFilterPreviousState[key]
              previous_result[key] = state.globalFilterPreviousState[key]
            }
            else {
              result[key] = response[key]
              previous_result[key] = response[key]
            }

          });
          state.globalFilterAPIResponse = result !== undefined ? result : [];
          state.globalFilterPreviousState = previous_result !== undefined ? previous_result : [];

        }
        if (selected_index => state.globalFilterIndexOf) {
          Object.entries(globalFilterType).forEach(([key, value], index) => {
            if (index > selected_index) {
              result[key] = response[key]
              previous_result[key] = response[key]
            }

            else {

              result[key] = state.globalFilterPreviousState[key]
              previous_result[key] = state.globalFilterPreviousState[key]

            }

          });
          state.globalFilterAPIResponse = result !== undefined ? result : [];
          state.globalFilterPreviousState = previous_result !== undefined ? previous_result : [];

        }

        state.globalFilterIndexOf = selected_index
      }
      state.globalFilterLoading = true;
    },
    [fetchGlobalFilterRequest.rejected]: (state, action) => {
      state.globalFilterLoading = false;
      state.error = action.error.message;
    },
    //fetchMakeChartFilterRequest
    [fetchMakeChartFilterRequest.pending]: (state, { payload }) => {
      state.makeChartFilterLoaded = false;
    },
    [fetchMakeChartFilterRequest.fulfilled]: (state, action) => {
      let selected_index = action.meta.arg.makeChartFilter.index_of - 1;
      let result = {};
      let previous_result = {}
      let response = action.payload
      if (state.makeChartIndexOf === 100) {
        state.makeChartFilterResponse = response !== undefined ? response : [];
        state.makeChartFilterPreviousState = response !== undefined ? response : [];
      }
      if (selected_index < state.makeChartIndexOf && state.makeChartIndexOf !== 100) {
        Object.entries(makeFilterType).forEach(([key, value], index) => {
          if (index <= selected_index) {
            result[key] = state.makeChartFilterPreviousState[key]
            previous_result[key] = state.makeChartFilterPreviousState[key]
          }
          else {
            result[key] = response[key]
            previous_result[key] = response[key]
          }

        });
        state.makeChartFilterResponse = result !== undefined ? result : [];
        state.makeChartFilterPreviousState = previous_result !== undefined ? previous_result : [];

      }
      if (selected_index => state.makeChartIndexOf) {
        Object.entries(makeFilterType).forEach(([key, value], index) => {
          if (index > selected_index) {
            result[key] = response[key]
            previous_result[key] = response[key]
          }

          else {

            result[key] = state.makeChartFilterPreviousState[key]
            previous_result[key] = state.makeChartFilterPreviousState[key]

          }

        });
        state.makeChartFilterResponse = result !== undefined ? result : [];
        state.makeChartFilterPreviousState = previous_result !== undefined ? previous_result : [];

      }
      state.makeChartFilterLoaded = true;
      state.makeChartIndexOf = selected_index;
    },
    [fetchMakeChartFilterRequest.rejected]: (state, action) => {
      state.makeChartFilterLoaded = false;
      state.error = action.error.message;
    },
    //fetchSourceChartFilterRequest
    [fetchSourceChartFilterRequest.pending]: (state, { payload }) => {
      state.sourceChartFilterLoaded = false;
    },
    [fetchSourceChartFilterRequest.fulfilled]: (state, action) => {

      let selected_index = action.meta.arg.sourceChartFilter.index_of - 1;
      let result = {};
      let previous_result = {}
      let response = action.payload
      if (state.sourceChartIndexOf === 100) {
        state.sourceChartFilterResponse = response !== undefined ? response : [];
        state.sourceChartFilterPreviousState = response !== undefined ? response : [];
      }
      if (selected_index < state.sourceChartIndexOf && state.sourceChartIndexOf !== 100) {
        Object.entries(sourceFilterType).forEach(([key, value], index) => {
          if (index <= selected_index) {
            result[key] = state.sourceChartFilterPreviousState[key]
            previous_result[key] = state.sourceChartFilterPreviousState[key]
          }
          else {
            result[key] = response[key]
            previous_result[key] = response[key]
          }

        });
        state.sourceChartFilterResponse = result !== undefined ? result : [];
        state.sourceChartFilterPreviousState = previous_result !== undefined ? previous_result : [];

      }
      if (selected_index => state.sourceChartIndexOf) {
        Object.entries(sourceFilterType).forEach(([key, value], index) => {
          if (index > selected_index) {
            result[key] = response[key]
            previous_result[key] = response[key]
          }

          else {

            result[key] = state.sourceChartFilterPreviousState[key]
            previous_result[key] = state.sourceChartFilterPreviousState[key]

          }

        });
        state.sourceChartFilterResponse = result !== undefined ? result : [];
        state.sourceChartFilterPreviousState = previous_result !== undefined ? previous_result : [];

      }
      state.sourceChartFilterLoaded = true;
      state.sourceChartIndexOf = selected_index

    },
    [fetchSourceChartFilterRequest.rejected]: (state, action) => {
      state.sourceChartFilterLoaded = false;
      state.error = action.error.message;
    },

  },
});
export const { globalFilterResponse, setAPICall, setDropDownReponse, setChartFilterDropDownResponse, setChartFilterRefreshState, setGrowthCalYearFilterResponse, setGrowthCalQuarterFilterResponse } = filterSlice.actions;

export default filterSlice.reducer;