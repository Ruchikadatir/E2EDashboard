import "./NodeChartLegend.scss";
import { Col, Row } from "antd";

const NodeChartLegend = () => {
    return (
        <div className="nodeLeadTimeLegend">
            <div className="legend-tooltip">
                <Row justify="space-between">
                    <>
                        <Col sm={12}>
                            <div
                                className="nodecolorBox"
                                style={{
                                    "--color": "#ff8f8f",
                                    "--borderColor": "#ff8f8f",
                                }}
                            />
                            <span className="legendSpan">EUROPE </span>
                        </Col>
                        <Col sm={12}>
                            <div
                                className="nodecolorBox"
                                style={{
                                    "--color": "#caaeff",
                                    "--borderColor": "#caaeff",
                                }}
                            />
                            <span className="legendSpan">ASIA</span>
                        </Col>
                        <Col sm={12}>
                            <div
                                className="nodecolorBox"
                                style={{
                                    "--color": "#acd4fe",
                                    "--borderColor": "#acd4fe",
                                }}
                            />
                            <span className="legendSpan">AMERICAS</span>
                        </Col>
                        <Col sm={12}>
                            <div
                                className="nodecolorBox"
                                style={{
                                    "--color": "black",
                                    "--borderColor": "black",
                                }}
                            />
                            <span className="legendSpan">No Region</span>
                        </Col>
                    </>
                </Row>
            </div>
        </div>
    );
};

export default NodeChartLegend;
