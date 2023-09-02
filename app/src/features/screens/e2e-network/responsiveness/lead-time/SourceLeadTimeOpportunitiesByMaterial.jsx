import React, { useRef } from 'react';
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import ChartWrapper from '../../../../wrapper/ChartWrapper';
import { perPage } from '../../../../../variables';

import { numberConversion } from '../../../../app-utils/AppUtils';
const valueFormatter = (params) => {
  return params.value ? `$${numberConversion(params.value)}` : ""
}
const unitsValueFormatter = (params) => {
  return params.value ? `${numberConversion(params.value)}` : ""
}

const columnDefs = [
  { headerName: 'Material', field: 'Material', width: 70, maxWidth: 150 },
  { headerName: 'Material Description', field: 'Material Description', width: 100, maxWidth: 350 },
  { headerName: 'Material Group', field: 'Material Group', width: 100, maxWidth: 300 },
  { headerName: 'Vendor Name', field: 'Vendor Name', width: 50, maxWidth: 200 },
  { headerName: 'Vendor Region', field: 'Vendor Region', width: 50, maxWidth: 150 },
  { headerName: 'Plant', field: 'Pant', width: 50, maxWidth: 150 },
  { headerName: 'SLT', field: 'SLT', width: 40, maxWidth: 150 },
  { headerName: 'TLT', field: 'TLT', width: 40, maxWidth: 150 },
  { headerName: 'GRT', field: 'GRT', width: 40, maxWidth: 150 },
  { headerName: 'TSLT', field: 'TSLT', width: 40, maxWidth: 150 },
  { headerName: 'Units', field: 'Units', width: 40, maxWidth:120, valueFormatter: unitsValueFormatter },
  { headerName: '$FG Impact', field: '$Fg Impact', width: 70, maxWidth: 150, valueFormatter: valueFormatter }
];

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  maxWidth: 150,

}


const SourceLeadTimeOpportunitiesByMaterial = () => {

  const sourceLeadTimeRef = useRef();
  const date = new Date();
  const currentDate = `${date.getDate()}-${date.getMonth() + 1
    }-${date.getFullYear()}`;

  const fileName = "Sourcing Lead Time Opportunities by Material"
  const params = {
    fileName: `${fileName}_${currentDate}`,
  };

  const sourceLeadTimedownload = () => {
    sourceLeadTimeRef.current.api.exportDataAsCsv(params);
  };
  const onGridReady = (params) => {

    params.api.sizeColumnsToFit();
  }

  const sourceLeadtimeState = useSelector((state) => state.leadtime.sourceLeadtimeState)
  const sourceLeadtimeGrid = useSelector((state) => state.leadtime.sourceLeadtimeGrid)
 

  return (
    <ChartWrapper
      title="Sourcing Lead Time Opportunities by Material"
      className="grid-card"
      downloadType="grid"
      downloadCsv={sourceLeadTimedownload}
      cardLoading={sourceLeadtimeState === "pending"}
    >
      <div className="finished-good-grid">
        <AgGridReact
          className="ag-theme-alpine"
          rowData={sourceLeadtimeGrid}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          ref={sourceLeadTimeRef}
          pagination={true}
          animateRow={true}
          paginationPageSize={perPage}
          cacheBlockSize={perPage}
          onGridReady={onGridReady}

        />
      </div>
    </ChartWrapper>
  )
}

export default SourceLeadTimeOpportunitiesByMaterial;