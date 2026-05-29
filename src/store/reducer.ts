// third party
import { combineReducers } from 'redux';

// project imports
import snackbarReducer from './slices/snackbar';
import javascriptReducer from './slices/javascript';
import reactReducer from './slices/react';
import reduxReducer from './slices/redux';
import nextjsReducer from './slices/nextjs';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  snackbar: snackbarReducer,
  javascript: javascriptReducer,
  react: reactReducer,
  redux: reduxReducer,
  nextjs: nextjsReducer
});

export default reducer;
