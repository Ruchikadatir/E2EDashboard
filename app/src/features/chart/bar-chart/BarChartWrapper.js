import React from "react";
import { useEffect, useState } from "react";
import "./BarChart.scss";
// import barCharts from "./barCharts";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Select } from "antd";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import SwapOutlined from "@mui/icons-material/SwapCallsOutlined";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ReactEcharts from "echarts-for-react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { numberConversion } from "../../app-utils/AppUtils";
import Alert from '@mui/material/Alert';

/* props for Bar Chart Wrapper Component
      height: '350px' set height required for graph component,
      width: '1200px' set width required for graph component,
      seriesData: (check sourceSufficiency.js file for examples) --set the type of graph i.e. lines/bar/stack ,
      source: (check sourceSufficiency.js file for examples) Data set for the graph
      xTitleSet: ["Volume","Revenue"] Array for X Toggle button,
      yTitleSet:  ["Volume","Revenue"]  Array for Y Toggle button,
      viewBySet:  ["Big 5","Fast 5"]  viewBy field dropdown list,
      dataCategory:  ["Ingredient","Components"]  Adding number of radio buttons on the header of graph,
      swap: true -- set true for horizontal bars else false for vertical bars 
      isToolBoxNeeded: false, -- this param sets the option to add buttons for toggling between stack/bar/line charts
************ Response to be handled on Parent Component *****************
  props.handleXTitleUpdate(newAlignment); // response of X Toggle button clicked 
  props.handleYTitleUpdate(newAlignment); // response of X Toggle button clicked
  props.handleDataCategoryType(event.target.value); // response of radio button selected
  props.handleViewByRequest(event); // response of View By dropdown list selected 

*/

