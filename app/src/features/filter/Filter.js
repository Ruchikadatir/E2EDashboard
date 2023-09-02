import { Modal, Button } from "antd";
import React, { useState, useEffect } from "react";
import "./Filter.scss";
import FilterIcon from "../custom-icon/FilterIcon.js";
import { Input, Space } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { Row, Col, Divider } from "antd";
import DropDownFilter from "./DropDownFilter.js";
import { fetchGlobalFilterRequest, globalFilterResponse, setDropDownReponse, setAPICall } from "./FilterSlice";
import { setLeadTimeAPILoading } from "../screens/e2e-network/responsiveness/lead-time/LeadTimeSlice";
import { setRegionlizationAPILoading } from "../screens/e2e-network/responsiveness/regionalization/RegionalizationSlice"
import { setDemandScenarioAPILoading } from "../screens/demand-scenario/DemandScenarioSlice";
import { globalFilterType } from "../../variables";
import CustomCalendar from "./custom-calendar/CustomCalendar.js";
import { useSelector, useDispatch } from "react-redux";
import FilterChip from "./filter-chip/FilterChip";
import Grid from "@mui/material/Grid";
import { Select } from "antd";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from "react-router-dom";



const Filter = ({ enable }) => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const location = useLocation().pathname;
  const selectedSufficiencyGlobalFilters = useSelector(
    (state) => state.filter.selectedSufficiencyGlobalFilters
  );
  const sendAPICall = useSelector((state) => state.filter.sendAPICall);
  const selectedDemandScenarioGlobalFilters = useSelector((state) => state.filter.selectedDemandScenarioGlobalFilters);
  const selectedResponsivenessGlobalFilters = useSelector((state) => state.filter.selectedResponsivenessGlobalFilters);
  const globalFilters = useSelector((state) => state.filter.globalFilterAPIResponse)
  const activeTabs = useSelector((state) => state.e2eNav.activeTabs);
  const globalFilterLoading = useSelector((state) => state.filter.globalFilterLoading)
  const globalFilterInitialAPIResponse = useSelector((state) => state.filter.globalFilterInitialAPIResponse)
  var selectedGlobalFilters = selectedSufficiencyGlobalFilters;
  const [isModalVisible, setIsModalVisible] = useState(false);
  //Update here for the default here 
  const [timePeriod, setTimePeriod] = useState({ 'yearValue': '2023', 'quarterValue': null });
  const [sendData, setSendData] = useState(false);
  const [filterResponse, setFilterResponse] = useState({});
  const [selectedFilters, setSelectedFilters] = useState(selectedGlobalFilters)
  const [sendAPIRequest, setSendAPIRequest] = useState(false);
  const [dropDownData, setDropDownData] = useState({})
  const [previouseSelected, setPreviousSelected] = useState({})
  const [index_of, setIndexOf] = useState(4);
  const [onClear, setOnClear] = useState(false);


  function SelectDropdown(props) {
    const data = props.values


    let filterData = data?.filter(value => value !== null)
    const handleSelectedItem = (value) => {
      setFilterResponse((prevState) => ({
        ...prevState,
        [props.name]: filterData,
      }));
      if (value && value.length && value.includes("All")) {

        setSelectedFilters((prevState) => ({
          ...prevState,
          [props.name]: filterData,
          index_of: Object.keys(globalFilterType).indexOf(props.name) + 1,
        }));
      }
      else if (value.length === 0) {
        if (Object.keys(globalFilterType).indexOf(props.name) === 0)
          setSelectedFilters({ "index_of": 0 });
        else
          setSelectedFilters((prevState) => ({
            ...prevState,
            [props.name]: null,
            index_of: (index_of === 0) ? 0 : Object.keys(globalFilterType).indexOf(props.name) + 1,
          }));
      }
      else {
        setSelectedFilters((prevState) => ({
          ...prevState,
          [props.name]: value,
          index_of: Object.keys(globalFilterType).indexOf(props.name) + 1,
        }));
      }
      setSendAPIRequest(true)
    };
    const handleSingleSelectedItem = (value) => {
      if (value?.length === 0 || value === undefined) {
        setSelectedFilters((prevState) => ({
          ...prevState,
          [props.name]: null,
          index_of: (index_of === 0) ? 0 : Object.keys(globalFilterType).indexOf(props.name) + 1,
        }));
      }
      else {
        setSelectedFilters((prevState) => ({
          ...prevState,
          [props.name]: value,
          index_of: Object.keys(globalFilterType).indexOf(props.name) + 1,
        }));
      }

      setSendAPIRequest(true)

    }

    return (

      <div className="dropdown-container">
        <div key={"id12" + props.name}>
          {props.filterDataType === "single" && (
            <Select
              allowClear
              showSearch
              showArrow={false}
              defaultValue={selectedFilters[props.name] ? selectedFilters[props.name] : ""}
              disabled={!globalFilterLoading}
              key={props.name}
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              value={selectedFilters[props.name] !== null ? selectedFilters[props.name] : []}
              onChange={handleSingleSelectedItem}
              style={{
                width: "180px",
                height: "30px",
              }}
            >
              {filterData?.map((item) => (

                <Option key={"id15" + item} value={item} label={item}>
                  {item}
                </Option>
              ))}
            </Select>
          )}
          {props.filterDataType === "multiple" && (
            <Select
              defaultValue={selectedFilters[props.name] !== null ? selectedFilters[props.name] : []}
              disabled={!globalFilterLoading}
              key={props.name}
              mode="multiple"
              allowClear
              value={selectedFilters[props.name] !== null ? selectedFilters[props.name] : []}
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase({ sensitivity: 'base' }))}
              maxTagCount={1}
              onChange={handleSelectedItem}

              style={{
                width: "180px",
                height: "30px",
              }}
            >
              {filterData?.length > 0 && (
                <Select.Option key="All" value="All">
                  Select All
                </Select.Option>
              )}

              {filterData?.map((item) => (
                <Select.Option key={"id30" + item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}

            </Select>
          )}
        </div>
      </div>

    )
  }

  useEffect(() => {
    if (location.includes("demand-scenario")) {
      selectedGlobalFilters = selectedDemandScenarioGlobalFilters;
      setSelectedFilters(selectedGlobalFilters);
    }
    if (location.includes("responsiveness")) {

      selectedGlobalFilters = selectedResponsivenessGlobalFilters;

      setSelectedFilters(selectedGlobalFilters);
    }
    if (location.includes("sufficiency")) {
      selectedGlobalFilters = selectedSufficiencyGlobalFilters;
      setSelectedFilters(selectedGlobalFilters);
    }
  }, [location, activeTabs]);

  useEffect(() => {

    if (sendAPIRequest) {

      let request = {};
      if (selectedFilters["index_of"] < index_of && index_of != 0) {
        Object.entries(globalFilterType).forEach(([key, value], index) => {

          if (index + 1 <= selectedFilters["index_of"] && selectedFilters[key] != null) {
            request[key] = selectedFilters[key]
          }
        });
        request["index_of"] = selectedFilters["index_of"];
      }
      else {
        Object.entries(globalFilterType).forEach(([key, value], index) => {
          if (selectedFilters[key] != null) {
            request[key] = selectedFilters[key]
          }
        });
        request["index_of"] = selectedFilters["index_of"];
      }
      if (Object.keys(request).length === 1) {
        if (Object.keys(request)[0] === "index_of")
          request["index_of"] = 0;
      }

      setIndexOf(request["index_of"])
      dispatch(fetchGlobalFilterRequest(request))
      request["year"] = selectedFilters.year ? selectedFilters.year : timePeriod.yearValue;
      request["quarter"] = selectedFilters.quarter ? selectedFilters.quarter : timePeriod.quarterValue;
      setSelectedFilters(request)
    }
    setSendAPIRequest(false)
  }, [sendAPIRequest, selectedFilters]);

  useEffect(() => {
    if (globalFilterLoading)
      setDropDownData(globalFilters);

  }, [globalFilterLoading, globalFilters])
  useEffect(() => {
    if (sendData) {
      let result = {}

      if (index_of === 0)
        result = { "index_of": 0, "year": '2023', 'quarter': null }; // update here for fiscal year
      else
        result = { ...selectedFilters };
      result["year"] = selectedFilters.year ? selectedFilters.year : timePeriod.yearValue;
      result["quarter"] = selectedFilters.quarter ? selectedFilters.quarter : timePeriod.quarterValue;
      dispatch(globalFilterResponse({ location, activeTabs, result }));
      dispatch(setLeadTimeAPILoading(true));
      dispatch(setDemandScenarioAPILoading(true));
      dispatch(setRegionlizationAPILoading(true));
      dispatch(setDropDownReponse({ ...dropDownData }));
      setSelectedFilters(result);
      setIsModalVisible(false)
      setSendData(false);

    }

  }, [sendData, index_of]);



  const showFilterModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleResponseTimePeriodSet = (value) => {
    setTimePeriod(value);

    setSelectedFilters((prevState) => ({
      ...prevState,
      year: value.yearValue,
      quarter: value.quarterValue === "All" ? "" : value.quarterValue,
    }));
  };
  const onClickClearAll = (event) => {
    setIndexOf(0);
    setSendAPIRequest(true);
    //update here for the default year
    setTimePeriod({ "yearValue": '2023', "quarterValue": null }) // update here for  default fiscal year 
    setSelectedFilters({ "index_of": 0, "year": '2023', 'quarter': null }); // update here for the default fiscal year
    
  };
  const onClickApplyFilters = (event) => {

    setSendData(true);
  };

  return (
    <>
      <Row gutter={[16, 16]}>

        <Col span={2} >
          <div className="filter-btn">
            <Button
              loading={!globalFilterLoading}

              type="primary"
              size="large"
              className="custom-button filter-button"
              icon={<FilterIcon />}
              onClick={showFilterModal}
            >
              Filter
            </Button>
          </div>
        </Col>
        <Col span={22} >
          {Object.keys(selectedFilters)?.length > 0 && (
            <FilterChip location={location} />
          )}

        </Col>
      </Row>
      <Modal
        id="common-filter"
        className="data-filter"
        width={1000}
        open={isModalVisible}
        closable={false}
        mask={false}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            disabled={!globalFilterLoading}
            type="text"
            key="1"
            className="clear-btn"
            icon={
              <ClearOutlined style={{ fontSize: "1rem", color: "#09208c" }} />
            }
            onClick={onClickClearAll}
          >
            Clear All
          </Button>,
          <Button
            disabled={!globalFilterLoading || !enable}
            key="2"
            className=" apply-filter-button custom-button"
            type="primary"
            onClick={onClickApplyFilters}
          >
            Apply Filter
          </Button>,
        ]}
      >
        <div>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!globalFilterLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

        </div>
        <div>
          {!location.includes("demand-scenario") &&
            (<><Row>
              <span className="text-size"> Time Period</span>
            </Row> <Row gutter={[8, 28]}>
                <CustomCalendar filterResponse={selectedFilters}
                  responseTimePeriodSet={handleResponseTimePeriodSet} />
              </Row></>)
          }
          <Row>
            <span className="text-size">Category Segment</span>
          </Row>
          <Row gutter={[8, 28]}>
            {globalFilterLoading && (
              <>
                {Object.keys(globalFilterType)
                  .slice(0, 6)
                  .map((name) => (

                    <Col flex="auto">
                      <div key={"id10" + name} className="filterTitle">{name}</div>
                      <SelectDropdown
                        key={name}
                        name={name}
                        filterDataType={globalFilterType[name]}
                        values={dropDownData[name]}
                      />
                    </Col>
                  ))}
              </>
            )}

          </Row>

          <Row>
            <span className="text-size">Product Attributes</span>
          </Row>
          <Row gutter={[8, 28]}>
            {Object.keys(globalFilterType)
              .slice(6, 16)
              .map((name) => (
                <Col sm={6}>
                  <div key={"id10" + name} className="filterTitle">{name}</div>
                  <SelectDropdown
                    key={name}
                    name={name}

                    filterDataType={globalFilterType[name]}
                    values={dropDownData[name]}
                  />
                </Col>
              ))}
          </Row>

          <Row>
            <span className="text-size">Inventory</span>
          </Row>
          <Row gutter={[8, 28]}>
            {Object.keys(globalFilterType)
              .slice(16, 20)
              .map((name) => (
                <Col sm={6}>
                  <div key={"id10" + name} className="filterTitle">{name}</div>
                  <SelectDropdown
                    key={name}
                    name={name}
                    filterDataType={globalFilterType[name]}
                    values={dropDownData[name]}
                  />
                </Col>
              ))}
          </Row>

          <Row>
            {" "}
            <span className="text-size">Demand Attributes</span>
          </Row>

          <Row gutter={[0, 0]}>
            {Object.keys(globalFilterType)
              .slice(20, 27)
              .map((name) => (
                <Col sm={6}>
                  <div key={"id10" + name} className="filterTitle">{name}</div>
                  <SelectDropdown
                    key={name}
                    name={name}
                    filterDataType={globalFilterType[name]}
                    values={dropDownData[name]}
                  />
                </Col>
              ))}
          </Row>
        </div>
      </Modal>
    </>
  );
};
export default Filter;