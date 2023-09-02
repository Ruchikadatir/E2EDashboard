import { useRef } from "react";
import ChartWrapper from "../../../../../wrapper/ChartWrapper";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import { perPage } from "../../../../../../variables";


const columnDefs = [
    { headerName: "FG Code", field: "fGCode", maxWidth: 150 },
    {
        headerName: "FG Item Description",
        field: "fGItemDescription",
        maxWidth: 380,
    },
    { headerName: "Category", field: "category", maxWidth: 120 },
    { headerName: "Priority Subcat", field: "prioritySubcategory" },
    { headerName: "Brand", field: "brand", maxWidth: 100 },
    { headerName: "Plant Name", field: "plantName", maxWidth: 150 },
    { headerName: "Production Region", field: "productionRegion", maxWidth: 130 },
    { headerName: "Wt. Avg Make-Sale LT", field: "avgMakeSale" },
    { headerName: "Americas Make Units", field: "americaMakeUnits" },
    { headerName: "Europe Make Units", field: "europeMakeUnits", maxWidth: 120 },
    { headerName: "Asia Make Units", field: "asiaMakeUnits", maxWidth: 120 },
    { headerName: "Total Make Units", field: "TotalSaleUnits", maxWidth: 120 },
    { headerName: "Reg %", field: "reg_%", maxWidth: 100 },
];
const defaultColDef = {
    maxWidth: 150,
    sortable: false,
    resizable: true,
    filter: false,
};

const RegionalizationByFinishedGoodGrid = ({ selectedDropdownFilterValue }) => {


    const finishedGood = useSelector((state) => state.regionalization.finishedGood)
    const finishedGoodState = useSelector((state) => state.regionalization.finishedGoodState)

    const regionalizationByFinishedGoodRef = useRef();

    const date = new Date();
    const currentDate = `${date.getDate()}-${date.getMonth() + 1
        }-${date.getFullYear()}`;

    const fileName = "Regionalization By Finished Good"
    const params = {
        fileName: `${fileName}_${currentDate}`,
    };

    const regionalizationByFinishedGoodDownload = () => {
        regionalizationByFinishedGoodRef.current.api.exportDataAsCsv(params);
    };



    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    }

    return (
        <ChartWrapper
            type="source"
            title="Regionalization by Finished Good"
            className="grid-card"
            downloadType="grid"
            downloadCsv={regionalizationByFinishedGoodDownload}
            cardLoading={finishedGoodState === "pending"}
        >
            <div className="finished-good-grid">
                <AgGridReact
                    className="ag-theme-alpine"
                    rowData={finishedGood !== undefined && Object.keys(finishedGood)?.length > 0 ? finishedGood?.makeToSale[selectedDropdownFilterValue] : []}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    ref={regionalizationByFinishedGoodRef}
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
export default RegionalizationByFinishedGoodGrid;