import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getFinishedGood,
  getFinishedGoodBOM,
  getRegMaterial,
  getProductionSitesGraph,
  getRegionalizationGraph,
  getRegionalizationPer,
} from "./RegionalizationApi.js";

/*
addRegionSourceUnit() :this function is for adding regionSourceUnits to records and for calculation source to make reg % or each row.
addTotalColumnSum() : this function is used for  calucatiing total column sum.
totalSourceToMakeRegPer(): this function is used for  source to make reg % for diagoanal sum /totalResourceUnit
*/
const initialState = {
  regMaterial:{},
  regMaterialState: "idle",
  finishedGood:{},
  finishedGoodState: "idle",
  finishedGoodBOM: {},
  finishedGoodBOMState: "idle",
  productionSitesSource: {},
  productionSitesSale: {},
  productionSitesState: "idle",
  regionalizationMaterialGroup: {},
  regionalizationMaterialGroupState: "idle",
  regionalizationPsc: {},
  regionalizationPer: {
    makeIngredient: [],
    makeComponent: [],
    salesRegion: {
      all: [],
      fert: [],
      halb: []
    },
  },
  regionalizationPerState: "idle",
  loading: false,
  geoMapAPICalls: false,
  error: "",
};
export const fetchRegionalizationGraph = createAsyncThunk(
  "regionalization/fetchRegionalizationGraph",
  async (filterRequest) => {
    const response = await getRegionalizationGraph(filterRequest);
    return response.data;
  }
);
export const fetchProductionSitesGraph = createAsyncThunk(
  "regionalization/fetchProductionSitesGraph",
  async (filterRequest) => {
    const response = await getProductionSitesGraph(filterRequest);
    return response.data;
  }
);
export const fetchRegMaterial = createAsyncThunk(
  "regionalization/fetchRegMaterial",
  async (filterRequest) => {
    const response = await getRegMaterial(filterRequest);
    return response.data;
  }
);

export const fetchFinishedGood = createAsyncThunk(
  "regionalization/fetchFinishedGood",
  async (globalFilter) => {
    const response = await getFinishedGood(globalFilter);
    return response.data;
  }
);

export const fetchFinishedGoodBOM = createAsyncThunk(
  "regionalization/fetchFinishedGoodBOM",
  async (globalFilter) => {
    const response = await getFinishedGoodBOM(globalFilter);
    return response.data;
  }
);

export const fetchRegionalizationPer = createAsyncThunk(
  "regionalization/fetchRegionalizationPer",
  async (filterRequest) => {
    const response = await getRegionalizationPer(filterRequest);
    return response.data;
  }
);

const addRegionSourceUnit = (data) => {
  const calculatedData = data.map((item, index) => {
    const totalResourceUnit = item.americas + item.europe + item.asia;
    return {
      region: item.region,
      americas: item.americas,
      europe: item.europe,
      asia: item.asia,
      regionSourceUnits: totalResourceUnit,
      regPer:
        item.region === "Americas" && item.americas
          ? Math.round((item.americas / totalResourceUnit) * 100)
          : item.region === "Europe" && item.europe
            ? Math.round((item.europe / totalResourceUnit) * 100)
            : item.region === "Asia" && item.asia
              ? Math.round((item.asia / totalResourceUnit) * 100)
              : 0,
    };
  });
  return calculatedData;
};
const addTotalColumnSum = (data) => {
  let obj = {
    region: "R. Make Units",
    americas: 0,
    europe: 0,
    asia: 0,
    regionSourceUnits: 0,
    regPer: 0,
  };
  data.forEach((item) => {
    obj.americas = obj.americas + item.americas;
    obj.europe = obj.europe + item.europe;
    obj.asia = obj.asia + item.asia;
    obj.regionSourceUnits = obj.regionSourceUnits + item.regionSourceUnits;
  });
  return data && data?.length > 0 ? obj : {};
};

