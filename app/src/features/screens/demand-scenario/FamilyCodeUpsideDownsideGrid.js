import React, { useRef } from 'react';
import ChartWrapper from '../../wrapper/ChartWrapper';
import { AgGridReact } from "ag-grid-react";

import { useSelector } from "react-redux";
import { perPage } from "../../../variables";

const columnDefs = [
  { headerName: 'Family Code', field: 'family_code' },
  { headerName: 'Family Description', field: 'family_description', minWidth: 350 },
  { headerName: 'Priority Subcategory', field: 'priority_subcategory', minWidth: 220 },
  { headerName: 'Brand', field: 'brand' },
  { headerName: 'Region', field: 'region' },
  { headerName: 'Brand Ambition', field: 'brand_ambition' },
  { headerName: 'CDP', field: 'cdp' },
  { headerName: 'Upside/(Downside)', field: 'upside_or_downside' },
];

const defaultColDef = {
  sortable: false,
  filter: false,
  resizable: true,

}


const FamilyCodeUpsideDownsideGrid = ({ activeBtn }) => {

  const familyCodeGridRef = useRef();
  const date = new Date();
  const currentDate = `${date.getDate()}-${date.getMonth() + 1
    }-${date.getFullYear()}`;

  const fileName = "Family Code Upside/Downside"
  const params = {
    fileName: `${fileName}_${currentDate}`,
  };

  const familyCodeDownload = () => {
    familyCodeGridRef.current.api.exportDataAsCsv(params);
  };
  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  }

  const familyCodeState = useSelector((state) => state.demandScenario.familyCodeState)
  const familyCodeGrid = useSelector((state) => state.demandScenario.familyCodeGrid)


  return (
    <ChartWrapper
      type="demand-scenario"
      title="Family Code Upside/Downside"
      className="grid-card"
      downloadType="grid"
      downloadCsv={familyCodeDownload}

      cardLoading={familyCodeState === "pending"}

    >
      <div className="common-grid-style">
        <AgGridReact
          className="ag-theme-alpine"
          rowData={familyCodeGrid !== undefined && Object.keys(familyCodeGrid)?.length > 0 ? familyCodeGrid?.records[activeBtn] : []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          ref={familyCodeGridRef}
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

export default FamilyCodeUpsideDownsideGrid;