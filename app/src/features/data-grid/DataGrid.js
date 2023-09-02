import React, { useRef, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./DataGrid.scss";
const GraphDataGrid = React.forwardRef(
  (
    {
      rowData,
      columnDefs,
      defaultColDef,
      animateRow,
      pagination,
      autoGroupColumnDef,
      paginationPageSize,
      fileName,
      rowHeight
    },
    ref
  ) => {
    const gridRef = useRef();

    const onGridReady = (params) => {
      params.api.sizeColumnsToFit();
    };
    const date = new Date();

    const currentDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    const params = {
      fileName: `${fileName}_${currentDate}`,
    };

    useImperativeHandle(ref, () => ({
      gridDownload: () => {
        gridRef.current.api.exportDataAsCsv(params);
      },
    }));

    return (
      <>
        <AgGridReact
          ref={gridRef}
          className="ag-theme-alpine"
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={animateRow}
          pagination={pagination}
          autoGroupColumnDef={autoGroupColumnDef}
          paginationPageSize={paginationPageSize}
          rowHeight={rowHeight}
          onGridReady={onGridReady}
          
        />
      </>
    );
  }
);

export default GraphDataGrid;
