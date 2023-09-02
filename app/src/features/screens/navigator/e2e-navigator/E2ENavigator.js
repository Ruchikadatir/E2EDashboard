import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tabchanges } from "../E2ENavSlice";
import { Tabs } from "antd";
import AlertIcon from "../../../custom-icon/AlertIcon";
import { useLocation } from "react-router-dom";
import EllipseIcon from '../../../custom-icon/EllipseIcon'
import "./E2ENavigator.scss";
import { Outlet, useNavigate } from "react-router-dom";
import AlertNudges from "../../../alert-nudges/AlertNudges";

const default_active_tab = "sufficiency";

const tab_items = [
  { label: "Synchronize", key: "synchronize", disabled: true },
  { label: "Sufficiency", key: "sufficiency" },
  { label: "Responsiveness", key: "responsiveness" },
  { label: "Portfolio", key: "portfolio", disabled: true },
];

const E2ENavigator = (props) => {
  const { pathname } = useLocation();
  const [activeTab, getActiveTab] = useState(default_active_tab);
  const sufficiencyResActiveTab = useSelector(state => state.e2eNav.sufficiencyResActiveTab)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (pathname === "/e2e-network" || pathname === "/e2e-network/sufficiency")
      navigate(`${activeTab}`);
    if (pathname === "/e2e-network" || pathname === "/e2e-network/responsiveness")
      navigate(`${activeTab}`);
    dispatch(tabchanges(activeTab));
  }, [activeTab, navigate, pathname]);

  const onTabChange = (key) => {
    getActiveTab(`${key}`);
  };
  const showNudges = () => {
    setIsModalVisible(true)
  }
  const onModalCLose = () => {

    setIsModalVisible(false)
  }
  return (
    <>
      <div className="secondary-header">
        <div className="card-container">
          {(pathname === "/e2e-network/sufficiency" ||
            pathname === "/e2e-network/responsiveness") && (
              <Tabs
                className="header-tabs"
                defaultActiveKey={default_active_tab}
                items={tab_items}
                onChange={onTabChange}
                type="card"
              />
            )}
        </div>
        {sufficiencyResActiveTab !== "fulfill_tab" && <div className="img-conatainer" onClick={showNudges}>
          <AlertIcon />
          <EllipseIcon className="ellipse" />
          <div className="alert-text">Alerts / Nudges</div>
        </div>}
      </div>
      {<Outlet />}
      <AlertNudges isModalVisible={isModalVisible} onModalCLose={onModalCLose} demandScenarioToggle={props.activeBtn} />
    </>
  );
};

export default E2ENavigator;


