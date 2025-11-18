import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { useDispatch } from "react-redux";
import storage  from "redux-persist/lib/storage";
import authSlice from "./authSlice";

//import  thunk  from "redux-thunk"; cuando importo el thunk me desaparece la vista

const persistConfig = {
    key: "root",
    storage,
};


const reducers = combineReducers ({
    auth: authSlice});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();