function BarChartWrapper(props) {
  const { Option } = Select;
  const viewByTitle =
    props.GraphChartProps?.viewByTitle?.length > 0
      ? props.GraphChartProps.viewByTitle
      : "View By:";
  const [dataCategoryType, setdataCategoryType] = useState(
    props.GraphChartProps?.dataCategory?.length > 0
      ? props.GraphChartProps?.dataCategory?.[0]
      : ""
  );
  const [XTitle, setXTitle] = useState(
    props.GraphChartProps?.xTitleSelected?.length > 0 ? props.GraphChartProps?.xTitleSelected
      : props.GraphChartProps?.xTitleSet?.[0]
  );
  const [YTitle, setYTitle] = useState(
    props.GraphChartProps?.yTitleSet?.length > 0
      ? props.GraphChartProps?.yTitleSet?.[0]
      : ""
  );
  const [darkMode, setDarkMode] = useState(false);
  const [add$, setAdd$] = useState(false);
  const [viewByValue, setviewByValue] = useState(
    props.GraphChartProps?.viewBySet?.length > 0
      ? props.GraphChartProps?.viewBySet?.[0]
      : ""
  );
  const [option, setOption] = useState({});
  const onXTitleClick = (event) => {
    let value = event.target.value;
    if (value.includes("Revenue") || value.includes("$"))
      setAdd$(true)
    else
      setAdd$(false)
    setXTitle(value);
    props.handleXTitleUpdate(value);
  };
  const onYTitleClick = (event) => {
    let value = event.target.value;
    if (value.includes("Revenue") || value.includes("$"))
      setAdd$(true)
    else
      setAdd$(false)
    setYTitle(value);
    props.handleYTitleUpdate(value);
  };

  const ondataCategoryType = (event) => {
    setdataCategoryType(event.target.value);
    event.preventDefault();
    props.handleDataCategoryType(event.target.value);
  };
  const onChange = (checked) => {
    setDarkMode(!darkMode);
  };
  const handleviewByValue = (event) => {
    setviewByValue(event);
    props.handleViewByRequest(event);
  };
  const handleSwapClick = () => {
    //setSwap(!swap);
  };

  useEffect(() => {
    setOption({
      grid: {
        containLabel: true,
        left: props.GraphChartProps?.swap ? 53 : 45,
        bottom: props.GraphChartProps?.dataZoom ? 45 : 18,
        right: props.GraphChartProps?.dataZoom ? 60 : '3%',
      },
      legend: {
        left: "5%",
        selectedMode: true,
        show: props.GraphChartProps?.seriesData.length > 1 ? true : false,
        textStyle: {
          fontSize: props.GraphChartProps?.legendFontSize ? props.GraphChartProps.legendFontSize : 13,
          fontFamily: "noto-sans-medium",
        }
      },
      toolbox: {
        show: props.GraphChartProps.isToolBoxNeeded,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: { show: false },
          magicType: { show: true, type: ["line", "stack", "bar"] },
          restore: { show: true },
        },
    
      },
      tooltip: {
      
      },
      dataset: [
        {
          source: props.GraphChartProps?.source,
        },
      ],

      xAxis: [
        {
          type: props.GraphChartProps?.swap ? "value" : "category",
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: function (params) {

              if (props.GraphChartProps?.swap) {
                {
                  if (add$ || props.GraphChartProps?.add$)
                    return `$${numberConversion(params)}`
                  else
                    return `${numberConversion(params)}`
                }
              } else {
                return `${params}`
              }
            },
            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: props.GraphChartProps?.fontSize ? props.GraphChartProps?.fontSize : 13,
            color: "#3C4466",
            width: props.GraphChartProps?.xAxisWidth ? props.GraphChartProps?.xAxisWidth : 50, //fixed number of pixels
            overflow: "break", // or 'break' to continue in a new line //truncate for ...
            interval: 0,
          },
        },
    
      ],
      yAxis: [
        {
          type: props.GraphChartProps?.swap ? "category" : "value",
          splitLine: {
            show: false,
          },
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            formatter: function (params) {

              if (!props.GraphChartProps?.swap) {
                {
                  if (add$ || props.GraphChartProps?.add$)
                    return `$${numberConversion(params)}`
                  else
                    return `${numberConversion(params)}`
                }
              } else {
                return `${params}`
              }
            },

            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: props.GraphChartProps?.fontSize ? props.GraphChartProps?.fontSize : 13,
            color: "#0D1640CC",
            width: props.GraphChartProps?.yAxisTitleWidth ? props.GraphChartProps?.yAxisTitleWidth : 50, //fixed number of pixels
            overflow: "break", // or 'break' to continue in a new line //truncate for ...
            interval: 0,
          },
        },
      ],
      dataZoom: props.GraphChartProps?.dataZoom,
      series: props.GraphChartProps?.seriesData,
    });
  }, [props.GraphChartProps.source, props]);
  useEffect(() => { }, [props, viewByValue]);
  return (
    <div>
      <Box className="barChart-container">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item={10}>
            {props.GraphChartProps?.dataCategory?.length > 0 && (
              <Grid item xs="auto">
                <FormControl>
                  <RadioGroup
                    row
                    autoWidth={true}
                    value={dataCategoryType}
                    onChange={ondataCategoryType}
                    size="small"
                  >
                    {props.GraphChartProps?.dataCategory?.map((item, i) => (
                      <FormControlLabel
                        value={item}
                        key={i}
                        control={<Radio color="primary" />}
                        label={item}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}
          </Grid>
          <Grid item={2}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className="dropdown-select"
            >
              <Grid item={1}>
                {props.GraphChartProps?.viewBySet?.length > 0 && (
                  <div className="sortDataTitle">{viewByTitle}</div>
                )}
              </Grid>

              <Grid item={1}>
                {props.GraphChartProps?.viewBySet?.length > 0 && (
                  <>
                    <Select
                      showSearch
                      size="small"
                      key={props.name}
                      value={viewByValue}
                      maxTagTextLength={1}
                      onChange={handleviewByValue}
                      className="dropdown-size"
                    >
                      {props.GraphChartProps?.viewBySet?.map((item) => (
                        <Option key={"id1" + item} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {!Object.values(props.GraphChartProps?.source)[0]?.length > 0 && (
          <Alert severity="warning">No Data Found !</Alert>
        )}
        {Object.values(props.GraphChartProps?.source)[0]?.length > 0 && (
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >

            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >

              <Grid item xs={12}>
                {props.GraphChartProps?.yTitleSet?.length > 1 && (
                  <div className="barchart-YAXIS-toggle-btn">
                    <ToggleButtonGroup
                      onChange={onYTitleClick}
                      value={YTitle}
                      defaultValue={YTitle}
                      optionType="button"
                      size="small"
                    >
                      {props.GraphChartProps?.yTitleSet?.map((item, i) => (
                        <ToggleButton key={i} value={item}>
                          {item}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                )}
                {props.GraphChartProps?.yTitleSet?.length === 1 && (
                  <InputLabel id="demo-select-small" className="y-axisTitle">
                    {props.GraphChartProps?.yTitleSet?.[0]}
                  </InputLabel>
                )}
                <div id="barChart-container">
                  <ReactEcharts
                    option={option}
                    style={{
                      height: props.GraphChartProps.height,
                      marginTop: props.GraphChartProps?.chartMarginTop ? props.GraphChartProps?.chartMarginTop : 0,
                    }}
                    theme={darkMode ? "dark" : "light"}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6}>
                {props.GraphChartProps?.xTitleSet?.length > 1 && (
                  <div className="barchart-XAXIS-toggle-btn">
                    <ToggleButtonGroup
                      onChange={onXTitleClick}
                      value={XTitle}
                      defaultValue={XTitle}
                      optionType="button"
                      size="small"
                    >
                      {props.GraphChartProps?.xTitleSet?.map((item, i) => (
                        <ToggleButton key={i} value={item}>
                          {item}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                )}
                {props.GraphChartProps?.xTitleSet?.length === 1 && (
                  <InputLabel id="demo-select-small" className="x-axisTitle">
                    {props.GraphChartProps?.xTitleSet?.[0]}
                  </InputLabel>
                )}
              </Grid>
            </Grid>
          </Grid>)}

      </Box>
    </div>
  );
}
export default BarChartWrapper;
