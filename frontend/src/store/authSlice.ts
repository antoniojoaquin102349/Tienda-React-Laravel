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
const userFromStorage = localStorage.getItem("user");

const initialState: AuthState = {
  token: tokenFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
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
        localStorage.setItem("user", JSON.stringify(user));
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
        localStorage.setItem("user", JSON.stringify(user));
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
    if (!state.auth.token) throw new Error("No hay token");

    try {
      const response = await Api.get<{ user: IUser }>("/me");

      if (response.statusCode === 200 && response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
      }

      throw new Error("Respuesta inválida");
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logoutUser());
      throw new Error("Token inválido o expirado");
    }
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
        localStorage.setItem("token", action.payload.token);
        if (action.payload.user) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
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
        localStorage.removeItem("user");
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
