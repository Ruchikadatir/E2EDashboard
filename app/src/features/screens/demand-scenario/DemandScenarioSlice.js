import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getGrowthRate,
  getStrategicDemandGraphData,
  getTopPrioritySubcat,
  getFamilyCodeUpsideDownside
} from "./DemandScenarioApi";

const initialState = {
  growthRateGrid: [],
  growthRateState: "idle",
  strategicDemandGraphData: [],
  strategicDemandDataState: "idle",
  topPrioritySubcatGrid: [],
  topPrioritySubcatState: "idle",
  familyCodeGrid:{},
  familyCodeState:"idle",
  error: "",
};
export const fetchStrategicDemandGraph = createAsyncThunk(
  "demandScenario/fetchStrategicDemandGraph",
  async (filterRequest) => {
    const response = await getStrategicDemandGraphData(filterRequest);
    return response.data;
  }
);

export const fetchGrowthRate = createAsyncThunk(
  "demandScenario/fetchGrowthRate",
  async (filterParams) => {
    const res = await getGrowthRate(filterParams)
    const newRes = res && res.data !== null ? formatGrowthRateRes(res.data) : []
    return newRes
      ;
  }
);

export const fetchTopPrioritySubcat = createAsyncThunk(
  "demandScenario/fetchTopPrioritySubcat",
  async (filterParams) => {
    const response = await getTopPrioritySubcat(filterParams);
    return response.data;
  }
);

export const fetchFamilyCodeUpsideDownside = createAsyncThunk(
  "demandScenario/fetchFamilyCodeUpsideDownside",
  async (filterParams) => {
    const response = await getFamilyCodeUpsideDownside(filterParams);
    return response.data;
  }
);
const formatGrowthRateRes = (growthRateArr) => {

  let newGrowthRateArr = growthRateArr
  for (let key in newGrowthRateArr) {
    const newArr = []
    newGrowthRateArr[key].forEach((item) => {
      newArr.unshift(item)
    })

    newGrowthRateArr[key] = [...newArr]
  }

  return newGrowthRateArr
}

const demandScenarioSlice = createSlice({
  name: "demandScenario",
  initialState,
  reducers: {

    setDemandScenarioAPILoading: (state, action) => {
      let call = action.payload;
      if (call) {
        state.growthRateState = "idle";
        state.topPrioritySubcatState = "idle";
        state.strategicDemandDataState = "idle";
        state.familyCodeState="idle";
      }
    },
  },
  extraReducers: {
    [fetchStrategicDemandGraph.pending]: (state, { payload }) => {
      state.strategicDemandDataState = "pending";
    },
    [fetchStrategicDemandGraph.fulfilled]: (state, { payload }) => {
      state.strategicDemandGraphData = payload;
      state.strategicDemandDataState = "fulfilled";
    },
    [fetchStrategicDemandGraph.rejected]: (state, action) => {
      state.strategicDemandDataState = "rejected";
      state.error = action.error.message;
    },
    [fetchGrowthRate.pending]: (state, { payload }) => {
      state.growthRateState = "pending";
    },
    [fetchGrowthRate.fulfilled]: (state, action) => {

      state.growthRateGrid =
        action.payload &&
          action.payload !== undefined &&
          action.payload !== null
          ? action.payload
          : [];
      state.growthRateState = "fulfilled";
    },
    [fetchGrowthRate.rejected]: (state, { payload }) => {
      state.growthRateState = "rejected";
    },
    [fetchTopPrioritySubcat.pending]: (state, { payload }) => {
      state.topPrioritySubcatState = "pending";
    },
    [fetchTopPrioritySubcat.fulfilled]: (state, action) => {
      state.topPrioritySubcatGrid =
        action.payload &&
          action.payload !== undefined &&
          action.payload !== null
          ? action.payload
          : [];
      state.topPrioritySubcatState = "fulfilled";
    },
    [fetchTopPrioritySubcat.rejected]: (state, { payload }) => {
      state.topPrioritySubcatState = "rejected";
    },

    [fetchFamilyCodeUpsideDownside.pending]: (state, { payload }) => {
      state.familyCodeState = "pending";
    },
    [fetchFamilyCodeUpsideDownside.fulfilled]: (state, action) => {
      state.familyCodeGrid =
        action.payload &&
          action.payload !== undefined &&
          action.payload !== null
          ? action.payload
          : [];
      state.familyCodeState = "fulfilled";
    },
    [fetchFamilyCodeUpsideDownside.rejected]: (state, { payload }) => {
      state.familyCodeState = "rejected";
    },
  },
});
export const {setDemandScenarioAPILoading } = demandScenarioSlice.actions;

export default demandScenarioSlice.reducer;
