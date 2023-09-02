import { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import "./LeadTimeCalFilter.scss";
const LeadTimeCalFilter = ({ selectedValue, toggleBtn }) => {
    const [activeBtn, setActiveBtn] = useState(selectedValue);
  
    const onToggleBtnChange = (event, btnValue) => {
      setActiveBtn(btnValue)
      toggleBtn(btnValue);
    };
    return <div className="leadtime-filter-container">
        <div className="filter-label">Leadtime Calculation :  </div>
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
        </div>
}

        export  default LeadTimeCalFilter;