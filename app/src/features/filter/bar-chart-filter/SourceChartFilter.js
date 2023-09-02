import { Button } from "antd";
import React, { useState, useEffect } from "react";
import "../Filter.scss";
import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Divider } from "antd";
import { fetchSourceChartFilterRequest, setChartFilterDropDownResponse, setAPICall } from "../FilterSlice";
import { sourceFilterType, sourceChartFilter } from "../../../variables";
import { useSelector, useDispatch } from "react-redux";
import { Select } from "antd";
import { Spin } from 'antd';

const SourceChartFilter = ({ enable }) => {
  const { Option } = Select;
  const dispatch = useDispatch();


  const selectedSufficiencyGlobalFilters = useSelector((state) => state.filter.selectedSufficiencyGlobalFilters);
  const sourceChartFilterResponse = useSelector((state) => state.filter.sourceChartFilterResponse);
  const sourceChartFilterLoaded = useSelector((state) => state.filter.sourceChartFilterLoaded);
  const selectedSourceChartFilters = useSelector((state) => state.filter.selectedSourceChartFilters);
  const sourceChartFilterGlobalApply = useSelector((state) => state.filter.sourceChartFilterGlobalApply);


  const [dropDownData, setDropDownData] = useState(sourceChartFilterResponse);
  const [filterResponse, setFilterResponse] = useState(selectedSourceChartFilters);
  const [sendData, setSendData] = useState(false);
  const [sendAPICall, setSendAPICall] = useState(false);
  const [onClear, setOnClear] = useState(false);
  const [index_of, setIndexOf] = useState(1);

  let extraDropDown = ["Components", "Ingredients"]
  function SelectDropdown(props) {

    const data = props.name === "Material Type" ? extraDropDown : props.values;

    const filterData = data?.filter(value => value !== null)
    const handleSelectedItem = (value) => {

      if (value && value.length && value.includes("All")) {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: filterData,
          index_of: Object.keys(sourceFilterType).indexOf(props.name) + 1,
        }));


      }
      else if (value.length === 0) {
        if (Object.keys(sourceFilterType).indexOf(props.name) === 0) {
          setFilterResponse({ index_of: 0 })
        }
        else {
          setFilterResponse((prevState) => ({
            ...prevState,
            [props.name]: (null),
            index_of: Object.keys(sourceFilterType).indexOf(props.name) + 1,
          }));
        }
      }
      else {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: value,
          index_of: Object.keys(sourceFilterType).indexOf(props.name) + 1,
        }));
      }
      setSendAPICall(true)
    };
    const handleSingleSelectedItem = (value) => {


      if (value?.length === 0 || value === undefined) {
        if (Object.keys(sourceFilterType).indexOf(props.name) === 0) {
          setFilterResponse({ index_of: 0 })
        }
        else {
          setFilterResponse((prevState) => ({
            ...prevState,
            [props.name]: (null),
            index_of: Object.keys(sourceFilterType).indexOf(props.name) + 1,
          }));

        }

      }
      else {
        setFilterResponse((prevState) => ({
          ...prevState,
          [props.name]: value,
          index_of: Object.keys(sourceFilterType).indexOf(props.name) + 1,
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
    let chartfilterRequest = {};
    if (sendAPICall) {
      if (filterResponse["index_of"] < index_of && sendAPICall) {
        Object.entries(sourceFilterType).forEach(([key, value], index) => {

          if (index < filterResponse["index_of"])
            chartfilterRequest[key] = filterResponse[key]
        });
        chartfilterRequest["index_of"] = filterResponse["index_of"];
      }
      else if (index_of === 0 && sendAPICall) {
        setFilterResponse((prevState) => ({
          ...prevState,
          index_of: 0,
        }));
        chartfilterRequest = filterResponse;
      }
      else
        chartfilterRequest = filterResponse;


      setFilterResponse(chartfilterRequest)

      dispatch(fetchSourceChartFilterRequest({ "globalFilter": selectedSufficiencyGlobalFilters, "sourceChartFilter": chartfilterRequest, index_of }));
      setSendAPICall(false);

    }
    if (sourceChartFilterGlobalApply) {

      dispatch(fetchSourceChartFilterRequest({ "globalFilter": selectedSufficiencyGlobalFilters, "sourceChartFilter": sourceChartFilter, index_of }));
      dispatch(setAPICall("barChartFilter-Source"));
      setFilterResponse(sourceChartFilter)
    }
    if (sendData) {
      dispatch(setChartFilterDropDownResponse({ "chartFilterType": "source", filterResponse, "setResponse": true }))
      setSendData(false)
    }
    setIndexOf(filterResponse["index_of"])

  }, [sendAPICall, sourceChartFilterGlobalApply, sendData]);

  useEffect(() => {

    if (sourceChartFilterLoaded) {
      setDropDownData(sourceChartFilterResponse)
    }


  }, [sourceChartFilterResponse, sourceChartFilterLoaded, dropDownData])
  const onClickClearAll = (event) => {
    setFilterResponse(sourceChartFilter)
    setIndexOf(0)
    setSendAPICall(true);
  };
  const onClickApplyFilters = (event) => {

    setSendData(true);
  };


  return (
    <div className="barChartFilterContainer">
      <Spin spinning={!sourceChartFilterLoaded} tip="Loading Filter Data">


        <div >
          <Row gutter={[16, 32]}>
            {Object.keys(sourceFilterType)
              .slice(0, sourceFilterType.length)
              .map((name) => (
                <Col span={4}>
                  <div key={"barchartfilter" + name} className="filterTitle">{name}</div>
                  <SelectDropdown
                    key={name}
                    name={name}
                    filterDataType={sourceFilterType[name]}
                    values={dropDownData[name]}
                  />
                </Col>
              ))}
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

          </Row>
        </div>
      </Spin>
    </div>
  );
};
export default SourceChartFilter;