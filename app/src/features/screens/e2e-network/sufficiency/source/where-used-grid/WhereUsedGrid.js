import { useRef } from "react";
import ChartWrapper from "../../../../../wrapper/ChartWrapper";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import { numberConversion } from "../../../../../app-utils/AppUtils";
import { perPage } from "../../../../../../variables";

const valueFormatter = (params) => {
    return params.value ? `$${numberConversion(params.value)}` : ""
}
const roundValueFormatter = (params) => {
    return params.value ? Math.round(params.value) : ""
}
const perRoundValueFormatter = (params) => {
    return params.value ? `${Math.round(params.value)}%` : ""
}

const columnDefs = [
    { headerName: "Material", field: "material", maxWidth: 140 },
    { headerName: "Material Name", field: "materialName", width: 300, maxWidth: 400 },
    { headerName: "Material Group", field: "materialGroup" },
    { headerName: "Supplier Code", field: "supplierCode", maxWidth: 120 },
    { headerName: "Supplier Name", field: "supplierName", width: 300, maxWidth: 400 },
    { headerName: "Major Category", field: "majorCategory", maxWidth: 120 },
    { headerName: "Priority Subcat.", field: "prioritySubCat", maxWidth: 130 },
    { headerName: "Inventory Type", field: "inventoryType" },
    { headerName: "FG Code", field: "fgCode", maxWidth: 120 },
    { headerName: "FG Name", field: "fgName", width: 300, maxWidth: 400 },
    { headerName: "FG Brand", field: "fgBrand", maxWidth: 120 },
    { headerName: "Material Volume", field: "materialVolume", valueFormatter: roundValueFormatter, maxWidth: 120 },
    { headerName: "FG Consumption %", field: "fgConsumptionPer", valueFormatter: perRoundValueFormatter },
    { headerName: "FG $", field: "fg$", valueFormatter: valueFormatter, maxWidth: 70 },
    { headerName: "FY23-25 CAGR", field: "fy2225CAGR", valueFormatter: perRoundValueFormatter, maxWidth: 120 }, // update here fiscal year change
    { headerName: "Ing./Comp. Inventory", field: "inventory" },
];
const defaultColDef = {
    maxWidth: 150,
    sortable: false,
    resizable: true,
    filter: false,
};

const WhereUsedGrid = () => {


    const gridDataState = useSelector((state) => state.source.gridDataState)
    const whereUsed = useSelector((state) => state.source.gridData)

    const whereUsedGridRef = useRef();

    const date = new Date();
    const currentDate = `${date.getDate()}-${date.getMonth() + 1
        }-${date.getFullYear()}`;

    const fileName = "Where Used"
    const params = {
        fileName: `${fileName}_${currentDate}`,
    };

    const whereUsedGridDownload = () => {
        whereUsedGridRef.current.api.exportDataAsCsv(params);
    };





    return (
        <ChartWrapper
            type="source"
            title="Where Used"
            className="grid-card"
            downloadType="grid"
            downloadCsv={whereUsedGridDownload}
            cardLoading={gridDataState === "pending"}
        >
            <div className="where-used-grid">
                <AgGridReact
                    className="ag-theme-alpine"
                    columnDefs={columnDefs}
                    rowData={whereUsed?.length > 0 ? whereUsed : []}
                    defaultColDef={defaultColDef}
                    ref={whereUsedGridRef}
                    pagination={true}
                    animateRow={true}

                    paginationPageSize={perPage}
                    cacheBlockSize={perPage}


                />
            </div>
        </ChartWrapper>

    )

}
export default WhereUsedGrid