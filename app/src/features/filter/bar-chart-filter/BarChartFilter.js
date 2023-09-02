import { Modal, Button } from "antd";
import React, { useState, useEffect } from "react";
import "../Filter.scss";
import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Divider } from "antd";
import { fetchMakeChartFilterRequest, fetchSourceChartFilterRequest, setChartFilterDropDownResponse, setAPICall } from "../FilterSlice";
import { sourceChartFilter, makeChartFilter, sourceFilterType, makeFilterType } from "../../../variables";
import { useSelector, useDispatch } from "react-redux";
import { Select } from "antd";
import { Spin } from 'antd';

const BarChartFilter = ({ chartFilterType, enable }) => {
  const { Option } = Select;
  const dispatch = useDispatch();

  let extraDropDown = ["24/5", "24/7", "Efficiency Gains", "Capex", "All"]


  const selectedSufficiencyGlobalFilters = useSelector((state) => state.filter.selectedSufficiencyGlobalFilters);
  const sourceChartFilterResponse = useSelector((state) => state.filter.sourceChartFilterResponse);
  const makeChartFilterResponse = useSelector((state) => state.filter.makeChartFilterResponse);
  const sourceChartFilterLoaded = useSelector((state) => state.filter.sourceChartFilterLoaded);
  const makeChartFilterLoaded = useSelector((state) => state.filter.makeChartFilterLoaded);
  const selectedSourceChartFilters = useSelector((state) => state.filter.selectedSourceChartFilters);
  const selectedMakeChartFilters = useSelector((state) => state.filter.selectedMakeChartFilters);
  const sourceChartFilterInitialAPIResponse = useSelector((state) => state.filter.sourceChartFilterInitialAPIResponse);
  const sourceChartFilterGlobalApply = useSelector((state) => state.filter.sourceChartFilterGlobalApply);
  const makeChartFilterGlobalApply = useSelector((state) => state.filter.makeChartFilterGlobalApply);
  const [filterLoading, setFilterLoading] = useState(chartFilterType === "source" ? sourceChartFilterLoaded : makeChartFilterLoaded);
  const [chartFilters, setChartFilters] = useState(chartFilterType === "source" ? sourceChartFilterResponse : makeChartFilterResponse);
  const [selectedChartFilters, setSelectedChartFilters] = useState(chartFilterType === "source" ? selectedSourceChartFilters : selectedMakeChartFilters);
  const [initialDropDownData, setInitialDropDownData] = useState(chartFilterType === "source" ? sourceChartFilterInitialAPIResponse : makeChartFilterResponse);
  const Type = chartFilterType === "source" ? sourceFilterType : makeFilterType;
  const [dropDownData, setDropDownData] = useState({});
  const [filterResponse, setFilterResponse] = useState(chartFilterType === "source" ? sourceChartFilter : makeChartFilter);
  const [sendData, setSendData] = useState(false);
  const [sendAPICall, setSendAPICall] = useState(false);
  const [onClear, setOnClear] = useState(false);
  const [index_of, setIndexOf] = useState(1);



  function SelectDropdown(props) {

    const data = props.name === "Included Capacity" ? extraDropDown : props.values;

    const filterData = data?.filter(value => value !== null)
    const handleSelectedItem = (value) => {
      setOnClear(false);
      if (value && value.length && value.includes("All")) {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: filterData,
          index_of: Object.keys(Type).indexOf(props.name) + 1,
        }));
        setSendAPICall(true)

      }
      else if (value.length === 0) {
        if (Object.keys(Type).indexOf(props.name) === 0) {
          setFilterResponse({ index_of: 0 })
          setOnClear(true)
        }
        else {
          setFilterResponse((prevState) => ({
            ...prevState,
            [props.name]: (null),
            index_of: Object.keys(Type).indexOf(props.name),
          })); setSendAPICall(true)
        }
      }
      else {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: value,
          index_of: Object.keys(Type).indexOf(props.name) + 1,
        }));
      }
      setSendAPICall(true)
    };
    const handleSingleSelectedItem = (value) => {
      setOnClear(false);

      if (value && value.length && value.includes("clear")) {
        if (Object.keys(Type).indexOf(props.name) === 0) {
          setFilterResponse({ index_of: 0 })
          setOnClear(true)
        }
        else {
          setFilterResponse((prevState) => ({
            ...prevState,
            [props.name]: (null),
            index_of: Object.keys(Type).indexOf(props.name),
          }));
          setSendAPICall(true)
        }

      }
      else {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: value,
          index_of: Object.keys(Type).indexOf(props.name) + 1,
        }));

        setSendAPICall(true)
      }

    }

    return (

      <div key={"id20" + props.name} className="dropdown-container">
        <div key={"id12" + props.name}>
          {props.filterDataType === "single" && (
            <Select
              showSearch
              defaultValue={filterResponse[props.name] ? filterResponse[props.name] : ""}
              key={props.name}
              value={filterResponse[props.name] ? filterResponse[props.name] : ""}
              onChange={handleSingleSelectedItem}
              style={{
                width: "180px",
                height: "30px",
              }}
            >
              {filterData?.length > 0 && (
                <Select.Option key="clear" value="clear">
                  Clear
                </Select.Option>
              )}
              {filterData?.map((item) => (

                <Option key={"id15" + item} value={item}>
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
              showArrow={true}
              maxTagCount={2}
              maxTagTextLength={3}
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
                <Select.Option key={"id30" + item} value={item}>
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
    setFilterLoading(chartFilterType === "source" ? sourceChartFilterLoaded : makeChartFilterLoaded)
    setChartFilters(chartFilterType === "source" ? sourceChartFilterResponse : makeChartFilterResponse);
    setSelectedChartFilters(chartFilterType === "source" ? selectedSourceChartFilters : selectedMakeChartFilters);
    setInitialDropDownData(chartFilterType === "source" ? sourceChartFilterInitialAPIResponse : makeChartFilterResponse);
    if (!onClear)
      setDropDownData(chartFilterType === "source" ? sourceChartFilterResponse : makeChartFilterResponse);
  }, [sourceChartFilterLoaded, makeChartFilterLoaded, sourceChartFilterResponse,
    makeChartFilterResponse, selectedSourceChartFilters, selectedMakeChartFilters, sourceChartFilterInitialAPIResponse,
    makeChartFilterResponse, sourceChartFilter, makeChartFilter
  ])

  useEffect(() => {

    let globalFilterAPICall = chartFilterType === "source" ? sourceChartFilterGlobalApply : makeChartFilterGlobalApply;
    if (sendAPICall || globalFilterAPICall) {
      let chartfilterRequest = {};

      if (filterResponse["index_of"] < index_of) {
        Object.entries(Type).forEach(([key, value], index) => {

          if (index < filterResponse["index_of"])
            chartfilterRequest[key] = filterResponse[key]
        });
        chartfilterRequest["index_of"] = filterResponse["index_of"];
      }
      else
        chartfilterRequest = filterResponse;


      setFilterResponse(chartfilterRequest)
      if (chartFilterType === "source")
        dispatch(fetchSourceChartFilterRequest({ "globalFilter": selectedSufficiencyGlobalFilters, "sourceChartFilter": chartfilterRequest, index_of }));

      else
        dispatch(fetchMakeChartFilterRequest({ "globalFilter": selectedSufficiencyGlobalFilters, "makeChartFilter": chartfilterRequest, index_of }));
      setSendAPICall(false);
      dispatch(setAPICall(chartFilterType === "source" ? "barChartFilter-Source" : "barChartFilter-Make"));
    }
    if (sendData) {
      dispatch(setChartFilterDropDownResponse({ chartFilterType, filterResponse, "setResponse": true }))
      setSendData(false)
    }
    setIndexOf(filterResponse["index_of"])

  }, [sendAPICall, sourceChartFilterGlobalApply, makeChartFilterGlobalApply, sendData, chartFilters, dropDownData]);

  useEffect(() => {

    if (onClear) {
      setDropDownData(initialDropDownData);
      dispatch(setChartFilterDropDownResponse({ chartFilterType, filterResponse, "setResponse": false }))
      setIndexOf(0)

    }
    setSendAPICall(false);

  }, [filterLoading, onClear])
  const onClickClearAll = (event) => {
    setFilterResponse({ index_of: 0 })
    setOnClear(true);
    setSendAPICall(true);
    setSendData(true);
    setIndexOf(0)
  };
  const onClickApplyFilters = (event) => {

    setSendData(true);
  };


  return (
    <div className="barChartFilterContainer">
      <Spin spinning={!filterLoading} tip="Loading Filter Data">
        <div >
          <Row gutter={[16, 32]}>
            {Object.keys(Type)
              .slice(0, Type.length)
              .map((name) => (
                <Col span={4}>
                  <div key={"barchartfilter" + name} className="filterTitle">{name}</div>
                  <SelectDropdown
                    key={name}
                    name={name}
                    filterDataType={Type[name]}
                    values={dropDownData[name]}
                    presetValue={selectedChartFilters[name]}
                  />
                </Col>
              ))}
            {chartFilterType === "source" && (
              <>
                <Col span={3}>
                  <Button
                    type="text"
                    key="1"
                    className="clear-btn-chartFilter"
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
              </>)}
          </Row>
          {chartFilterType === "make" && (<Row justify="end" align="bottom">
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
          </Row>)}
        </div>
      </Spin>
    </div>
  );
};
export default BarChartFilter;