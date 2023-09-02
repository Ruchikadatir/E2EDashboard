import { Select } from "antd";
import React, { useEffect, useState } from "react";
import ClickAwayListener from '@mui/material/ClickAwayListener';

import "./DropDownFilter.scss";
const DropDownFilter = (props) => {
  const { Option } = Select;
  const filterData = props.values;
  const [sendValues, setSendValues] = useState(false);
  const [selectedItems, setSelectedItems] = useState(props.presetValue ? props.presetValue : []);
  const [selectedValue, setSelectedValue] = useState(props.presetValue ? props.presetValue : "");
  const handleSelectedItem = (value) => {
    if (value && value.length && value.includes("All"))
      setSelectedItems(filterData);
    else setSelectedItems(value);
  };
  const handleSingleSelectedItem = (value) => {
    setSelectedValue(value);
  };

  const handleClickAway = () => {
    if (selectedValue.length > 0 || Object.keys(selectedItems).length > 0) {
      console.log("clicked here");
      setSendValues(true);
    }
  }

  useEffect(() => {
    if (props.onClear) {
      setSelectedItems([]);
      setSelectedValue("");
    }
    props.handleSingleSelectedFilter(selectedValue, props.name);
  }, [selectedItems, selectedValue, props.onClear]);
  return (
    <div className="dropdown-container">

      {props.filterDataType === "single" && filterData.length > 0 && (
        <Select
          showSearch
          key={props.name}
          value={selectedValue}
          onChange={handleSingleSelectedItem}
          style={{
            width: "150px",
            height: "30px",
          }}
        >
          {filterData.map((item) => (
            <Option key={"id1" + item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      )}
      {props.filterDataType === "multiple" && filterData.length > 0 && (
        <Select
          key={props.name}
          mode="multiple"
          allowClear={true}
          placeholder={props.placeholder ? props.placeholder : ""}
          value={selectedItems}
          showArrow={true}
          maxTagCount={2}
          maxTagTextLength={3}
          onChange={handleSelectedItem}

          style={{
            width: "150px",
            height: "30px",
          }}
        >
          {filterData.length > 0 && (
            <Select.Option key="All" value="All">
              Select All
            </Select.Option>
          )}

          {filterData.map((item) => (
            <Select.Option key={"id2" + item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default DropDownFilter;
