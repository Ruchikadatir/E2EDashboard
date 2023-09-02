import React, { useState} from "react";
import "./ChartWrapper.scss";
import download from "../../assets/download.png";
import cardInfo from "../../assets/cardInfo.png";
import { CSVLink } from "react-csv";
import { Card } from "antd";
import { Tooltip } from 'antd';
import { downloadDataFormatConversion } from "../app-utils/AppUtils"

const ChartWrapper = ({
  type,
  title,
  children,
  cardLoading,
  info,
  downloadCsv,
  downloadType,
  chartDownloadData,
  className,
  downloadCsvFile

}) => {

  const [isInfoVisible, setIsInfoVisible] = useState(false)
  // once user click on downloadHandler button downloadCsv flag become true,csv file will be downloaded.
  const downloadHandler = () => {
    downloadCsv();
  };
  const date = new Date();

  const currentDate = `${date.getDate()}-${date.getMonth() + 1
    }-${date.getFullYear()}`;

  const infoHandler = () => {
    setIsInfoVisible(!isInfoVisible);
  }

  const msg =
    "<ul><li>Brand ambition is calculated on base year of historical shipments</li><li>CDP reflects the forecast from the latest available consensus</li><li>% Growth in the chart is difference between CDP and Brand Ambition in a given year</li></ul>";

  const renderExtraProps = () => {
    return (
      <div>
        {info == "true" && (
          <Tooltip title={<div dangerouslySetInnerHTML={{ __html: msg }} />}
            placement="bottomRight" key="red">
            <span className="info-pos" onClick={infoHandler}>
              <img src={cardInfo} alt="card-info" />
            </span>
          </Tooltip>

        )}
        {downloadType === "grid" && (
          <span className="download-pos" onClick={downloadHandler}>
            <img src={download} alt="file_download" />
          </span>
        )}
        {downloadType === "chart" && (
          <CSVLink
            asyncOnClick={true}
            filename={`${title}_${currentDate}.csv`}
            data={downloadDataFormatConversion(chartDownloadData, title)}
          >
            <img src={download} alt="file_download" />
          </CSVLink>
        )}

      </div>
    );
  };
  return (
    <>
      <Card
        title={title}
        loading={cardLoading}
        className={`wrapper ${type + "card"} ${className}`}
        extra={renderExtraProps()}
        bordered={false}
      >
        {children}
      </Card>
    </>
  );
};

export default ChartWrapper;
