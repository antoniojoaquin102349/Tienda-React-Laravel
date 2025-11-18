// store/authSlice.ts
import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import { Api } from "../services/Api";

interface IUser {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: IUser | null;
  islogin: boolean;
  isloading: boolean;
}

const tokenFromStorage = localStorage.getItem("token");

const initialState: AuthState = {
  token: tokenFromStorage,
  user: null,
  islogin: !!tokenFromStorage,
  isloading: false,
};

// Acción simple para login con Google (cuando viene el token en la URL)
export const setCredentials = createAction<{ token: string; user?: IUser }>(
  "auth/setCredentials"
);

// Acción para logout
export const logoutUser = createAction("auth/logout");

// Thunk para login normal
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await Api.post("/auth/login", data);
      if (response.statusCode === 200) {
        const { token, user } = response.data as { token: string; user: IUser };
        localStorage.setItem("token", token);
        return { token, user };
      }
      return rejectWithValue(response.data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Error de red" });
    }
  }
);

// Thunk para registrar usuario
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await Api.post("/auth/register", data);
      if (response.statusCode === 201) {
        const { token, user } = response.data as { token: string; user: IUser };
        localStorage.setItem("token", token);
        return { token, user };
      }
      return rejectWithValue(response.data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Error al registrar" });
    }
  }
);

// Thunk opcional para verificar token al iniciar la app
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.token) {
      try {
        const response = await Api.get("/me"); // Ajusta endpoint según tu backend
        return response.data.user;
      } catch {
        localStorage.removeItem("token");
        dispatch(logoutUser());
        throw new Error("Token inválido");
      }
    }
    throw new Error("No hay token");
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Login normal ===
      .addCase(loginUser.pending, (state) => {
        state.isloading = true;
      })
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
      .addCase(registerUser.pending, (state) => {
        state.isloading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isloading = false;
        state.islogin = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isloading = false;
      })

      // === Login con Google ===
      .addCase(setCredentials, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token); // Guardar token
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
        localStorage.removeItem("token");
      })

      // === Check Auth al cargar la app ===
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.islogin = true;
        state.isloading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.islogin = false;
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
