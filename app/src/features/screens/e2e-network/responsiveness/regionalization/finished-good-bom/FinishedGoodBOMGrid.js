import { useRef } from "react";
import ChartWrapper from "../../../../../wrapper/ChartWrapper";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";

import { numberConversion } from "../../../../../app-utils/AppUtils";
import { perPage } from "../../../../../../variables";

const valueFormatter = (params) => {
    return params.value ? `${numberConversion(params.value)}` : ""
}

const perRoundValueFormatter = (params) => {
    return params.value ? `${Math.round(params.value)}%` : ""
}
const finishedGoodsBOMColumnDefs = [
    { headerName: "FG Code", field: "FG_Code", width: 70 },
    {
        headerName: "FG Item Description",
        field: "FG_Item_Description",
        width: 200,
        maxWidth: 350
    },
    { headerName: "FG Brand", field: "FG_Brand", width: 70 },
    { headerName: "Material Code", field: "Material_Code" },
    { headerName: "Material Name", field: "Material_Name", minWidth: 330 },
    { headerName: "Material Group", field: "Material_Group", minWidth: 300 },
    { headerName: "Supplier name", field: "Supplier_Name", minWidth: 300 },
    { headerName: "Supplier Region", field: "Supplier_Region", minWidth: 90 },
    { headerName: "Material Volume", field: "Material_Volume", valueFormatter: valueFormatter, minWidth: 50, maxWidth: 120 },
    { headerName: "Material Inventory", field: "Material_Inventory", valueFormatter: valueFormatter, minWidth: 50 },
    { headerName: "CAGR Growth %", field: "cagr_Growth_Percent", maxWidth: 100, valueFormatter: perRoundValueFormatter, minWidth: 50 },
];

const defaultFinishedGoodBOMColDef = {

    sortable: false,
    resizable: true,
    maxWidth: 150
};
const FinishedGoodBOMGrid = () => {


    const finishedGoodBOM = useSelector((state) => state.regionalization.finishedGoodBOM)

    const finishedGoodsBomState = useSelector((state) => state.regionalization.finishedGoodBOMState)

    const finishGoodBOMGridRef = useRef();

    const date = new Date();
    const currentDate = `${date.getDate()}-${date.getMonth() + 1
        }-${date.getFullYear()}`;

    const fileName = "Finished Goods- BOM"
    const params = {
        fileName: `${fileName}_${currentDate}`,
    };

    const finishGoodBOMGridDownload = () => {
        finishGoodBOMGridRef.current.api.exportDataAsCsv(params);
    };



    const onGridReady = (params) => {

        params.api.sizeColumnsToFit();
    }

    return (
        <ChartWrapper
            title="Finished Goods- BOM"
            className="grid-card"
            downloadType="grid"
            downloadCsv={finishGoodBOMGridDownload}
            cardLoading={finishedGoodsBomState === "pending"}
        >
            <div className="finished-good-grid">
                <AgGridReact
                    className="ag-theme-alpine"
                    rowData={finishedGoodBOM !== undefined && Object.keys(finishedGoodBOM)?.length > 0 ? finishedGoodBOM?.getFinishedGoodsBom : []}
                    columnDefs={finishedGoodsBOMColumnDefs}
                    defaultColDef={defaultFinishedGoodBOMColDef}
                    ref={finishGoodBOMGridRef}
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
export default FinishedGoodBOMGrid