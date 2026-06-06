// third party
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector, TypedUseSelectorHook } from 'react-redux';

// import { persistStore } from 'redux-persist';

// project imports
import rootReducer, { reducerManager } from './reducer';
import type { InjectableState } from './injectable';
import DevTools from './DevTools';

// ==============================|| REDUX - MAIN STORE ||============================== //

const baseStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
  devTools: false,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(DevTools.instrument())
});

// Expose the reducer manager on the store so feature code (useInjectReducer)
// can register / unregister slices at runtime.
const store = Object.assign(baseStore, { reducerManager });

// redux-persist is currently disabled (PersistGate is commented out in
// ProviderWrapper). Left here, commented, for when persistence is re-enabled —
// note that dynamically-injected slices would need their own persist handling.
// const persister = persistStore(store);

// At runtime only `snackbar` is wired statically; feature slices are injected
// on demand. For typing, though, we still want selectors like
// `(s) => s.javascript` to be safe, so RootState describes the *full* shape the
// app can have — static slices plus every injectable feature slice. Decoupling
// the type (compile-time contract) from the wiring (runtime/bundle) is the
// whole point: the type says "this branch exists when you read it", and
// useInjectReducer guarantees it does before the selector runs.
type StaticState = ReturnType<typeof rootReducer>;

type RootState = StaticState & InjectableState;

type AppDispatch = typeof store.dispatch;

const { dispatch } = store;

function useDispatch() {
  return useAppDispatch<AppDispatch>();
}

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export { store, dispatch, useSelector, useDispatch };
export type { RootState, AppDispatch };
