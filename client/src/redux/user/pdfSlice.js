import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pdfs: [],
  loading: false,
  error: false,
};

const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    fetchPdfsStart: (state) => {
      state.loading = true;
    },
    fetchPdfsSuccess: (state, action) => {
      state.pdfs = action.payload;
      state.loading = false;
      state.error = false;
    },
    fetchPdfsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchPdfsFailure, fetchPdfsStart, fetchPdfsSuccess} = pdfSlice.actions;
export default pdfSlice.reducer;