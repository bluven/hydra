import { configureStore, combineReducers, Tuple } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
import { thunk as reduxThunk } from "redux-thunk";
import reduxPromise from "redux-promise";
import global from "./modules/global";
import menu from "./modules/menu";
import tabs from "./modules/tabs";
import auth from "./modules/auth";
import breadcrumb from "./modules/breadcrumb";

// create reducer
const reducer = combineReducers({
	global,
	menu,
	tabs,
	auth,
	breadcrumb
});

// redux persist
const persistConfig = {
	key: "redux-state",
	storage: storage
};
const persistReducerConfig = persistReducer(persistConfig, reducer);

// store
export const store = configureStore({
	reducer: persistReducerConfig,
	middleware: () => new Tuple(reduxThunk, reduxPromise),
	devTools: true
});

// create persist store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