const totalSourceToMakeRegPer = (diagonalSum, totalResourceUnit) => {
  if (!diagonalSum && !totalResourceUnit) {
    return;
  }
  const totalSourceToMakeRegPer = (diagonalSum / totalResourceUnit) * 100;
  return Math.round(totalSourceToMakeRegPer);


};

const regionalizationSlice = createSlice({
  name: "regionalization",
  initialState: initialState,
  reducers: {
    setRegionlizationAPILoading: (state, action) => {
      let call = action.payload;
      if (call) {
        state.finishedGoodState = "idle";
        state.regMaterialState = "idle";
        state.productionSitesState = "idle";
        state.regionalizationPerState = "idle";
        state.regionalizationMaterialGroupState = "idle";
        state.finishedGoodState="idle";
        state.finishedGoodBOMState="idle"
        state.geoMapAPICalls = true;
      }
    },
    setLoadingState: (state, action) => {

      state.loading = false;
      state.geoMapAPICalls = false;
    }
  },
  extraReducers: {
    //fetchRegionalizationGraph
    [fetchRegionalizationGraph.pending]: (state, { payload }) => {
      state.loading = true;
      state.regionalizationMaterialGroupState = "pending"
    },
    [fetchRegionalizationGraph.fulfilled]: (state, action) => {
      let graphdata = action.payload.data;
      state.regionalizationMaterialGroup = graphdata.sourceToMake;
      state.regionalizationPsc = graphdata.makeToSale;
      state.regionalizationMaterialGroupState = "fulfilled";
    },
    [fetchRegionalizationGraph.rejected]: (state, { payload }) => {
      state.regionalizationMaterialGroupState = "rejected";
      state.error = state.action.error.message;
    },

    //fetchProductionSitesGraph
    [fetchProductionSitesGraph.pending]: (state, { payload }) => {
      state.loading = true;
      state.productionSitesState = "pending";

    },
    [fetchProductionSitesGraph.fulfilled]: (state, action) => {
      let graphData = action.payload;
      state.productionSitesSource = graphData.sourceToMake;
      state.productionSitesSale = graphData.makeToSale;
      state.productionSitesState = "fulfilled";
    },
    [fetchProductionSitesGraph.rejected]: (state, { payload }) => {
      state.productionSitesState = "rejected";
      state.error = state.action.error.message;
    },
    [fetchRegMaterial.pending]: (state, { payload }) => {
      state.regMaterialState = "pending"
      state.loading = true;
    },
    [fetchRegMaterial.fulfilled]: (state, action) => {
      state.regMaterial = action.payload;
      state.regMaterialState = "fulfilled";
    },
    [fetchRegMaterial.rejected]: (state, { payload }) => {
      state.regMaterialState = "rejected";
      state.error = state.action.error.message;
    },
    [fetchFinishedGood.pending]: (state, { payload }) => {
      state.loading = true;
      state.finishedGoodState = "pending";
    },
    [fetchFinishedGood.fulfilled]: (state, action) => {
      state.finishedGood = action.payload;
      state.finishedGoodState = "fulfilled";
    },
    [fetchFinishedGood.rejected]: (state, { payload }) => {
      state.finishedGoodState = "rejected";
      state.error = state.action.error.message;

    },
    [fetchFinishedGoodBOM.pending]: (state, { payload }) => {
      state.loading = true;
      state.finishedGoodBOMState = "pending";
    },
    [fetchFinishedGoodBOM.fulfilled]: (state, action) => {
      
      state.finishedGoodBOM = action.payload;
      state.finishedGoodBOMState = "fulfilled";
    },
    [fetchFinishedGoodBOM.rejected]: (state, { payload }) => {

   
      state.finishedGoodBOMState = "rejected";
      state.error = state.action.error.message;

    },
    [fetchRegionalizationPer.pending]: (state, { payload }) => {
      state.loading = true;
      state.regionalizationPerState = "pending";
    },
    [fetchRegionalizationPer.fulfilled]: (state, action) => {
      let makeIngridientArr = addRegionSourceUnit(action.payload.salesToMakeIng);
      let makeComponentArr = addRegionSourceUnit(action.payload.salesToMakeComp);
      let salesRegionArr = addRegionSourceUnit(
        action.payload.makeToSale["all"]
      );
      let salesRegionFert = addRegionSourceUnit(
        action.payload.makeToSale["fert"]
      );

      let salesRegionHalb = addRegionSourceUnit(
        action.payload.makeToSale["halb"]
      );
      let totalMakeIngColumnSum = addTotalColumnSum(makeIngridientArr);
      let totalMakeCompSum = addTotalColumnSum(makeComponentArr);
      let totalSalesColumnSum = addTotalColumnSum(salesRegionArr);
      let totalSalesfertColumnSum = addTotalColumnSum(salesRegionFert)
      let totalSalesHalbColumnSum = addTotalColumnSum(salesRegionHalb)
      const diagonalSumMakeIng =
        makeIngridientArr[0]?.americas +
        makeIngridientArr[1]?.europe +
        makeIngridientArr[2]?.asia;
      const diagonalSumMakeComp =
        makeComponentArr[0]?.americas +
        makeComponentArr[1]?.europe +
        makeComponentArr[2]?.asia;
      const diagonalSumSalesComp =
        salesRegionArr[0]?.americas +
        salesRegionArr[1]?.europe +
        salesRegionArr[2]?.asia;

      const diagonalSumFertComp = salesRegionFert[0]?.americas +
        salesRegionFert[1]?.europe +
        salesRegionFert[2]?.asia;
      const diagonalSumHalbComp = salesRegionHalb[0]?.americas +
        salesRegionHalb[1]?.europe +
        salesRegionHalb[2]?.asia;
      const totalResourceUnitMakeIng = totalMakeIngColumnSum.regionSourceUnits;
      const totalResourceUnitMakeComp = totalMakeCompSum.regionSourceUnits;
      const totalResourceSalesComp = totalSalesColumnSum.regionSourceUnits;
      const totalResourceFertComp = totalSalesfertColumnSum.regionSourceUnits;
      const totalResourceHalbComp = totalSalesHalbColumnSum.regionSourceUnits;

      totalMakeIngColumnSum.regPer = totalSourceToMakeRegPer(
        diagonalSumMakeIng,
        totalResourceUnitMakeIng
      );
      totalMakeCompSum.regPer = totalSourceToMakeRegPer(
        diagonalSumMakeComp,
        totalResourceUnitMakeComp
      );
      totalSalesColumnSum.regPer = totalSourceToMakeRegPer(
        diagonalSumSalesComp,
        totalResourceSalesComp
      );
      totalSalesfertColumnSum.regPer = totalSourceToMakeRegPer(
        diagonalSumFertComp,
        totalResourceFertComp
      );
      totalSalesHalbColumnSum.regPer = totalSourceToMakeRegPer(
        diagonalSumHalbComp,
        totalResourceHalbComp
      );


      makeIngridientArr = [...makeIngridientArr, totalMakeIngColumnSum];
      makeComponentArr = [...makeComponentArr, totalMakeCompSum];
      salesRegionArr = [...salesRegionArr, totalSalesColumnSum];
      salesRegionFert = [...salesRegionFert, totalSalesfertColumnSum];
      salesRegionHalb = [...salesRegionHalb, totalSalesHalbColumnSum]

      state.regionalizationPer.makeIngredient = makeIngridientArr;
      state.regionalizationPer.makeComponent = makeComponentArr;
      state.regionalizationPer.salesRegion.all = salesRegionArr;
      state.regionalizationPer.salesRegion.fert = salesRegionFert;
      state.regionalizationPer.salesRegion.halb = salesRegionHalb;
      state.regionalizationPerState = "fulfilled";

    },

    [fetchRegionalizationPer.rejected]: (state, { payload }) => {
      state.regionalizationPerState = "rejected";
      state.error = state.action.error.message;
    },
  },
});
export const { setRegionlizationAPILoading, setLoadingState } = regionalizationSlice.actions;
export default regionalizationSlice.reducer;
