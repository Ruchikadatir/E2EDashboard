import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getGraphDataGrid,
  getMaterialPosData,
  getMaterialGroupGraphData, getMaterialNameGraphData, getPMRGraphData, getSupplierMixGraphData
} from "./SourceApi.js";

//yoy formula
//yoy=((current yr vol - previous yr vol ) / previous yr vol)*100

const getYoyGrowthValue = (arr) => {
  const res = [];

  res.push(null);
  for (let i = 1; i < arr.length; i++) {
    res.push(
      parseFloat(
        (((arr[i] - (arr[i - 1] || 0)) / (arr[i - 1] || 0)) * 100).toFixed(1)
      )
    );
  }
  return res;
};

const mapPMRObj = (data) => {

  let yoyGrowthRevenue = getYoyGrowthValue(data["revenue"]);
  let yoyGrowthVolume = getYoyGrowthValue(data["volume"]);
  return {
    ...data,
    ...{ "YOY Growth Revenue": yoyGrowthRevenue },
    ...{ "YOY Growth Volume": yoyGrowthVolume },
  };
};
const initialState = {
  applyFilter: false,
  PMRGraphData: [],
  PMRGraphDataState: "idle",
  materialGroupGraphData: [],
  materialGroupGraphDataState: "idle",
  materialNameGraphData: [],
  materialNameGraphDataState: "idle",
  supplierMixGraphData: [],
  supplierMixGraphDataState: "idle",
  gridData: [],
  gridDataState: "idle",
  materialPOsData: [],
  materialPOsDataState: "idle",
  globalFilters: [],
  globalFilterRequestData: [],
  sourceData: [],
  error: "",
};

export const fetchMaterialGroupGraphData = createAsyncThunk(
  "source/fetchMaterialGroupGraphData",
  async (globalFilter) => {
    const response = getMaterialGroupGraphData(globalFilter);
    return response;
  }
);
export const fetchMaterialNameGraphData = createAsyncThunk(
  "source/fetchMaterialNameGraphData",
  async (globalFilter) => {
    const response = getMaterialNameGraphData(globalFilter);
    return response;
  }
);
export const fetchSupplierMixGraphData = createAsyncThunk(
  "source/fetchSupplierMixGraphData",
  async (globalFilter) => {
    const response = getSupplierMixGraphData(globalFilter);
    return response;
  }
);
export const fetchPMRGraphData = createAsyncThunk(
  "source/fetchPMRGraphData",
  async (globalFilter) => {
    const response = getPMRGraphData(globalFilter);
    return response;
  }
);

export const fetchGraphDataGridAsync = createAsyncThunk(
  "source/fetchGraphDataGridAsync",
  async (globalFilter) => {
    const response = await getGraphDataGrid(globalFilter);
    return response;
  }
);
export const fetchMaterialPOs = createAsyncThunk(
  "source/fetchMaterialPOs",
  async () => {
    const response = getMaterialPosData();
    return response;
  }
);
const sourceSlice = createSlice({
  name: "source",
  initialState,

  extraReducers: {


    //Grid/Graph data
    [fetchGraphDataGridAsync.pending]: (state, { payload }) => {
      state.gridDataState = "pending";
    },
    [fetchGraphDataGridAsync.fulfilled]: (state, action) => {
      state.gridData = action.payload.data.records;
      state.gridDataState = "fulfilled";
    },
    [fetchGraphDataGridAsync.rejected]: (state, action) => {
      state.gridDataState = "rejected";
      state.error = action.error.message;
    },

    //fetchMaterialPOs
    [fetchMaterialPOs.pending]: (state, { payload }) => {
      state.materialPOsDataState = "pending";
    },
    [fetchMaterialPOs.fulfilled]: (state, action) => {
      state.materialPOsData = action.payload.data.records;
      state.materialPOsDataState = "fulfilled";
    },
    [fetchMaterialPOs.rejected]: (state, action) => {
      state.materialPOsDataState = "rejected";
      state.error = action.error.message;
    },

    //fetchMaterialGroupGraphData
    [fetchMaterialGroupGraphData.pending]: (state, { payload }) => {
      state.materialGroupGraphDataState = "pending";
    },
    [fetchMaterialGroupGraphData.fulfilled]: (state, action) => {
      state.materialGroupGraphData = action.payload.data.materialGroup;
      state.materialGroupGraphDataState = "fulfilled";
    },
    [fetchMaterialGroupGraphData.rejected]: (state, action) => {
      state.materialGroupGraphDataState = "rejected";
      state.error = action.error.message;
    },

    //fetchMaterialNameGraphData
    [fetchMaterialNameGraphData.pending]: (state, { payload }) => {
      state.materialNameGraphDataState = "pending";

    },
    [fetchMaterialNameGraphData.fulfilled]: (state, action) => {
      state.materialNameGraphData = action.payload.data.materialName;
      state.materialNameGraphDataState = "fulfilled";
    },
    [fetchMaterialNameGraphData.rejected]: (state, action) => {
      state.materialNameGraphDataState = "rejected";
      state.error = action.error.message;
    },

    //fetchSupplierMixGraphData
    [fetchSupplierMixGraphData.pending]: (state, { payload }) => {
      state.supplierMixGraphDataState = "pending";
    },
    [fetchSupplierMixGraphData.fulfilled]: (state, action) => {
      state.supplierMixGraphData = action.payload.data.supplierMix;
      state.supplierMixGraphDataState = "fulfilled";
    },
    [fetchSupplierMixGraphData.rejected]: (state, action) => {
      state.supplierMixGraphDataState = "rejected";
      state.error = action.error.message;
    },

    //fetchPMRGraphData
    [fetchPMRGraphData.pending]: (state, { payload }) => {
      state.PMRGraphDataState = "pending";
    },
    [fetchPMRGraphData.fulfilled]: (state, action) => {
      state.PMRGraphData = mapPMRObj(action.payload.data.projectedMaterialReq.all);
      state.PMRGraphDataState = "fulfilled";
    },
    [fetchPMRGraphData.rejected]: (state, action) => {
      state.PMRGraphDataState = "rejected";
      state.error = action.error.message;
    },
  },
});


export default sourceSlice.reducer;
