import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Row, Col } from "antd";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { globalFilterResponse } from "../FilterSlice";
import { globalFilter } from "../../../variables";
import "../Filter.scss";
export default function FilterChip({ location }) {
  const dispatch = useDispatch();

  const selectedSufficiencyGlobalFilters = useSelector(
    (state) => state.filter.selectedSufficiencyGlobalFilters
  );
  const selectedDemandScenarioGlobalFilters = useSelector(
    (state) => state.filter.selectedDemandScenarioGlobalFilters
  );
  const selectedResponsivenessGlobalFilters = useSelector((state) => state.filter.selectedResponsivenessGlobalFilters);
  const activeTabs = useSelector((state) => state.e2eNav.activeTabs);


  const [selectedGlobalFilters, setSelectedGlobalFilters] = useState(selectedSufficiencyGlobalFilters);
  const [chipData, setChipData] = React.useState([]);
  const [responseData, setReponseData] = useState(selectedSufficiencyGlobalFilters);
  const [resultData, setResultData] = useState({});

  const [sendData, setSendData] = useState(false);
  const handleDelete = (chipToDelete) => () => {
    delete chipData[chipToDelete];
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
    let response = { [chipToDelete]: null };
    setReponseData((prevState) => ({
      ...prevState,
      ...response,
      index_of: Object.keys(globalFilter).indexOf(chipToDelete) - 1,
    }));
    setSendData(true);
  };
  useEffect(() => {
    if (sendData) {
      dispatch(globalFilterResponse({ location, activeTabs, result: responseData }));
      setSendData(false)
    }
  }, [responseData]);
  useEffect(() => {
    let resultResponse = {};
    Object.entries(selectedGlobalFilters).forEach(([key, value]) => {
      if (location.includes("demand-scenario")) {
        if (value != null && key !== "index_of" && value.length > 0 && key !== "year" && key !== "quarter") resultResponse[key] = value;
      }
      else
        if (value != null && key !== "index_of" && value.length > 0) resultResponse[key] = value;

    });
    setChipData(Object.keys(resultResponse));
    setResultData(resultResponse)
  }, [selectedGlobalFilters]);
  useEffect(() => {
    if (location.includes("demand-scenario")) {
      setSelectedGlobalFilters(selectedDemandScenarioGlobalFilters);
      setReponseData(selectedDemandScenarioGlobalFilters)
    }
    if (location.includes("responsiveness")) {
      setSelectedGlobalFilters(selectedResponsivenessGlobalFilters);
      setReponseData(selectedResponsivenessGlobalFilters);
    }
    if (location.includes("sufficiency")) {
      setSelectedGlobalFilters(selectedSufficiencyGlobalFilters);
      setReponseData(selectedSufficiencyGlobalFilters)
    }
  }, [selectedSufficiencyGlobalFilters, selectedDemandScenarioGlobalFilters, selectedResponsivenessGlobalFilters, location]);
  return (
    <Col>
      <Row gutter={[32, 16]} >
        {Object.keys(chipData).length > 0 && (
          <>
            {chipData.slice(0, 8).map((name, index) => (
              <>
                {Object.values(resultData)[index][0]?.length === 1 && (
                  <Chip className="filterChip"
                    size="small"
                    key={name}
                    variant="outlined"
                    label={resultData[name]}
                  />
                )
                }
                {Object.values(resultData)[index][0]?.length > 1 && (
                  <div className="chip-wrapper">

                    {Object.values(resultData)[index]?.slice(0, 3).map((key) => (

                      <Chip className="filterChip"
                        size="small"
                        key={key}
                        variant="outlined" label={key} />
                    ))}
                    {Object.values(resultData)[index]?.length > 3 && (
                      <Chip className="filterChip"
                        size="small"
                        key={"extrachip"}
                        variant="outlined" label={"+" + (Object.values(resultData)[index].length - 3)} />
                    )}
                  </div>
                )}
              </>
            ))}
          </>
        )}
        {Object.keys(chipData).length > 8 && (
          <Chip className="filterChip"
            size="small"
            key={"extrachipWrapper"}
            variant="outlined" label={"+" + (Object.keys(chipData).length - 8)} />
        )}
      </Row>
    </Col>

  );
}
