import { createSlice } from '@reduxjs/toolkit';
import axios from "../axios";

const initialState = {
  organisation: null,
  loading: false,
  error: null,
};

const organisationSlice = createSlice({
  name: 'organisation',
  initialState,
  reducers: {
    setOrganisation(state, action) {
      console.log("Received organisation data:", action.payload);
      state.organisation = action.payload;
    },
    setLoading(state, action) {
      console.log("Setting loading state to:", action.payload);
      state.loading = action.payload;
    },
    setError(state, action) {
      console.log("Setting error:", action.payload);
      state.error = action.payload;
    },
  },
});

export const { setOrganisation, setLoading, setError } = organisationSlice.actions;

export const fetchOrganisation = () => async (dispatch) => {
  dispatch(setLoading(true)); // Here setLoading is used correctly
  try {
    const response = await axios.get('/organisations/'); // Adjust the URL
    const data = await response.data; // Assuming response is JSON data
    dispatch(setOrganisation(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
console.log(process.env.NODE_ENV);
export const getOrganisation = (state) => state.organisation.organisation;
export default organisationSlice.reducer;
