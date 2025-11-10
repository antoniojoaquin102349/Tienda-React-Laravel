import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={loginWithGoogle}
        className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
};

export default Login;
