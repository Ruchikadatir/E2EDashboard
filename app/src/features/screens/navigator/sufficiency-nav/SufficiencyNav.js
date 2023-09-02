import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import "./SufficiencyNav.scss";
import E2EView from "../../e2e-network/sufficiency/e2e-view/E2EView.js";
import E2EIcon from "../../../custom-icon/E2EIcon";
import SourceIcon from "../../../custom-icon/SourceIcon";
import MakeIcon from "../../../custom-icon/MakeIcon";
import FulFillIcon from "../../../custom-icon/FulfillIcon";
import SourceSufficiency from "../../e2e-network/sufficiency/source/SourceSufficiency.js";
import MakeSufficiency from "../../e2e-network/sufficiency/make/MakeSufficiency.js";
import FulfillSufficiency from "../../e2e-network/sufficiency/fulfill/FulfillSufficiency.js";
import LeadTime from "../../e2e-network/responsiveness/lead-time/LeadTime.js";
import Regionalization from "../../e2e-network/responsiveness/regionalization/Regionalization.js";
import { fetchSourceChartFilterRequest, fetchMakeChartFilterRequest } from "../../../filter/FilterSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateSufficiencyResActiveTab } from "../E2ENavSlice";

const SufficiencyNav = () => {
  const tabName = useSelector((state) => state.e2eNav.activeTabs);
  const selectedSufficiencyGlobalFilters = useSelector((state) => state.filter.selectedSufficiencyGlobalFilters);
  const selectedSourceChartFilters = useSelector((state) => state.filter.selectedSourceChartFilters);
  const selectedMakeChartFilters = useSelector((state) => state.filter.selectedMakeChartFilters);

  const sufficiencyDefaultActiveTab = "e2e_tab";
  const resDefaultActiveTab = "leatTime_tab";

  const [activeTab, setActiveTab] = useState(sufficiencyDefaultActiveTab);
  const [resActiveTab, setResActiveTab] = useState(resDefaultActiveTab);

  const tabOnChange = (key) => {
    setActiveTab(key);
    dispatch(updateSufficiencyResActiveTab(key))
  };
  const resTabOnChange = (key) => {
    setResActiveTab(key);
    dispatch(updateSufficiencyResActiveTab(key))
  };
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      dispatch(fetchSourceChartFilterRequest({ "globalFilter": selectedSufficiencyGlobalFilters, "sourceChartFilter": selectedSourceChartFilters }));
      dispatch(fetchMakeChartFilterRequest({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": { index_of: 0 } }));
    } catch (rejectedValueOrSerializedError) {
      console.log(
        "Failed to Global Page APIs: Detail",
        rejectedValueOrSerializedError
      );
    } finally {
    }

  }, []);
  useEffect(() => {
    if (tabName === "sufficiency") {
      setActiveTab("e2e_tab");
      dispatch(updateSufficiencyResActiveTab("e2e_tab"))
    }
    else if (tabName === "responsiveness") {
      setResActiveTab("leadTime_tab");
      dispatch(updateSufficiencyResActiveTab("leadTime_tab"))
    }
  }, [tabName]);

  const sufficiencyTabItems = [
    {
      label: (
        <span className="icon-pos">
          <E2EIcon
            fillActive={activeTab === "e2e_tab" ? "#09208C" : " #6d707e"}
          />
          &nbsp;&nbsp;E2E
        </span>
      ),
      key: "e2e_tab",
      disabled: false,
    },
    {
      label: (
        <span>
          <SourceIcon
            fillActive={activeTab === "source_tab" ? "#09208C" : " #6d707e"}
          />
          &nbsp;&nbsp;Source
        </span>
      ),
      key: "source_tab",
    },
    {
      label: (
        <span>
          <MakeIcon
            fillActive={activeTab === "make_tab" ? "#09208C" : " #6d707e"}
          />
          &nbsp;&nbsp;Make
        </span>
      ),
      key: "make_tab",
    },
    {
      label: (
        <span>
          <FulFillIcon
            fillActive={activeTab === "fulfill_tab" ? "#09208C" : " #6d707e"}
          />
          &nbsp;&nbsp;Fulfill
        </span>
      ),
      key: "fulfill_tab",
    },
  ];
  const responsivenessTabItems = [
    {
      label: <span className="icon-pos">Lead Time</span>,
      key: "leadTime_tab",
    },
    {
      label: <span>Regionalization</span>,
      key: "regionalization_tab",
    },
  ];
  // rendering screen based on active Tab selection
  const renderSufficiencyTabsScreen = () => {
    switch (activeTab) {
      case "e2e_tab":
        return <E2EView />;

      case "source_tab":
        return <SourceSufficiency />;

      case "make_tab":
        return <MakeSufficiency />;

      case "fulfill_tab":
        return <FulfillSufficiency />;

      default:
        return <SourceSufficiency />;
    }
  };
  const renderResponsivenessTabsScreen = () => {
    switch (resActiveTab) {
      case "leadTime_tab":
        return <LeadTime />;

      case "regionalization_tab":
        return <Regionalization />;

      default:
        return <LeadTime />;
    }
  };


  return (
    <>
      <div className="sufficiency-responsiveness-container">
        {tabName === "sufficiency" && (
          <Tabs
            id="sufficiency-tabs"
            defaultActiveKey={sufficiencyDefaultActiveTab}
            onChange={tabOnChange}
            items={sufficiencyTabItems}
          ></Tabs>
        )}

        {tabName === "responsiveness" && (
          <Tabs
            id="responsiveness-tabs"
            defaultActiveKey={resDefaultActiveTab}
            onChange={resTabOnChange}
            items={responsivenessTabItems}
          ></Tabs>
        )}
      </div>

      {tabName === "sufficiency"
        && renderSufficiencyTabsScreen()}
      {tabName === "responsiveness" && renderResponsivenessTabsScreen()}
    </>
  );
};
export default SufficiencyNav;
