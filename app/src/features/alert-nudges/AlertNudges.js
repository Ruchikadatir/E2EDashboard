import { Modal } from "antd";
import React, { useState, useEffect } from "react";
import {numberConversion} from "../app-utils/AppUtils"
import { useSelector } from "react-redux";
import "./AlertNudges.scss"

const AlertNudges = ({ isModalVisible, onModalCLose, demandScenarioToggle }) => {
   
    const activeTab = useSelector(state => state.e2eNav.sufficiencyResActiveTab)
    const { source, make, leadtime, regionalization, demandScenario } = useSelector(state => state.alertNudges)
   

    const renderContent = () => {
        switch (activeTab) {

            case "e2e_tab":

                return <div className="e2e-nudeges nudges-container"><div className="nudges-label"> 2 Alerts in Sufficiency Source</div>
                    <div className="nudges-label"> 2 Alerts in Sufficiency Make</div>
                </div >

            case "source_tab":

                return <div className="nudges-container"><div className="nudges-label">Top 1 Ingredient  <span className="text-bold">{source?.length > 0 ?  source[0].Material:""} - {source?.length >0 ? source[0]['Material_Description'] : ""}</span> with high growth (CAGR % - <span className="text-bold">{source?.length > 0 ? Math.round(source[0]?.CAGR) : ""}%</span>)</div>
                    <div className="nudges-label">Top 2 Ingredient  <span className="text-bold">{source?.length > 0 ?  source[1].Material:""} - {source?.length >0 ? source[1]['Material_Description'] : ""}</span> with high growth (CAGR % - <span className="text-bold">{source?.length > 0 ? Math.round(source[1]?.CAGR) : ""}%</span>)</div>
                </div >

            case "make_tab":
                return <div className="nudges-container"><div className="nudges-label"><span className="make-nudge">Top 1 Technology :</span> <span className="text-bold">{make?.length > 0 ? make[0].Technology : ""} - {make?.length > 0 ? Math.round(make[0]?.unitlizationPercentage) : ""}%</span> utilization%  in <span className="text-bold">{make?.length > 0 ? make[0]['plant_name'] : ""}</span> plant for <span className="text-bold">FY24</span></div>
                    <div className="nudges-label"><span className="make-nudge">Top 2 Technology :</span> <span className="text-bold">{make?.length > 0 ? make[1].Technology : ""} - {make?.length > 0 ? Math.round(make[1]?.unitlizationPercentage) : ""}%</span> utilization%  in <span className="text-bold">{make?.length > 0 ? make[1]['plant_name'] : ""}</span> plant for <span className="text-bold">FY24</span></div>
                </div >
            case "leadTime_tab":
                return <div className="nudges-container"><div className="nudges-label">Top 1 SKU <span className="text-bold">{leadtime?.length > 0 ? leadtime[0].MATNR : ""} - {leadtime?.length > 0 ? leadtime[0]['ITEM_DESCRIPTION'] : ""}</span> with <span className="text-bold">${leadtime?.length > 0 ? numberConversion(leadtime[0]['TOTAL_REVENUE']): ""}</span> revenue and <span className="text-bold">{leadtime?.length > 0 ? leadtime[0]['E2E_REV_DAYS'] : ""}</span> days leadtime  ({">"}90 Percentile) for <span className="text-bold">FY23</span></div>
                    <div className="nudges-label">Top 2 SKU <span className="text-bold">{leadtime?.length > 0 ? leadtime[1].MATNR : ""} - {leadtime?.length > 0 ? leadtime[1]['ITEM_DESCRIPTION'] : ""} </span> with <span className="text-bold">${leadtime?.length > 0 ? numberConversion(leadtime[1]['TOTAL_REVENUE']): ""}</span> revenue and <span className="text-bold">{leadtime?.length > 0 ? leadtime[1]['E2E_REV_DAYS'] : ""}</span> days leadtime  ({">"}90 Percentile) for <span className="text-bold">FY23</span></div>
                </div >
            case "regionalization_tab":
                return <div className="nudges-container"><div className="nudges-label">Top 1 SubProduct line <span className="text-bold">{regionalization?.length > 0 ? regionalization[0].Sub_Product_line : ""}</span> ( Regionalization%  - <span className="text-bold">{regionalization?.length > 0 ? Math.round(regionalization[0]['Reg_%']) : ""}%</span>) with <span className="text-bold">${regionalization?.length > 0 ? numberConversion(regionalization[0]['Revenue']) : ""}</span> revenue for <span className="text-bold">FY23</span></div>
                    <div className="nudges-label">Top 2 SubProduct line <span className="text-bold">{regionalization?.length > 0 ? regionalization[1].Sub_Product_line : ""}</span> ( Regionalization% - <span className="text-bold">{regionalization?.length > 0 ? Math.round(regionalization[1]['Reg_%']) : ""}%</span>) with <span className="text-bold">${regionalization?.length > 0 ? numberConversion(regionalization[1]['Revenue']) : ""}</span> revenue but least regionalized % for <span className="text-bold">FY23</span></div>
                </div >;
            case "demand_scenario":
                return <div className="nudges-container">
                   <div className="nudges-label">Top 1 Product line <span className="text-bold">{demandScenario[demandScenarioToggle]?.length > 0 ? demandScenario[demandScenarioToggle][0]['product_line'] : ""}</span> with (<span className="text-bold">{demandScenario[demandScenarioToggle]?.length > 0 ? Math.round(demandScenario[demandScenarioToggle][0]['YOY%']) : ""}%</span> {demandScenarioToggle ==="units" ? "Volume":"Revenue"} YoY Growth%) <span className="text-bold">FY22-23</span></div>
                   <div className="nudges-label">Top 2 Product line <span className="text-bold">{demandScenario[demandScenarioToggle]?.length > 0 ? demandScenario[demandScenarioToggle][1]['product_line'] : ""}</span> with (<span className="text-bold">{demandScenario[demandScenarioToggle]?.length > 0 ? Math.round(demandScenario[demandScenarioToggle][1]['YOY%']) : ""}%</span> {demandScenarioToggle ==="units" ? "Volume":"Revenue"} YoY Growth%) <span className="text-bold">FY22-23</span></div>
                </div >;



        }
    }

    return <Modal
        id="nudges-modal"
        className="data-modal"
        width={600}
        style={{ top: 135, left: 580 }}
        open={isModalVisible}
        closable={false}
        mask={false}
        footer={null}

        onCancel={() => onModalCLose()}
    >

        {renderContent()}

    </Modal >
}
export default AlertNudges;