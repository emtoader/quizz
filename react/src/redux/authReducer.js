import { createSlice } from '@reduxjs/toolkit'

const refreshToken = localStorage.getItem("refreshToken");
const authName = localStorage.getItem("authName");


const initialState = (refreshToken !== null)
  ? { refreshToken: refreshToken, name: authName }
  : { refreshToken: '', name: '' };

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {    
    setRefreshToken: (state, action) => {
      localStorage.setItem("refreshToken", action.payload);
      state.refreshToken = action.payload
    },
    setAuthName: (state, action) => {
        localStorage.setItem("authName", action.payload);
        state.name = action.payload
      },
  }
})

// Action creators are generated for each case reducer function
export const { setRefreshToken, setAuthName } = authSlice.actions

export default authSlice.reducer