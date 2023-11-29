import { createSlice } from "@reduxjs/toolkit";

export const planAffaireSlice = createSlice({
  name: 'planAffaire',
  initialState: {
    planAffaire: null,
  },
  reducers: {
    setPlanAffaire: (state, action) => {
        state.planAffaire = action.payload
    },
  },
})

export const { setPlanAffaire } = planAffaireSlice.actions

export default planAffaireSlice.reducer