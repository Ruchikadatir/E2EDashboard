import React, { useEffect } from "react";
import "./App.scss";
import HeaderComp from "./features/header/HeaderComp.js";
import E2ENavigator from "./features/screens/navigator/e2e-navigator/E2ENavigator.js";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./features/screens/landing-page/LandingPage.js";
import SufficiencyNav from "./features/screens/navigator/sufficiency-nav/SufficiencyNav";
import "../src/features/style/variable.scss";
import { fetchGlobalFilterRequest } from "./features/filter/FilterSlice";
import { useDispatch,useSelector } from "react-redux";
import DemandScenario from "./features/screens/demand-scenario/DemandScenario";
import { useLocation } from "react-router-dom";
import { fetchSufficiencyNudges,fetchResponsivenessNudges,fetchDemandScenarioNudges } from "./features/alert-nudges/AlerNudgesSlice";
import {fetchNodeChartFilterDropdownOptions} from "./features/filter/node-chart-filter/NodeChartFilterSlice"
function App() {
  const { pathname } = useLocation();
  const dispatch =useDispatch()
  useEffect(()=>{
    dispatch(fetchSufficiencyNudges())
    dispatch(fetchResponsivenessNudges())
    dispatch(fetchDemandScenarioNudges())
    dispatch(fetchNodeChartFilterDropdownOptions())
  }
  ,[])
  return (
    <div className="App">
      <HeaderComp />
      <Routes>
        <Route path="/home" element={<LandingPage />} />
        <Route path="/e2e-network" element={<E2ENavigator />}>
          {pathname === "/e2e-network/sufficiency" && (
            <Route path="sufficiency" element={<SufficiencyNav />} />
          )}
          {pathname === "/e2e-network/responsiveness" && (
            <Route path="responsiveness" element={<SufficiencyNav />} />
          )}
        </Route>
        <Route path="/demand-scenario" element={<DemandScenario />} />
      </Routes>
    </div>
  );
}

export default App;
