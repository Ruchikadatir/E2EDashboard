import { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SubFilterData from "./SubFilterData.json"

import { Select } from "antd";
import { setGrowthCalYearFilterResponse, setGrowthCalQuarterFilterResponse } from "../FilterSlice";
import { useSelector, useDispatch } from "react-redux";
import "./GrowthCalFilter.scss";
// update the subFilterData.json file for the fiscal year change 
const GrowthCalFilter = ({ selectedValue, toggleBtn }) => {
  const dispatch = useDispatch();
  const selectedGrowthCalYearFilter = useSelector((state) => state.filter.selectedGrowthCalYearFilter);
  const selectedGrowthCalQuarterFilter = useSelector((state) => state.filter.selectedGrowthCalQuarterFilter);
  const [activeBtn, setActiveBtn] = useState(selectedValue);

  const onToggleBtnChange = (event, btnValue) => {
    setActiveBtn(btnValue)
    toggleBtn(btnValue);
  };

  const [YearResponse, setYearResponse] = useState(selectedGrowthCalYearFilter);
  const [QuarterResponse, setQuarterResponse] = useState(selectedGrowthCalQuarterFilter)
  const onYearChange = (value) => {
    if (selectedValue.length > 0) {
      setYearResponse(value);

    }
  };

  const onQuarterChange = (value) => {
    if (selectedValue.length > 0) {
      setQuarterResponse(value)
    }
  };

  useEffect(() => {
    dispatch(setGrowthCalYearFilterResponse(YearResponse))
  }, [YearResponse]);

  useEffect(() => {
    dispatch(setGrowthCalQuarterFilterResponse(QuarterResponse))
  }, [QuarterResponse])

  return (
    <div className="demand-sub-filter-container">
      <div className="filter-label">Growth Calculation : </div>
      <div className="toggle-btn-switch">
        <ToggleButtonGroup
          size="small"
          className="toggle-btn-grp"
          orientation="horizontal"
          color="primary"
          value={activeBtn}
          onChange={onToggleBtnChange}
          exclusive
        >
          <ToggleButton value="units">Units M</ToggleButton>
          <ToggleButton value="revenue">$</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="dropdown-container">
        <div className="add-margin"></div>
        <div className="title-margin filterTitle">Year :</div>
      
        <Select
          defaultValue="FY25" // here you can update the defualt FY value
          style={{ width: 120 }}
          onChange={onYearChange}
          options={SubFilterData.year}
        />



        <div className="add-margin"></div>
        <div className="title-margin filterTitle">Quarter :</div>
        <Select
          defaultValue="All"
          style={{ width: 120 }}
          onChange={onQuarterChange}
          options={SubFilterData.quarter}

        />
      </div>

    </div>

  );
};

export default GrowthCalFilter;
