import { configureStore } from '@reduxjs/toolkit'
import planAffaireReducer from './planAffaireSlice';


export default configureStore({
  reducer: {
    planAffaire : planAffaireReducer
  },
});