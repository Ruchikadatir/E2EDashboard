import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSufficiencyNudges, getResponsivenessNudges, getDemandScenarioNudges } from "./AlertNudgesApi"
const initialState = {
    source: {},
    make: {},
    leadtime: {},
    regionalization: {},
    demandScenario: {},
    nudgesSufficiencyState: "idle",
    responsivenessNudgesState: "idle",
    demandScenarioNudgesState: "idle"
};
export const fetchSufficiencyNudges = createAsyncThunk(
    "alertNudges/fetchSufficiencyNudges",
    async () => {
        const response = await getSufficiencyNudges();
        return response.data;
    }
);
export const fetchResponsivenessNudges = createAsyncThunk(
    "alertNudges/fetchResponsivenessNudges",
    async () => {
        const response = await getResponsivenessNudges();
        return response.data;
    }
);
export const fetchDemandScenarioNudges = createAsyncThunk(
    "alertNudges/fetchDemandScenarioNudges",
    async () => {
        const response = await getDemandScenarioNudges();
        return response.data;
    }
);
const alerNudgesSlice = createSlice({
    name: "alertNudges",
    initialState,
    extraReducers: {
        [fetchSufficiencyNudges.pending]: (state, { payload }) => {
            state.nudgesSufficiencyState = "pending";
        },
        [fetchSufficiencyNudges.fulfilled]: (state, action) => {
            state.source = action.payload.nudgeSourceValues;
            state.make = action.payload.nudgeMakeValues;
            state.nudgesSufficiencyState = "fulfilled";
        },
        [fetchSufficiencyNudges.rejected]: (state, action) => {
            state.nudgesSufficiencyState = "rejected";


        },
        [fetchResponsivenessNudges.pending]: (state, { payload }) => {
            state.responsivenessNudgesState = "pending";
        },
        [fetchResponsivenessNudges.fulfilled]: (state, action) => {
            state.leadtime = action.payload.nudgeLeadtimeValues;
            state.regionalization = action.payload.nudgeRegionalizationValues;
            state.responsivenessNudgesState = "fulfilled";
        },
        [fetchResponsivenessNudges.rejected]: (state, action) => {
            state.responsivenessNudgesState = "rejected";

        },
        [fetchDemandScenarioNudges.pending]: (state, { payload }) => {
            state.demandScenarioNudgesState = "pending";
        },
        [fetchDemandScenarioNudges.fulfilled]: (state, action) => {
            state.demandScenario = action.payload;
            state.demandScenarioNudgesState = "fulfilled";
        },
        [fetchDemandScenarioNudges.rejected]: (state, action) => {
            state.demandScenarioNudgesState = "rejected";

        },
    }
});

export default alerNudgesSlice.reducer;