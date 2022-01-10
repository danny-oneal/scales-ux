import { createSlice } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "./index";
import { authSelector, authorizationHeader } from "./auth";

interface InitialState {
  loadingRings: boolean;
  hasErrors: boolean;
  rings: any;
}

export const initialState: InitialState = {
  loadingRings: true,
  hasErrors: false,
  rings: null,
};

// A slice for rings with our three reducers
const ringsSlice = createSlice({
  name: "rings",
  initialState,
  reducers: {
    getRings: (state) => {
      state.loadingRings = true;
    },
    getRingsSuccess: (state, { payload }) => {
      state.rings = payload;
      state.loadingRings = false;
      state.hasErrors = false;
    },
    getRingsFailure: (state) => {
      state.loadingRings = false;
      state.hasErrors = true;
    },
  },
});

// Three actions generated from the slice
export const { getRings, getRingsSuccess, getRingsFailure } =
  ringsSlice.actions;

// Selectors
export const ringsSelector = (state: RootState) => state.rings;

// The reducer
export default ringsSlice.reducer;

export function fetchRings() {
  return async (dispatch: AppDispatch, getState) => {
    const { token } = authSelector(getState());
    const authHeader = authorizationHeader(token);

    dispatch(getRings());

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BFF_API_ENDPOINT_URL}/rings`,
        {
          headers: {
            ...authHeader,
          },
        }
      );
      const { data } = await response.json();

      dispatch(getRingsSuccess(data.rings));
    } catch (error) {
      console.log(error);
      dispatch(getRingsFailure());
    }
  };
}
