import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Checkbox, Modal, Input, Divider } from "antd";
import { useLocation } from "react-router-dom";
import { Radio as Toggle } from 'antd';
import Grid from "@material-ui/core/Grid";
import "./CustomCalendar.scss";

const CustomCalendar = (props) => {
  const { Option } = Select;
  const location = useLocation().pathname;
  const [open, setOpen] = useState(false);
  // here you can update the FY eg . 2026,2027
  const fy_year = ["2023", "2024", "2025"];
  const [yearValue, setYearValue] = useState(props.filterResponse["year"] ? props.filterResponse["year"] : "2023"); // updated here
  const quarter = ["Q1", "Q2", "Q3", "Q4", "All"];
  const [quarterValue, setQuarterValue] = useState(props.filterResponse["quarter"] ? props.filterResponse["quarter"] : quarter[4]);
  const [responseDate, setResponseDate] = useState(
    "FY " + yearValue.slice(2, 4)
  );
  const onQuarterClick = (event) => {
    setQuarterValue(event.target.value);
  };
  const onYearClick = (event) => {
    setYearValue(event.target.value);
  };
  const onYearSelectClick = (value) => {
    setYearValue(value);
    let responseData = { "yearValue": value, "quarterValue": null }
    props.responseTimePeriodSet(responseData);
  };
  const handleOkClick = () => {
    let response = "FY " + yearValue.slice(2, 4);
    if (!quarterValue.includes("All")) response += "-" + quarterValue;

    let responseData = {}
    setResponseDate(response);
    setOpen(!open);
    if (quarterValue !== "All")
      responseData = { yearValue, quarterValue }
    else responseData = { yearValue, "quarterValue": null }
    props.responseTimePeriodSet(responseData);
  };
  useEffect(() => { }, [location]);
  useEffect(() => {
    let year = props.filterResponse["year"] ? props.filterResponse["year"] : "2023"; //update default fiscal year
    let quarters = props.filterResponse["quarter"] ? props.filterResponse["quarter"] : quarter[4]
    let response = "FY " + year.slice(2, 4);
    if (!quarters.includes("All")) response += "-" + quarters;
    setYearValue(year);
    setQuarterValue(quarters);
    setResponseDate(response)
  }, [props.filterResponse, open]);

  return (
    <div className="calendar-container">
      {location.includes("sufficiency") && (
        <div>
          <Input
            value={responseDate}
            style={{
              width: "90%",
              height: "30px",
            }}
            onClick={() => setOpen(!open)}
          />
          <Modal
            className="modal-container"
            title="Time Period"
            open={open}
            width={350}
            onOk={handleOkClick}
            onCancel={() => {
              setOpen(!open);
            }}
          >
            <Grid container spacing={2} justifyContent="space-evenly"
              alignItems="flex-end">
              <Grid item xs={3}>
                <div className="calendar-title">FY Year</div>
              </Grid>
              <Grid item xs={9}>
                <Toggle.Group
                  onChange={onYearClick}
                  value={yearValue}
                  defaultValue={yearValue}
                  optionType="button"
                  size="small"
                  style={{
                    margin: 18,
                  }}
                >
                  {fy_year.map((item, i) => (

                    <Toggle.Button key={i} value={item}>
                      {item}
                    </Toggle.Button>

                  ))}
                </Toggle.Group>
              </Grid>
              <Grid item xs={3}>
                <div className="calendar-title">Quarterly</div>
              </Grid>
              <Grid item xs={9}>

                <Toggle.Group
                  onChange={onQuarterClick}
                  value={quarterValue}
                  defaultValue={quarterValue}
                  optionType="button"
                  size="small"
                  style={{
                    margin: 18,
                  }}
                >
                  {quarter.map((item, i) => (
                    <Toggle.Button key={i} value={item}>
                      {item}
                    </Toggle.Button>
                  ))}
                </Toggle.Group>
              </Grid>
              <Divider orientation="center" />
            </Grid>
          </Modal>
        </div>
      )}

      {location.includes("responsiveness") && (
        <div>
          <Grid container spacing={2} justifyContent="space-evenly"
          >
            <Grid item xs={6}>
              <div className="text-size">FY Year</div>
            </Grid>
            <Grid item xs={6}>
              <Select
                showSearch
                showArrow={false}
                defaultValue={yearValue}
                key={"year" + yearValue}
                value={yearValue}
                onChange={onYearSelectClick}
                style={{
                  width: "100px",
                  height: "30px",
                }}
              >
                {fy_year?.map((item) => (

                  <Option key={"year" + item} value={item} label={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
