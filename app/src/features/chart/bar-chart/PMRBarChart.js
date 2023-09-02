import React from "react";
import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { numberConversion } from "../../app-utils/AppUtils";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import "./BarChart.scss";
import ChartWrapper from "../../wrapper/ChartWrapper";
import Alert from '@mui/material/Alert';
import { useSelector } from "react-redux";
import fonts from "../../../features/style/variable.scss";

const PMRBarChart = (props) => {
  const PMRGraphData = useSelector((state) => state.source.PMRGraphData);
  const PMRGraphDataState = useSelector((state) => state.source.PMRGraphDataState);
  const colors = ["#21BEE1", "#F2AA3C"];
  const xTitle = "Year";
  const yTitleSet = ["Volume: M", "Revenue: $"];
  const [yTitle, setYTitle] = useState("Volume: M");
  const [option, setOption] = useState({});
  const [sourceData, setSourceData] = useState({});
  const [labelData, setLabelData] = useState([]);
  useEffect(() => {
    let resultResponse = {}
    let count = 0;
    let label = [];
    if (PMRGraphDataState === "fulfilled") {
      Object.entries(PMRGraphData).forEach(([key, value]) => {
        if (key === "year")
          count = value.length
        if (yTitle === yTitleSet[0]) {
          if (key !== "YOY Growth Revenue" && key !== "revenue") {
            resultResponse[key] = value;

          }
        }
        else { if (key !== "YOY Growth Volume" && key !== "volume") resultResponse[key] = value; }
      });
      setSourceData(resultResponse);
      for (let i = 2; i < count; i++) //for FY25
      {
        let volumeData = Number(yTitle === yTitleSet[0] ? resultResponse["volume"][i] : resultResponse["revenue"][i]) >= 1.0e9
          ? yTitle === yTitleSet[0] ? resultResponse["volume"][i] + 1000000 : resultResponse["revenue"][i] + 600000000
          : Number(yTitle === yTitleSet[0] ? resultResponse["volume"][i] : resultResponse["revenue"][i]) >= 1.0e8
            ? yTitle === yTitleSet[0] ? resultResponse["volume"][i] + 1000000 : resultResponse["revenue"][i] + 20000000
            : // Six Zeroes for Millions
            Number(yTitle === yTitleSet[0] ? resultResponse["volume"][i] : resultResponse["revenue"][i]) >= 1.0e6
              ? yTitle === yTitleSet[0] ? resultResponse["volume"][i] + 100000 : resultResponse["revenue"][i] + 400000
              : // Three Zeroes for Thousands
              Number(yTitle === yTitleSet[0] ? resultResponse["volume"][i] : resultResponse["revenue"][i]) >= 1.0e3
                ? yTitle === yTitleSet[0] ? resultResponse["volume"][i] + 500 : resultResponse["revenue"][i] + 2000
                : yTitle === yTitleSet[0] ? resultResponse["volume"][i] : resultResponse["revenue"][i] + 200;

        label.push({
          coord: [i, volumeData],
          value: yTitle === yTitleSet[0] ? resultResponse["volCagr"][i] : resultResponse["revenueCagr"][i],
          symbol: "pin",
          tooltip: {
            formatter: function (params) {

              return ` CAGR: ${params.data.value}%`
            },
          },
          label: {
            show: true,
            distance: 100,
            formatter: function (params) {
              let values = params.data.value ? params.data.value : undefined;
              if (!isNaN(values)) {
                if (values < 0) {
                  return `{a|  ${values}%}`;
                } else {
                  return `{b|  ${values}%}`;
                }
              }
              else {
                return "";
              }
            },
            rich: {
              a: {
                fontFamily: "noto-sans-medium",
                fontWeight: 400,
                fontSize: fonts.fontSizeSmall,
                color: "red",
              },
              b: {
                fontFamily: "noto-sans-medium",
                fontWeight: 400,
                fontSize: fonts.fontSizeSmall,
                color: "green",
              },
            },
          },
          symbolSize: 1
        })
      }

      setLabelData(label)
    }

  }, [PMRGraphDataState, yTitle]);
  useEffect(() => {
    setOption({
      color: colors,
      tooltip: {},
      grid: {
        containLabel: true,
        top: '20%',
        left: '10%',
        bottom: 18,
        right: '3%',
      },
      legend: {
        left: "5%",
        show: true,
        selectedMode: true


      },

      xAxis: [
        {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          data: sourceData["year"],
          axisLabel: {

            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: fonts.fontSizeSmall,
            color: "#0D1640CC",

            width: 50, //fixed number of pixels
            overflow: "break", // or 'break' to continue in a new line //truncate for ...
            interval: 0,
          },
          // prettier-ignore
        },
      ],
      yAxis: [
        {
          type: "value",
          name: yTitle,
          position: "left",
          alignTicks: true,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0],
            },
          },
          axisLabel: {
            formatter: function (params) {
              if (yTitle === yTitleSet[1])
                return `$${numberConversion(params)}`
              else
                return `${numberConversion(params)}`
            },

            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: fonts.fontSizeSmall,
            color: "#0D1640CC",

            width: 45, //fixed number of pixels
            overflow: "truncate", // or 'break' to continue in a new line //truncate for ...
            interval: 0,
          },
        },
        {
          type: "value",
          name: "YOY Growth",
          position: "right",
          alignTicks: true,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1],
            },
          },
          axisLabel: {
            formatter: "{value}%",
            fontFamily: "noto-sans-medium",
            fontWeight: 400,
            fontSize: fonts.fontSizeSmall,
            width: 45, //fixed number of pixels
            overflow: "truncate", // or 'break' to continue in a new line //truncate for ...
            interval: 0,
          },
        },
      ],
      series: [
        {
          name: yTitle,
          type: "bar",
          data: yTitle === yTitleSet[0] ? sourceData["volume"] : sourceData["revenue"],
          markPoint: {
            data: labelData,
          },
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              if (params.seriesName === "Revenue: $") {
                return [
                  `${params.name}: <b> $${numberConversion(params.value)}</b><br/>`,
                  typeof (params.data[2]) == "number" ? "CAGR%: " + `<b>${Math.round(params.data[2])}%</b>` + "<br/>" : "",
                ].join("");
              }
              else {
                return [
                  `${params.name}: <b> ${numberConversion(params.value)}</b><br/>`,
                  typeof (params.data[2]) == "number" ? "CAGR%: " + `<b>${Math.round(params.data[2])}%</b>` + "<br/>" : "",
                ].join("");
              }
            },
          },
        },
        {
          name: yTitle === "Volume: M" ? "YOY Growth Volume" : "YOY Growth Revenue",
          type: "line",
          yAxisIndex: 1,

          data: yTitle === yTitleSet[0] ? sourceData["YOY Growth Volume"] : sourceData["YOY Growth Revenue"],
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              return `YOY Growth <br/> 
              ${params.name} : ${Math.round(params.value)}%`
            },
          },
        },
      ],
    });
  }, [sourceData, labelData]);

  //event handling
  const onYTitleClick = (event,) => {
    setYTitle(event.target.value);
  };
  return (
    <div>
      <ChartWrapper
        type="source"
        title="Projected Materials Requirement"
        chartDownloadData={
          Object.keys(sourceData)?.length > 0 ? sourceData : []
        }
        downloadType="chart"
        cardLoading={PMRGraphDataState === 'pending'}
      >
        {!Object.values(sourceData)[0]?.length > 0 && (
          <Alert severity="warning">No Data Found for Projected Material Group Graph !</Alert>
        )}
        {Object.values(sourceData)[0]?.length > 0 && (
          <>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={12}>
                <div className="PMR-yAxis">
                  {yTitleSet?.length > 1 && (
                    <ToggleButtonGroup
                      onChange={onYTitleClick}
                      value={yTitle}
                      defaultValue={yTitle}
                      optionType="button"
                      size="small"
                      style={{
                        margin: 18,
                      }}
                    >
                      {yTitleSet?.map((item, i) => (
                        <ToggleButton key={i} value={item}>
                          {item}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                </div>
                <div id="barChart-container">
                  <ReactEcharts
                    option={option}
                    style={{
                      height: "335px",
                      marginTop: "-6%"
                    }}
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
                <InputLabel id="demo-select-small" className="x-axisTitle">
                  {xTitle}
                </InputLabel>
              </Grid>
            </Grid>
          </>
        )}
      </ChartWrapper>
    </div>
  );
};

export default PMRBarChart;
