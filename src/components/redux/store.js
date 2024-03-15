import {configureStore} from '@reduxjs/toolkit';
import gasStationSlice from './gasStationSlice';

export const store = configureStore({
  reducer: {
    gasStation: gasStationSlice,
  },
});
