import { useRef } from "react";
import ChartWrapper from "../../../../../wrapper/ChartWrapper";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import { numberConversion } from "../../../../../app-utils/AppUtils";
import { perPage } from "../../../../../../variables";

const valueFormatter = (params) => {
    return params.value ? `${numberConversion(params.value)}` : ""
}

const columnDefs = [
    { headerName: "Item Id", field: "itemId", maxWidth: 110 },
    { headerName: "Item Description", field: "itemDes", width: 300, maxWidth: 400 },
    { headerName: "Major Category", field: "majorCategory" },
    { headerName: "Priority Sub-Category", field: "prioritySubCat", maxWidth: 250 },
    { headerName: "Brand", field: "brand", maxWidth: 250 },
    { headerName: "Major Inventory Type", field: "majorInvType" },
    { headerName: "Sub Inventory Type", field: "subInvType" },
    { headerName: "Plant Name", field: "plantName", maxWidth: 400 },
    { headerName: "Resource", field: "resource" },
    { headerName: "Production Qty.", field: "productQty", valueFormatter: valueFormatter },
];


const defaultColDef = {
    maxWidth: 150,
    sortable: false,
    filter: false,
    resizable: true,

};

const ManlocGrid = () => {

    const manlockGrid = useSelector((state) => state.make.manlocGridData)

    const manlocGridState = useSelector((state) => state.make.manlocGridDataState)

    const manlocGridRef = useRef();

    const date = new Date();
    const currentDate = `${date.getDate()}-${date.getMonth() + 1
        }-${date.getFullYear()}`;

    const fileName = "Manloc"
    const params = {
        fileName: `${fileName}_${currentDate}`,
    };

    const manlocGridDownload = () => {
        manlocGridRef.current.api.exportDataAsCsv(params);
    };


    return (
        <ChartWrapper
            type="nested"
            downloadType="grid"
            downloadCsv={manlocGridDownload}
            cardLoading={manlocGridState === "pending"}
        >
            <div className="manloc-grid">
                <AgGridReact
                    className="ag-theme-alpine"
                    rowData={manlockGrid}
                    columnDefs={columnDefs}
                    ref={manlocGridRef}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    animateRow={true}
                    paginationPageSize={perPage}
                    cacheBlockSize={perPage}


                />
            </div>
        </ChartWrapper>

    )

}
export default ManlocGrid