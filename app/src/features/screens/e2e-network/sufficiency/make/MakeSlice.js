import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMakeGraphData,
  getManlocGridData,
  getMixDonutChart,
  getHeatMapGridData,
  getProductionPOsGridData,
} from "./MakeApi.js";
const initialState = {
  gridData: [],
  loading: false,

  PPUnitCapacityGraphData: [],
  PPUnitCapacityGraphDataState: "idle",
  productionRequirementGraphData: [],
  productionRequirementGraphDataState: "idle",
  manlocGridData: [],
  manlocGridDataState: "idle",
  mixDonutChartData: [],
  mixDonutChartDataState: "idle",
  heatMap: {
    heatMapGridData: [],
    initialHeatMapData: [],
    heatMapLoading: false

  },
  heatMapState: "idle",

  productionPOsGridData: [],
  productionPOsGridDataState: "idle",
  error: "",
};
const mapDonutChartObj = (data) => {
  let obj = {};
  for (let key in data) {


    if (Array.isArray(data[key])) {
      const mapArray = data[key].map((item) => {
        return {
          name: item.category,
          value: item.quantity,
          quantityPercentage: Math.round(item.percentage)
        };
      });
      obj[key] = mapArray;
    }
  }

  return obj;
};


export const fetchMakeBarGraph = createAsyncThunk(
  "make/fetchMakeBarGraph",
  async (globalFilter) => {
    const response = await getMakeGraphData(globalFilter);
    return response.data;
  }
);


export const fetchManlocGrid = createAsyncThunk(
  "source/fetchManlocGrid",
  async (globalFilter) => {
    const response = await getManlocGridData(globalFilter);
    return response.data;
  }
);

export const fetchDonutChart = createAsyncThunk(
  "source/fetchDonutChart",
  async (globalFilter) => {
    const response = await getMixDonutChart(globalFilter);
    return response.data;
  }
);
export const fetchHeatMap = createAsyncThunk(
  "source/fetchHeatMap",
  async (globalFilter) => {
    const response = await getHeatMapGridData(globalFilter);
    return response.data;
  }
);
export const fetchProductionPOs = createAsyncThunk(
  "source/fetchProductionPOs",
  async () => {
    const response = await getProductionPOsGridData();
    return response.data;
  }
);
// recursiveFindById ,makeDataRecursive contains the expand and collapse logic for the grid.
let rowDataExpanded;
function findNestedObjById(obj, targetId) {
  if (obj.id === targetId) {
    return obj;
  }
  if (obj.child) {
    for (let item of obj.child) {
      let check = findNestedObjById(item, targetId);
      if (check) {
        return check;
      }
    }
  }
  return null;
}
const recursiveFindById = (arrayData, id) => {

  let result;
  for (let obj of arrayData) {
    result = findNestedObjById(obj, id);
    if (result) {
      break;
    }
  }

  return result;
};
const makeDataRecursive = (arrayData) => {

  arrayData.forEach((mainRow) => {
    rowDataExpanded.push(mainRow);
    if (mainRow.expanded) {
      makeDataRecursive(mainRow.child);
    }
  });
};
const makeSlice = createSlice({
  name: "make",
  initialState,
  reducers: {
    updateHeatMapGrid: (state, { payload }) => {

      const id = payload.id;
      let prevState = state.heatMap.initialHeatMapData;
      let foundData = recursiveFindById(prevState, id);

      if (foundData) {
        foundData.expanded = !foundData.expanded;
        rowDataExpanded = [];
        makeDataRecursive(prevState, id);
        state.heatMap.heatMapGridData = rowDataExpanded;
      }
    },
  },
  extraReducers: {

    //fetchProductionRequirementGraph
    [fetchMakeBarGraph.pending]: (state, { payload }) => {
      state.PPUnitCapacityGraphDataState = "pending";
      state.productionRequirementGraphDataState = "pending";
    },
    [fetchMakeBarGraph.fulfilled]: (state, action) => {
      state.PPUnitCapacityGraphData =
        action.payload &&
          action.payload !== undefined &&
          action.payload !== null
          ? action.payload.projectedProdUnitVsCapacity
          : [];

      state.productionRequirementGraphData =
        action.payload &&
          action.payload !== undefined &&
          action.payload !== null ? action.payload.manlocProdReq : [];
      state.PPUnitCapacityGraphDataState = "fulfilled";
      state.productionRequirementGraphDataState = "fulfilled";
    },
    [fetchMakeBarGraph.rejected]: (state, action) => {
      state.loading = false;
      state.PPUnitCapacityGraphDataState = "rejected";
      state.productionRequirementGraphDataState = "rejected";
      state.error = action.error.message;
    },

    //ManLoc Grid 
    [fetchManlocGrid.pending]: (state, { payload }) => {
      state.manlocGridDataState = "pending";
    },
    [fetchManlocGrid.fulfilled]: (state, action) => {
      state.manlocGridData =
        action.payload &&
          action.payload !== null &&
          action.payload !== undefined
          ? action.payload.records
          : [];
      state.manlocGridDataState = "fulfilled";
    },
    [fetchManlocGrid.rejected]: (state, action) => {
      state.manlocGridDataState = "rejected";
      state.error = action.error.message;
      state.manlocGridData = [];
    },

    //DonutChart
    [fetchDonutChart.pending]: (state, { payload }) => {
      state.mixDonutChartDataState = "pending";
    },
    [fetchDonutChart.fulfilled]: (state, action) => {
      state.mixDonutChartData =
        action.payload && action.payload !== undefined && action.payload != null
          ? mapDonutChartObj(action.payload)
          : [];
      state.mixDonutChartDataState = "fulfilled";
    },
    [fetchDonutChart.rejected]: (state, action) => {
      state.mixDonutChartDataState = "rejected";
      state.mixDonutChartData = [];
      state.error = action.error.message;
    },

    //HeatMap
    [fetchHeatMap.pending]: (state, { payload }) => {
      state.heatMapState = "pending";
    },
    [fetchHeatMap.fulfilled]: (state, action) => {
      state.heatMap.heatMapGridData = action.payload && action.payload != null && action.payload !== undefined ? action.payload : [];
      state.heatMap.initialHeatMapData = action.payload && action.payload != null && action.payload !== undefined ? action.payload : [];
      state.heatMapState = "fulfilled";
    },
    [fetchHeatMap.rejected]: (state, action) => {
      state.heatMapState = "rejected";
      state.error = action.error.message;
    },

    //ProductionPOs
    [fetchProductionPOs.pending]: (state, { payload }) => {
      state.productionPOsGridDataState = "pending";
    },
    [fetchProductionPOs.fulfilled]: (state, action) => {
      state.productionPOsGridData =
        action.payload &&
          action.payload !== null &&
          action.payload !== undefined
          ? action.payload.records
          : [];
      state.productionPOsGridDataState = "fulfilled";
    },
    [fetchProductionPOs.rejected]: (state, action) => {
      state.productionPOsGridDataState = "rejected";
      state.productionPOsGridData = [];
      state.error = action.error.message;
    },
  },
});

export const { updateHeatMapGrid } = makeSlice.actions;
export default makeSlice.reducer;
