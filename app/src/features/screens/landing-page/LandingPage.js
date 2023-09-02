import React from "react";
import { Tabs } from "antd";
import { Card, Button } from "antd";
import "./LandingPage.scss";
import { Row, Col } from "antd";
import { Tag } from "antd";
import { ReactComponent as SufficiencyIcon } from "../../../assets/Icons/sufficiency_tab.svg";
import MakeIcon from "../../custom-icon/MakeIcon";
import FulFillIcon from "../../custom-icon/FulfillIcon";
import SourceIcon from "../../custom-icon/SourceIcon";

const { TabPane } = Tabs;
const onChange = (key) => {
  console.log(key);
};

const { Meta } = Card;

const tabOnChange = (key) => {
};

const LandingPage = () => {
  const handleClose = (removedTag) => {
  };

  return (
    <div className="main-container">
      <Row>
        <div className="heading">
          <p>
            Welcome to the{" "}
            <span style={{ fontWeight: "900" }}>
              Supply Chain Navigator tool!
            </span>{" "}
          </p>
        </div>
      </Row>
      <Tabs
        id="sufficiency-tabs"
        className="tab-class"
        defaultActiveKey="sufficieny_tab"
        onChange={tabOnChange}
      >
        <TabPane
          tab={
            <span>
              <SufficiencyIcon />
            </span>
          }
          key="sufficieny_tab"
        >
          <div>
            <Row>
              <Col xs={24} xl={18}>
                <div className="sufficiency-panel">
                  <Row>
                    <Col className="column" xs={24} xl={8}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt="Manloc"
                            src={require("../../../assets/strategic.png")}
                          />
                        }
                      >
                        <SourceIcon
                          className="source-icon"
                          fillActive={"rgba(32, 191, 226, 0.9)"}
                        />
                        <Meta
                          title="Strategic Material Plan"
                          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero."
                        />
                      </Card>
                    </Col>
                    <Col className="column" xs={24} xl={8}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt="Manloc"
                            src={require("../../../assets/strategic.png")}
                          />
                        }
                      >
                        <MakeIcon
                          className="source-icon"
                          fillActive={"rgba(0, 26, 224, 0.9)"}
                        />
                        <Meta
                          title="Manloc"
                          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero."
                        />
                      </Card>
                    </Col>
                    <Col className="column" xs={24} xl={8}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt="Fullfill Region"
                            src={require("../../../assets/strategic.png")}
                          />
                        }
                      >
                        <FulFillIcon
                          className="source-icon"
                          fillActive={"rgba(164, 84, 235, 0.9)"}
                        />
                        <Meta
                          title="Fulfill Region"
                          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero."
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="column" xs={24} xl={8}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt="Materials - Where used?"
                            src={require("../../../assets/strategic.png")}
                          />
                        }
                      >
                        <SourceIcon
                          className="source-icon"
                          fillActive={"rgba(32, 191, 226, 0.9)"}
                        />
                        <Meta
                          title="Materials - Where used?"
                          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero."
                        />
                      </Card>
                    </Col>
                    <Col className="column" xs={24} xl={8}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt="make Sufficiency"
                            src={require("../../../assets/strategic.png")}
                          />
                        }
                      >
                        <MakeIcon
                          className="source-icon"
                          fillActive={"rgba(0, 26, 224, 0.9)"}
                        />

                        <Meta
                          title="make Sufficiency"
                          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero."
                        />
                      </Card>
                    </Col>
                    <Col className="column" xs={24} xl={8}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt="Text"
                            src={require("../../../assets/strategic.png")}
                          />
                        }
                      >
                        <FulFillIcon
                          className="source-icon"
                          fillActive={"rgba(164, 84, 235, 0.9)"}
                        />
                        <Meta
                          title="Text"
                          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero."
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={24} xl={6}>
                <div className="notification-panel">
                  <Row>
                    <div>
                      <Tag
                        className="column1"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="icon"
                          src={require("../../../assets/trending_up.png")}
                        ></img>
                        Top Raw Material Growth to secure
                      </Tag>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <Tag
                        className="column2"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="region_icon"
                          src={require("../../../assets/tips_and_updates.png")}
                        ></img>
                        Regionalize X region of sale mix shift
                      </Tag>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <Tag
                        className="column2"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="supplier_icon"
                          src={require("../../../assets/warning.png")}
                        ></img>
                        Supplier reliance project shifts
                      </Tag>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <Tag
                        className="column1"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="icon"
                          src={require("../../../assets/trending_up.png")}
                        ></img>
                        Top Raw Material Growth to secure
                      </Tag>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <Tag
                        className="column2"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="region_icon"
                          src={require("../../../assets/tips_and_updates.png")}
                        ></img>
                        Regionalize X region of sale mix shift
                      </Tag>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <Tag
                        className="column2"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="supplier_icon"
                          src={require("../../../assets/warning.png")}
                        ></img>
                        Supplier reliance project shifts
                      </Tag>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <Tag
                        className="column1"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="icon"
                          src={require("../../../assets/trending_up.png")}
                        ></img>
                        Top Raw Material Growth to secure
                      </Tag>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <Tag
                        className="column2"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="region_icon"
                          src={require("../../../assets/tips_and_updates.png")}
                        ></img>
                        Regionalize X region of sale mix shift
                      </Tag>
                    </div>
                  </Row>
                  <Row>
                    <div>
                      <Tag
                        className="column2"
                        closable={true}
                        onClose={handleClose}
                      >
                        <img
                          className="supplier_icon"
                          src={require("../../../assets/warning.png")}
                        ></img>
                        Supplier reliance project shifts
                      </Tag>
                    </div>
                  </Row>
                </div>
                <Row>
                  <div>
                    <Button className="alerts" type="default">
                      5 more alerts
                    </Button>
                  </div>
                </Row>
                <Row>
                  <Card className="Legends">
                    <div>
                      Legends
                      <Row>
                        <Col>
                          <img
                            className="Legends-icons"
                            src={require("../../../assets/warning.png")}
                          ></img>
                          Risk
                        </Col>
                        <Col
                          style={{
                            marginLeft: "0.5rem",
                            marginRight: "0.4rem",
                          }}
                        >
                          <img
                            className="icon"
                            src={require("../../../assets/trending_up.png")}
                          ></img>
                          Growth
                        </Col>
                        <Col>
                          <img
                            className="region_icon"
                            src={require("../../../assets/tips_and_updates.png")}
                          ></img>
                          Opportunity
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Row>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane tab="Responsive" disabled key="responsive_tab"></TabPane>
        <TabPane tab="Portfolio" disabled key="portfolio_tab"></TabPane>
      </Tabs>
    </div>
  );
};
export default LandingPage;
