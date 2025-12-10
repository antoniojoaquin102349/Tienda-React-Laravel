import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import carritoReducer from "../slices/carritoSlice";
import storage from "redux-persist/lib/storage";
import authReducer from "../slices/authSlice";


// ===============================================
// 🔥 CONFIGURACIÓN DE PERSISTENCIA
// ===============================================
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "carrito"], // Solo persistimos auth y carrito
};

// ===============================================
// 🔥 COMBINACIÓN DE REDUCERS
// ===============================================
const rootReducer = combineReducers({
  auth: authReducer,
  carrito: carritoReducer,
});

// Reducer persistente
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ===============================================
// 🔥 CONFIGURACIÓN DEL STORE
// ===============================================
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Desactivamos serializableCheck porque redux-persist usa objetos no serializables
      serializableCheck: false,
    }),
});

// ===============================================
// 🔥 PERSISTOR
// ===============================================
export const persistor = persistStore(store);

// ===============================================
// 🔥 TIPOS Y HOOKS
// ===============================================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks tipados
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
