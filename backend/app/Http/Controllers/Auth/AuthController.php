<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\User;
use Exception;




class AuthController extends Controller
{
    public function register(RegisterRequest $request){

        // Crear usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
           
        ]);

        $token = JWTAuth::fromUser($user);
        return response()->json(compact('user','token'),201);
    }  

    // Login con email/password
    public function login(LoginRequest $request){
        $credentials = $request->only('email','password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales erroneas'],401);
        }

        $user = auth('api')->user();
        return response()->json(compact('user', 'token'), 200);
    }

    // 1. Redirigir a Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->stateless()  // obligatorio con JWT
            ->redirect();
    }

    // 2. Callback de Google → devuelve JWT al frontend
    public function handleGoogleCallback()
    {
        try {
            // Obtenemos los datos del usuario de Google
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Buscamos o creamos el usuario en nuestra base de datos
            $user = User::updateOrCreate(
                ['email' => $googleUser->email],
                [
                    'name' => $googleUser->name ?? 'Usuario Google',
                    'google_id' => $googleUser->id,
                    'email_verified_at' => now(),
                    'password' => bcrypt(str()->random(16)), // contraseña aleatoria (nunca se usa)
                ]
            );

            // Generar el mismo JWT que usas en login normal
            $token = JWTAuth::fromUser($user);

            // Redirigir al frontend con el token en la URL (método simple y seguro con JWT)
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("{$frontendUrl}/login?token={$token}");
            

        } catch (Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("{$frontendUrl}/login?error=google_failed");
        }
    }

    // Opcional: Logout
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
