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
  { headerName: 'FG Item', field: 'fgItem', minWidth: 100 },
  { headerName: 'FG Name', field: 'fgName', minWidth: 200 },
  { headerName: 'Brand', field: 'fgBrand', minWidth: 120 },
  { headerName: 'Major Category', field: 'majorCategory', minWidth: 120 },
  { headerName: 'Major Inventory Type', field: 'majorInventoryType', minWidth: 120 },
  { headerName: 'Priority Subcategory', field: 'subCategory', minWidth: 150 },
  { headerName: 'Product Line', field: 'productLine', minWidth: 120 },
  { headerName: 'Sub Product Line', field: 'subProductLine', minWidth: 150 },
  { headerName: 'Sales Region', field: 'salesRegion', minWidth: 100 },
  { headerName: 'Priority Subcat. LT Percentile', field: 'prioritySubLtPer', minWidth: 150 },
  { headerName: 'Wt. Avg. Source LT', field: 'wtAvgSourceLt', minWidth: 120 },
  { headerName: 'Wt. Avg. Make LT', field: 'wtAvgMakeLt', minWidth: 120 },
  { headerName: 'Wt. Avg. Fulfil LT', field: 'wtAvgFulfilLt', minWidth: 120 },
  { headerName: 'E2E LT', field: 'e2eLt', minWidth: 80 },
  { headerName: 'FG Units', field: 'fgUnits', valueFormatter: unitsValueFormatter, minWidth: 80 },
  { headerName: '$ FG', field: '$fg', valueFormatter: valueFormatter, minWidth: 80 },
];





const defaultColDef = {
  sortable: false,
  filter: false,
  resizable: true,
  width: 90
}
const E2EWtAvgLeadTimeByFinishedGood = ({ activeBtn }) => {

  const leadTimeFinishGoodRef = useRef();
  const date = new Date();
  const currentDate = `${date.getDate()}-${date.getMonth() + 1
    }-${date.getFullYear()}`;

  const fileName = "E2E Wt Avg Leadtime by Finished Good"
  const params = {
    fileName: `${fileName}_${currentDate}`,
  };

  const leadTimeFinishGood = () => {
    leadTimeFinishGoodRef.current.api.exportDataAsCsv(params);
  };
  const onGridReady = (params) => {

    params.api.sizeColumnsToFit();
  }


  const finishedGoodGridState = useSelector((state) => state.leadtime.finishedGoodGridState)
  const finishedGoodGrid = useSelector((state) => state.leadtime.finishedGoodGrid)




  return (
    <ChartWrapper
      title="E2E Wt. Avg. Leadtime by Finished Good"
      className="grid-card"
      downloadType="grid"
      downloadCsv={leadTimeFinishGood}
      cardLoading={finishedGoodGridState === "pending"}
    >
      <div className="finished-good-grid">
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={columnDefs}
          rowData={Object.keys(finishedGoodGrid)?.length > 0 ? finishedGoodGrid?.records[activeBtn] : []}
          defaultColDef={defaultColDef}
          ref={leadTimeFinishGoodRef}
          pagination={true}
          animateRow={true}


          paginationPageSize={perPage}
          cacheBlockSize={perPage}
          onGridReady={onGridReady}

        />
      </div>
    </ChartWrapper>
  );
}

export default E2EWtAvgLeadTimeByFinishedGood;