import { Button } from "antd";
import React, { useState, useEffect } from "react";
import "../Filter.scss";
import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Divider } from "antd";
import { fetchMakeChartFilterRequest, setChartFilterDropDownResponse, setAPICall } from "../FilterSlice";
import { makeFilterType } from "../../../variables";
import { useSelector, useDispatch } from "react-redux";
import { Select } from "antd";
import { Spin } from 'antd';

const MakeChartFilter = ({ enable }) => {
  const { Option } = Select;
  const dispatch = useDispatch();

  let extraDropDown = ["24/5", "24/7", "Efficiency Gains", "Capex", "All"]
  const selectedSufficiencyGlobalFilters = useSelector((state) => state.filter.selectedSufficiencyGlobalFilters);
  const makeChartFilterResponse = useSelector((state) => state.filter.makeChartFilterResponse);
  const makeChartFilterLoaded = useSelector((state) => state.filter.makeChartFilterLoaded);
  const selectedMakeChartFilters = useSelector((state) => state.filter.selectedMakeChartFilters);
  const makeChartFilterGlobalApply = useSelector((state) => state.filter.makeChartFilterGlobalApply);


  const [dropDownData, setDropDownData] = useState(makeChartFilterResponse);
  const [filterResponse, setFilterResponse] = useState(selectedMakeChartFilters);
  const [sendData, setSendData] = useState(false);
  const [sendAPICall, setSendAPICall] = useState(false);
  const [onClear, setOnClear] = useState(false);
  const [index_of, setIndexOf] = useState(1);


  function SelectDropdown(props) {
    const data = props.name === "Included Capacity" ? extraDropDown : props.values;


    const filterData = data?.filter(value => value !== null)
    const handleSelectedItem = (value) => {

      if (value && value.length && value.includes("All")) {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: filterData,
          index_of: Object.keys(makeFilterType).indexOf(props.name) + 1,
        }));


      }
      else if (value.length === 0) {
        if (Object.keys(makeFilterType).indexOf(props.name) === 0) {
          setFilterResponse({ index_of: 0 })
        }
        else {
          setFilterResponse((prevState) => ({
            ...prevState,
            [props.name]: (null),
            index_of: Object.keys(makeFilterType).indexOf(props.name) + 1,
          }));
        }
      }
      else {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: value,
          index_of: Object.keys(makeFilterType).indexOf(props.name) + 1,
        }));
      }
      setSendAPICall(true)
    };
    const handleSingleSelectedItem = (value) => {


      if (value?.length === 0 || value === undefined) {
        if (Object.keys(makeFilterType).indexOf(props.name) === 0) {
          setFilterResponse({ index_of: 0 })
        }
        else {
          setFilterResponse((prevState) => ({
            ...prevState,
            [props.name]: (null),
            index_of: Object.keys(makeFilterType).indexOf(props.name) + 1,
          }));

        }

      }
      else {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: value,
          index_of: Object.keys(makeFilterType).indexOf(props.name) + 1,
        }));


      }
      setSendAPICall(true)
    }

    return (

      <div key={"id20" + props.name} className="dropdown-container">
        <div key={"id12" + props.name}>
          {props.filterDataType === "single" && (
            <Select
              allowClear
              showSearch
              showArrow={false}
              defaultValue={filterResponse[props.name] ? filterResponse[props.name] : ""}
              key={props.name}
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              value={filterResponse[props.name] ? filterResponse[props.name] : ""}
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
              key={props.name}
              mode="multiple"
              allowClear={true}
              value={filterResponse[props.name] ? filterResponse[props.name] : []}
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
              maxTagCount={1}
              onChange={handleSelectedItem}

              style={{
                width: "180px",
                height: "30px",
              }}
            >
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

    let chartfilterRequest = {};
    if (sendAPICall) {


      if (filterResponse["index_of"] < index_of && sendAPICall) {
        Object.entries(makeFilterType).forEach(([key, value], index) => {

          if (index < filterResponse["index_of"])
            chartfilterRequest[key] = filterResponse[key]
        });
        chartfilterRequest["index_of"] = filterResponse["index_of"];

      }
      else
        chartfilterRequest = filterResponse;


      setFilterResponse(chartfilterRequest)

      dispatch(fetchMakeChartFilterRequest({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": chartfilterRequest, index_of }));
      setSendAPICall(false);


    }

    if (sendData) {
      dispatch(setChartFilterDropDownResponse({ "chartFilterType": "make", filterResponse, "setResponse": true }))
      setSendData(false)
    }
    setIndexOf(filterResponse["index_of"])

  }, [sendAPICall, sendData]);

  useEffect(() => {

    if (makeChartFilterLoaded) {
      setDropDownData(makeChartFilterResponse)
    }


  }, [makeChartFilterResponse, makeChartFilterLoaded, dropDownData])

  const onClickClearAll = (event) => {
    let result = { index_of: 0 }
    setFilterResponse(result)
    setSendAPICall(true);
  };
  const onClickApplyFilters = (event) => {

    setSendData(true);
  };


  return (
    <div className="barChartFilterContainer">
      <Spin spinning={!makeChartFilterLoaded} tip="Loading Filter Data">


        <div >
          <Row gutter={[16, 32]}>
            {Object.keys(makeFilterType)
              .slice(0, makeFilterType.length)
              .map((name) => (
                <Col span={4}>
                  <div key={"barchartfilter" + name} className="filterTitle">{name}</div>
                  <SelectDropdown
                    key={name}
                    name={name}
                    filterDataType={makeFilterType[name]}
                    values={dropDownData[name]}
                  />
                </Col>
              ))}
          </Row>
          <Row justify="end" align="bottom">
            <Col span={3}>
              <Button
                type="text"
                key="1"
                className="clear-btn"
                disabled={!enable}
                icon={
                  <ClearOutlined style={{ fontSize: "1rem", color: "#09208c" }} />
                }
                onClick={onClickClearAll}
              >
                Clear All
              </Button>
            </Col>
            <Col span={3}>
              <Button
                key="2"
                disabled={!enable}
                className="apply-Barchart-filter-button custom-button"
                type="primary"
                onClick={onClickApplyFilters}
              >
                Apply Filter
              </Button>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};
export default MakeChartFilter;