// store/authSlice.ts
import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUser, AuthState } from "../types";
import { Api } from "../services/Api";


// ===============================================
// Estado inicial basado en localStorage
// ===============================================
const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = localStorage.getItem("user");

const initialState: AuthState = {
  token: tokenFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  islogin: !!tokenFromStorage,
  isloading: false,
};

// ===============================================
// ACCIONES SIMPLES
// ===============================================
export const setCredentials = createAction<{ token: string; user?: IUser }>("auth/setCredentials");
export const logoutUser = createAction("auth/logout");

// ===============================================
// THUNKS ASÍNCRONOS
// ===============================================

// Login normal
export const loginUser = createAsyncThunk<
  { token: string; user: IUser },
  { email: string; password: string },
  { rejectValue: any }
>("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    const response = await Api.post("/auth/login", data);
    if (response.statusCode === 200) {
      const { token, user } = response.data as { token: string; user: IUser };
      return { token, user };
    }
    return rejectWithValue(response.data);
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Error de red" });
  }
});

// Registro de usuario
export const registerUser = createAsyncThunk<
  { token: string; user: IUser },
  { name: string; email: string; password: string },
  { rejectValue: any }
>("auth/registerUser", async (data, { rejectWithValue }) => {
  try {
    const response = await Api.post("/auth/register", data);
    if (response.statusCode === 201) {
      const { token, user } = response.data as { token: string; user: IUser };
      return { token, user };
    }
    return rejectWithValue(response.data);
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Error al registrar" });
  }
});

// Verificar token al iniciar la app
export const checkAuth = createAsyncThunk<IUser, void, { rejectValue: any }>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue({ message: "No hay token" });

    try {
      const response = await Api.get<{ user: IUser }>("/me");
      if (response.statusCode === 200 && response.data?.user) {
        return response.data.user;
      }
      return rejectWithValue({ message: "Token inválido" });
    } catch {
      return rejectWithValue({ message: "Error al verificar token" });
    }
  }
);

// ===============================================
// SLICE
// ===============================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Login ===
      .addCase(loginUser.pending, (state) => { state.isloading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isloading = false;
        state.islogin = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isloading = false;
        state.islogin = false;
        state.token = null;
        state.user = null;
      })

      // === Register ===
      .addCase(registerUser.pending, (state) => { state.isloading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isloading = false;
        state.islogin = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state) => { state.isloading = false; })

      // === Set Credentials (Google login) ===
      .addCase(setCredentials, (state, action: PayloadAction<{ token: string; user?: IUser }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        state.islogin = true;
        state.isloading = false;
      })

      // === Logout ===
      .addCase(logoutUser, (state) => {
        state.token = null;
        state.user = null;
        state.islogin = false;
        state.isloading = false;
      })

      // === Check Auth ===
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.islogin = true;
        state.isloading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.islogin = false;
        state.isloading = false;
      });
  },
});

export default authSlice.reducer;
