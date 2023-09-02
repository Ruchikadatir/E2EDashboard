import { configureStore } from "@reduxjs/toolkit";
import E2ENavReducer from "../features/screens/navigator/E2ENavSlice.js";
import SourceReducer from "../features/screens/e2e-network/sufficiency/source/SourceSlice";
import MakeReducer from "../features/screens/e2e-network/sufficiency/make/MakeSlice";
import FulFillReducer from "../features/screens/e2e-network/sufficiency/fulfill/FulfillSlice";
import E2EReducer from "../features/screens/e2e-network/sufficiency/e2e-view/E2ESlice";
import LeadtimeReducer from "../features/screens/e2e-network/responsiveness/lead-time/LeadTimeSlice";
import GeoMapReducer from "../features/geo-map/GeoMapSlice";
import NodeChartReducer from "../features/node-chart/NodeChartSlice"
import RegionalizationReducer from "../features/screens/e2e-network/responsiveness/regionalization/RegionalizationSlice.js";
import E2ECardSliceReducer from "../features/e2e-card/E2ECardSlice.js";
import FilterReducer from "../features/filter/FilterSlice.js";
import DemandScenarioReducer from "../features/screens/demand-scenario/DemandScenarioSlice.js";
import AlertNudgesReducer from "../features/alert-nudges/AlerNudgesSlice.js";
import NodeChartFilterReducer from "../features/filter/node-chart-filter/NodeChartFilterSlice.js";
export const store = configureStore({
  reducer: {
    e2eNav: E2ENavReducer,
    geoMap: GeoMapReducer,
    source: SourceReducer,
    nodeChart: NodeChartReducer,
    make: MakeReducer,
    fulfill: FulFillReducer,
    e2e: E2EReducer,
    leadtime: LeadtimeReducer,
    regionalization: RegionalizationReducer,
    e2eCard: E2ECardSliceReducer,
    filter: FilterReducer,
    demandScenario: DemandScenarioReducer,
    alertNudges: AlertNudgesReducer,
    nodeChartFilter: NodeChartFilterReducer
  },
});

export default store;
