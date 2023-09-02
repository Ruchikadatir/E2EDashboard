/* eslint-disable */
import { Card } from "antd";
import React, { useEffect } from "react";
import { Row, Col } from "antd";
import "./E2ECard.scss";
import SourceIcon from "../custom-icon/SourceIcon.js";
import MakeIcon from "../custom-icon/MakeIcon.js";
import FulfillIcon from "../custom-icon/FulfillIcon";
import ArrowDownIcon from "../../assets/arrow_down_icon.png";
import ArrowUpIcon from "../../assets/arrow_up_icon.png";
import { useSelector, useDispatch } from "react-redux";
import { numberConversion } from "../app-utils/AppUtils";
const E2ECard = ({ type, cardData }) => {


  const e2eCardData = useSelector((state) => state.e2eCard.e2eCardData);

  const cardTitle = () => {
    if (type === "make") {
      return (
        <span className="make-color card-title">
          <MakeIcon fillActive="#FCFCFF" />
          &nbsp;&nbsp;Make
        </span>
      );
    }
    if (type === "source") {
      return (
        <span className=" make-color card-title">
          <SourceIcon fillActive="#FCFCFF" />
          &nbsp;&nbsp;Source
        </span>
      );
    }
    if (type === "fulfill") {
      return (
        <span className=" fulfill-color card-title">
          <FulfillIcon fillActive="#FCFCFF" />
          &nbsp;&nbsp;Fulfill
        </span>
      );
    }
  };

  return (
    <Card className={`cards-view ${type}`}>
      <Row>
        <Col xs="6">
          <div>{cardTitle()}</div>{" "}
        </Col>
      </Row>

      <div className="list-item">
        {type == "source" && (
          <Row justify="space-around" gutter={[80, 50]}>
            <Col sm={11}>
              <div className="volume">
                <div className="card-content"> Component (EA)</div>
                <div className="label-spacing">
                  <span className="units-display">
                    {numberConversion(e2eCardData?.source?.component)}
                  </span>
                  <span className="percentage">
                    <img
                      src={(e2eCardData?.source?.componentYoY >= 0 || Math.round(e2eCardData?.source?.componentYoY) === -0) ? ArrowUpIcon : ArrowDownIcon}
                      className="arrowDown"
                      alt="arrowdown"
                    />
                    {e2eCardData?.source?.componentYoY !== undefined ? `${Math.round(Math.abs((e2eCardData?.source?.componentYoY)))}%` : ""}
                  </span>
                </div>
              </div>
            </Col>
            <Col sm={13}>
              <div className="Growth">
                <div className="card-content">Ingredient (Kg)</div>
                <div className="label-spacing">
                  <span className="units-display">
                    {numberConversion(e2eCardData?.source?.ingredient)}

                  </span>
                  <span className="percentage">
                    <img src={(e2eCardData?.source?.ingredientYoY >= 0 || Math.round(e2eCardData?.source?.ingredientYoY) === -0) ? ArrowUpIcon : ArrowDownIcon} className="arrowUp" alt="arrowup" />
                    {e2eCardData?.source?.ingredientYoY !== undefined ? `${Math.round(Math.abs((e2eCardData?.source?.ingredientYoY)))}%` : ""}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        )}
        {type == "make" && (
          <Row justify="space-around" gutter={[60, 50]}>
            <Col sm={12}>
              <div className="volume">
                <div className="card-content"> F&A Production (EA)</div>
                <div className="label-spacing">
                  <span className="units-display">

                    {e2eCardData?.make !== undefined && e2eCardData?.make['f&aProduction'] !== undefined ? numberConversion(e2eCardData?.make['f&aProduction']) : ""}
                  </span>
                  <span className="percentage">
                    <img
                      src={e2eCardData?.make !== undefined && e2eCardData?.make['f&aProductionYoY'] !== undefined && (e2eCardData?.make["f&aProductionYoY"] >= 0 || Math.round(e2eCardData?.make["f&aProductionYoY"]) === -0) ? ArrowUpIcon : ArrowDownIcon}
                      className="arrowDown"
                      alt="arrowdown"
                    />
                    {e2eCardData?.make !== undefined && e2eCardData?.make['f&aProductionYoY'] !== undefined ? `${Math.round(Math.abs((e2eCardData?.make["f&aProductionYoY"])))}%` : ""}
                  </span>
                </div>
              </div>
            </Col>
            <Col sm={12}>
              <div className="Growth">
                <div className="card-content">Compounding (Kg)</div>
                <div className="label-spacing">
                  <span className="units-display">
                    {numberConversion(e2eCardData?.make?.compounding)}
                  </span>
                  <span className="percentage">
                    <img src={(e2eCardData?.make?.compoundingYoY >= 0 || Math.round(e2eCardData?.make?.compoundingYoY) === -0) ? ArrowUpIcon : ArrowDownIcon} className="arrowUp" alt="arrowup" />
                    {e2eCardData?.make?.compoundingYoY !== undefined ? `${Math.round(Math.abs((e2eCardData?.make?.compoundingYoY)))}%` : ""}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        )}
        {type == "fulfill" && (
          <Row justify="space-around" gutter={[80, 50]}>
            <Col sm={11}>
              <div className="volume">
                <div className="card-content">Sell-in Units (EA)</div>
                <div className="label-spacing">
                  <span className="units-display">

                    {numberConversion(e2eCardData?.fulfill?.sellInUnits)}
                  </span>
                  <span className="percentage">
                    <img
                      src={((e2eCardData?.fulfill?.sellInUnitsYoY) >= 0 || Math.round(e2eCardData?.fulfill?.sellInUnitsYoY) === -0) ? ArrowUpIcon : ArrowDownIcon}
                      className="arrowDown"
                      alt="arrowdown"
                    />
                    {e2eCardData?.fulfill?.sellInUnitsYoY !== undefined ? `${Math.round(Math.abs((e2eCardData?.fulfill?.sellInUnitsYoY)))}%` : ""}
                  </span>
                </div>
              </div>
            </Col>
            <Col sm={13}>
              <div className="Growth">
                <div className="card-content">Sell-in Revenue ($)</div>
                <div className="label-spacing">
                  <span className="units-display">
                    ${numberConversion(e2eCardData?.fulfill?.sellInReq)}
                  </span>
                  <span className="percentage">
                    {e2eCardData?.fulfill?.sellInReqYoY !== undefined ? `${Math.abs((e2eCardData?.fulfill?.sellInReqYoY).toFixed(1))}%` : ""}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        )}

      </div>
    </Card>
  );
};

export default E2ECard;
