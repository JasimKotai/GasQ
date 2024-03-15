import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  gasStation: null,
  user: null,
};
export const gasStationSlice = createSlice({
  name: 'gasStation',
  initialState,
  reducers: {
    addUserData: (state, {payload}) => {
      state.user = payload;
    },
    addGasStationList: (state, {payload}) => {
      state.gasStation = payload;
    },
    handleLogout: (state, {payload}) => {
      state.user = null;
      state.gasStation = null;
      console.log('logout success redux --');
    },
  },
});

export const {addUserData, addGasStationList, handleLogout} =
  gasStationSlice.actions;

export default gasStationSlice.reducer;
