import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import "./RegSubFilter.scss";
import SubFilterDropdown from "./SubFilterDropdown.json";
import { Select } from "antd";



const RegSubFilter = (props) => {

  const [activeBtn, setActiveBtn] = useState(props.defaultSelectedValue);


  const onToggleBtnChange = (event, btnValue) => {
    setActiveBtn(btnValue);
    props.toggleBtn(btnValue);
    props.handleSubChartFilterDropdownValue(btnValue === "make-to-sale" ? "all":"ingredients")
  };

  const handleChange = (value) => {
    props.handleSubChartFilterDropdownValue(value)

  };
  return (
    <div className="sub-filter-container">
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
          <ToggleButton value="source-to-make">Source to Make</ToggleButton>
          <ToggleButton value="make-to-sale">Make to Sale</ToggleButton>
        </ToggleButtonGroup>
      </div>


      {activeBtn === "source-to-make" &&
        <div className="dropdown-container">
          <div className="reg-dropdown-container">Material Type</div>
          <Select
            defaultValue="Ingredients"
            style={{ width: 140 }}
            onChange={handleChange}
            options={SubFilterDropdown.materialType}
          />
        </div>}
      {activeBtn === "make-to-sale" &&
        <div className="dropdown-container">
          <div className="reg-dropdown-container">Product Type</div>
          <Select
            defaultValue="All"
            style={{ width: 130 }}
            onChange={handleChange}
            options={SubFilterDropdown.productType}

          />
        </div>
      }
    </div>
  );
};

export default RegSubFilter;
