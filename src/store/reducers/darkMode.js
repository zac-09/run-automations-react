import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    backgroundColor: '#f4f2f2',
    color: 'black'
}

const styleSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        darkModeOn(state, action) {
            state.backgroundColor = action.payload.backgroundColor;
            state.color = action.payload.color;
        }
    }
})

export const { darkModeOn } = styleSlice.actions

export default styleSlice.reducer