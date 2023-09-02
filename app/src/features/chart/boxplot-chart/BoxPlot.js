import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { registerTransform } from "echarts";
import { aggregate } from "echarts-transform-dynamic-boxplot";
import InputLabel from "@mui/material/InputLabel";
import fonts from "../../../features/style/variable.scss";

/* props for Bar Chart Wrapper Component
      height: '350px' set height required for graph component,
      source: (check sourceSufficiency.js file for examples) Data set for the graph
      xTitle: ["Volume","Revenue"] Array for X Toggle button,
      yTitle:  ["Volume","Revenue"]  Array for Y Toggle button
*/

function BoxPlotChart(props) {
  const [XTitle, setXTitle] = useState(
    props.GraphChartProps?.xTitle?.length > 0
      ? props.GraphChartProps?.xTitle?.[0]
      : ""
  );
  const [YTitle, setYTitle] = useState(
    props.GraphChartProps?.yTitle?.length > 0
      ? props.GraphChartProps?.yTitle?.[0]
      : ""
  );

  registerTransform(aggregate);

  const [option, setOption] = useState({});
  useEffect(() => {
    if (props.GraphChartProps?.source !== "undefined" && props.GraphChartProps?.source !== "null" && props.GraphChartProps?.source?.length > 0) {
      setOption({
        grid: {
          containLabel: true,
          bottom: props.GraphChartProps?.dataZoom ? 100 : 18,
          right: props.GraphChartProps?.rightSpace ? props.GraphChartProps?.rightSpace : '5%',
        },
        dataset: [
          {
            id: "raw",
            source: props.GraphChartProps?.source,
          },
          {
            id: "leadTime_aggregate",
            fromDatasetId: "raw",
            transform: [
              {
                type: "ecSimpleTransform:aggregate",
                config: {
                  resultDimensions: [
                    { name: "min", from: "e2eLt", method: "min" },
                    { name: "Q1", from: "e2eLt", method: "Q1" },
                    { name: "median", from: "e2eLt", method: "median" },
                    { name: "Q3", from: "e2eLt", method: "Q3" },
                    { name: "max", from: "e2eLt", method: "max" },
                    { name: "category", from: props.GraphChartProps?.chartName },
                  ],
                  groupBy: props.GraphChartProps?.chartName,
                },
              },
              {
                type: "sort",
                config: {
                  dimension: "max",
                  order: "desc",
                },
              },
            ],
          },
        ],
        tooltip: {
          trigger: "item",
          confine: true,
          appendToBody: true,
          formatter: function (params) {
            if (params.seriesName === "outlier") {
              let nameFormat = params.data[2].split(",").join("<br/>&emsp;&emsp;&emsp;&emsp;");
              return [
                `FG Code: <b>${params.data[1]}</b><br/>`,
                `FG Name: <br/> &emsp;&emsp;&emsp;&emsp;<b> ${nameFormat}</b><br/>`,
                `E2E LT:  &emsp;<b>${params.data[3]}</b><br/>`,
              ].join("");
            }
            else {
              return [
                `Min: <b>${Math.round(params.data[0])}</b><br/>`,
                `Q1: <b> ${Math.round(params.data[1])}</b><br/>`,
                `Median:  <b>${Math.round(params.data[2])}</b><br/>`,
                `Q3:  <b>${Math.round(params.data[3])}</b><br/>`,
                `Max:  <b>${Math.round(params.data[4])}</b><br/>`,
              ].join("");
            }
          },
          width: 50,
          textStyle: {
            fontSize: fonts.fontSizeXsmall,
            width: 50, //fixed number of pixels
            overflow: "breakAll", // or 'break' to continue in a new line //truncate for ...
            interval: 0,
            alwaysShowContent: true,
          },
        },
        xAxis: {
          nameLocation: "middle",
          nameGap: 30,
          scale: true,
          type: "category",
          axisLabel: {
            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: fonts.fontSizeSmall,
            color: "#0D1640CC",
            width: 100, //fixed number of pixels
            overflow: "break", // or 'break' to continue in a new line //truncate for ...
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
          axisLabel: {
            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: fonts.fontSizeSmall,
            color: "#0D1640CC",
            width: 50, //fixed number of pixels
            overflow: "break", // or 'break' to continue in a new line //truncate for ...
            interval: 0,
          },
        },
        series: props.GraphChartProps?.seriesData,
        dataZoom: props.GraphChartProps?.dataZoom,
      });
    }
  }, [props.GraphChartProps.source, props]);

  return (
    <>
      {props.GraphChartProps?.yTitle?.length === 1 && (
        <InputLabel id="demo-select-small" className="y-axisTitle">
          {props.GraphChartProps?.yTitle?.[0]}
        </InputLabel>
      )}
      <div id="boxplot-container">
        <ReactEcharts
          option={option}
          style={{
            height: props.GraphChartProps.height,
            width: props.GraphChartProps?.width ? props.GraphChartProps?.width : "100%",
            marginTop: props.GraphChartProps?.chartMarginTop ? props.GraphChartProps?.chartMarginTop : 0,
            marginLeft: props.GraphChartProps?.chartMarginLeft ? props.GraphChartProps?.chartMarginLeft : 0
          }}
        />
      </div>
      {props.GraphChartProps?.xTitle?.length === 1 && (
        <InputLabel
          id="demo-select-small"
          className="x-axisTitle"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {props.GraphChartProps?.xTitle?.[0]}
        </InputLabel>
      )}
    </>
  );
}
export default BoxPlotChart;