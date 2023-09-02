
import ChartWrapper from "../../../../../wrapper/ChartWrapper";
import { Row, Col } from "antd";
import { useRef } from "react";
import RegionlizationPerGrid from "./RegionalizationPerGrid";
import { useSelector } from "react-redux";
import "./RegionalizationPer.scss";

const RegionalizationPer = () => {
  const regionalizationPerState = useSelector(state => state.regionalization.regionalizationPerState)
  const selectedResponsivenessGlobalFilters = useSelector(
    (state) => state.filter.selectedResponsivenessGlobalFilters
  );
  const makeIngRef = useRef()
  const makeCompRef = useRef();
  const salesRegionRef = useRef();
  const regLegendObj = [
    {
      className: "block-less-than-50",
      label: "<50%",
    },
    {
      className: "block-bw-50-75",
      label: "50-75%",
    },
    {
      className: "block-75",
      label: ">75%",
    },
    {
      className: "regionalized-volume",
      label: "Regionalized Volume",
    },
  ];

  const regionalizationPerGridDownload = () => {
    setTimeout(() => {
      makeIngRef.current.regionalizationGridDownload()
      makeCompRef.current.regionalizationGridDownload()
      salesRegionRef.current.regionalizationGridDownload()

    }, 1000)

  };


  return (
    <ChartWrapper title="Regionalization%" className="reg-grid" cardLoading={regionalizationPerState === "pending"} downloadCsv={regionalizationPerGridDownload}
      downloadType="grid">
      <Row justify="start" className="reg-legend">
        {regLegendObj.map((item, index) => (
          <div key={index}>
            <div className={`block ${item.className}`}></div>
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </Row>
      <Row gutter={[5]}>
        <Col sm={1} className="custom-flex">
          <div className="text-orientation">Source Region</div>
        </Col>
        <Col sm={7} className="custom-flex-1">
          <RegionlizationPerGrid gridName="make-ingredent" ref={makeIngRef} />
        </Col>
        <Col sm={1} className="custom-flex">
          <div className="text-orientation">Source Region</div>
        </Col>
        <Col sm={7} className="custom-flex-1">
          <RegionlizationPerGrid gridName="make-component" ref={makeCompRef} />
        </Col>
        <Col sm={1} className="custom-flex">
          <div className="text-orientation">Make Region</div>
        </Col>
        <Col sm={7} className="custom-flex-1">
          <RegionlizationPerGrid gridName="sales-region" ref={salesRegionRef} />
        </Col>
      </Row>
    </ChartWrapper>
  );
};

export default RegionalizationPer;
