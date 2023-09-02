import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { numberConversion } from "../../app-utils/AppUtils";
import { Row, Col } from "antd";
import fonts from "../../style/variable.scss"
const DonutChart = ({ chartData }) => {
  const [option, setOption] = useState({});
  const [IEoption, setIEOption] = useState({});
  const [saleableOption, setSaleableOption] = useState({});
  const label = {
    alignTo: 'edge',
    margin: 45,
    formatter: (param) => {
      return `{a| ${param.data.quantityPercentage}%}\n {b|${param.data.name}}`;
    },
    labelline: {
      show: true,
    },
    rich: {
      a: {
        fontFamily: "noto-sans-bold",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: fonts.fontSizeXXsamll,
        lineHeight: 24,
        color: "#0D1640",
      },
      b: {
        fontFamily: "noto-sans-medium",
        fontStyle: "normal",
        fontWeight: 100,
        fontSize: fonts.fontSizeXXsamll,
        lineHeight: 16,
        color: "#0D1640",
      },
    },
  };


  useEffect(() => {
    setOption({
      title: {
        subtext: "Regional\n\nMix",
        left: "48%",
        top: "48%",
        textAlign: "center",
        subtextStyle: {
          fontFamily: "noto-sans-bold",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: fonts.fontSizeXXsamll,
          color: "#0D1640",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          return `${params.data.name}: ${numberConversion(params.data.value)}`;
        },
      },

      series: [
        {
          type: "pie",
          name: "Regional\n\nMix",
          radius: ["40%", "30%"],
          top: "17%",
          center: ["50%", "52%"],
          label: label,
          color: ["#BD8CD1", "#A55CC3", "#702C8C"],
          data:
            chartData && chartData !== undefined && chartData.regionalMix
              ? chartData.regionalMix
              : [],
          emphasis: {
            show: false,
          },

          labelLine: {
            show: true,
            length: 5,
            lineStyle: {
              color: "#ffffff",
            },
            z: 100,
          },
        },
      ],
    });
    setIEOption({
      title: {
        subtext: "I/E Mix",
        left: "49%",
        top: "42%",
        textAlign: "center",
        subtextStyle: {
          fontFamily: "noto-sans-bold",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: fonts.fontSizeXXsamll,
          color: "#0D1640",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          return `${params.data.name}: ${numberConversion(params.data.value)}`;
        },
      },

      series: [
        {
          type: "pie",
          radius: ["40%", "30%"],
          center: ["50%", "50%"],
          label: label,
          color: ["#E8E9EC", "#21BEE1"],
          data:
            chartData && chartData !== undefined && chartData.i_e
              ? chartData.i_e
              : [],
          emphasis: {
            show: false,
          },

          labelLine: {
            show: true,
            length: 5,
            lineStyle: {
              color: "#ffffff",
            },
            z: 100,
          },
        },

      ],
    });
    setSaleableOption({
      title: {
        subtext: "Saleable\nVs\nPromo Mix",
        left: "48%",
        top: "37%",
        textAlign: "center",
        subtextStyle: {
          fontFamily: "noto-sans-bold",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: fonts.fontSizeXXsamll,
          color: "#0D1640",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          return `${params.data.name}: ${numberConversion(params.data.value)}`;
        },
      },

      series: [
        {
          type: "pie",
          radius: ["40%", "30%"],
          center: ["50%", "50%"],
          label: label,
          color: ["#21BEE1", "#E8E9EC"],
          data:
            chartData && chartData !== undefined && chartData.promoMix
              ? chartData.promoMix
              : [],
          emphasis: {
            show: false,
          },

          labelLine: {
            show: true,
            length: 5,
            lineStyle: {
              color: "#ffffff",
            },
          },
          z: 100,
        },
      ],
    });


  }, [chartData])
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={12} >
          <ReactEcharts
            option={option}
            style={{
              height: "350px",
            }}
          />
        </Col>
        <Col span={12}>
          <ReactEcharts
            option={IEoption}
            style={{
              height: "250px",
            }}
          />
          <ReactEcharts
            option={saleableOption}
            style={{
              height: "250px",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default DonutChart;
