import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getE2ECardData } from "./E2ECardApi";

export const fetchE2ECard = createAsyncThunk(
  "e2eCard/fetchE2ECard",
  async (globalFilter) => {
    const response = await getE2ECardData(globalFilter);
   
    return response.data;
  }
);

const e2eCardSlice = createSlice({
  name: "e2eCard",
  initialState: {
    e2eCardData:[],
    e2eCardState:"idle",
    error: null,
  },

  extraReducers: {
    [fetchE2ECard.pending]: (state, { payload }) => {
      state.e2eCardState="pending"
    },
    [fetchE2ECard.fulfilled]: (state, action) => {
    state.e2eCardData = action.payload;
     state.e2eCardState="fulfilled"
   
    },
    [fetchE2ECard.rejected]: (state, { payload }) => {
      state.e2eCardState="rejected"
    },
  },
});


export default e2eCardSlice.reducer;
