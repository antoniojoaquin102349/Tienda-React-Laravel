import { useAppContext } from '../context/AppContext';

export const useAuth = () => {
  const { user, setUser } = useAppContext();

  const loginWithGoogle = async () => {
    // ejemplo simplificado: usar Google API OAuth o Firebase
    const token = await fakeGoogleLogin(); // función que retorna JWT
    const userData = { name: "Usuario", token };
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, loginWithGoogle, logout };
};
