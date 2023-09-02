import "./GeoMapLegend.scss";
import { Col, Row } from "antd";

const GeoMapLegend = ({ type }) => {
  return (
    <div className="nodeLegend">
      <div className="legendHeader">Node Legend</div>
      <div className="legendInfo">
        Size of node denotes Total Volume for Eaches only
      </div>
      <div className="legend-tooltip">
        <Row justify="space-between" gutter={[18, 12]}>
          {(type == "source" || type == "e2e") && (
            <>
              <Col sm={12}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--source-ing-color)",
                    "--borderColor": "var(--source-ing-color)",
                  }}
                />
                <span className="legendSpan">Component (EA) </span>
              </Col>
              <Col sm={12}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--source-comp-color)",
                    "--borderColor": "var(--source-ing-color)",
                  }}
                />
                <span className="legendSpan">Ingredient (Kg)</span>
              </Col>
            </>
          )}

          {type == "make" && (
            <>
              <Col sm={11}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--plant-comp-color)",
                    "--borderColor": "var(--plant-comp-color)",
                  }}
                />
                <span className="legendSpan">Internal-F&A </span>
              </Col>
              <Col sm={13}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--plant-fa-color)",
                    "--borderColor": "var(--plant-comp-color)",
                  }}
                />
                <span className="legendSpan">Internal-Compounding </span>
              </Col>
              <Col sm={11}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--tpm-comp-color)",
                    "--borderColor": "var(--tpm-comp-color)",
                  }}
                />
                <span className="legendSpan">TPM-F&A </span>
              </Col>
              <Col sm={13}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--tpm-fa-color)",
                    "--borderColor": "var(--tpm-comp-color)",
                  }}
                />
                <span className="legendSpan">TPM-Compounding </span>
              </Col>
            </>
          )}
          {type == "e2e" && (
            <>
              <Col sm={12}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--plant-comp-color)",
                    "--borderColor": "var(--plant-comp-color)",
                  }}
                />
                <span className="legendSpan">Internal-F&A </span>
              </Col>

              <Col sm={12}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--tpm-comp-color)",
                    "--borderColor": "var(--tpm-comp-color)",
                  }}
                />
                <span className="legendSpan">TPM-F&A </span>
              </Col>
            </>
          )}
          {(type == "fulfill" || type == "e2e") && (
            <>
              <Col sm={12}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--affliate-dc-color)",
                    "--borderColor": "var(--distribution-centre-color)",
                  }}
                />
                <span className="legendSpan">Fulfill HUB</span>
              </Col>

              <Col sm={12}>
                <div
                  className="colorBox"
                  style={{
                    "--color": "var(--distribution-centre-color)",
                    "--borderColor": "var(--distribution-centre-color)",
                  }}
                />
                <span className="legendSpan">Affiliate FC </span>
              </Col>
            </>
          )}
        </Row>
      </div>
    </div>
  );
};

export default GeoMapLegend;
