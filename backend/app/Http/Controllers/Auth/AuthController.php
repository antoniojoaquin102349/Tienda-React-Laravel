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
    // ===========================
    // REGISTER NORMAL
    // ===========================
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    // ===========================
    // LOGIN NORMAL
    // ===========================
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        $user = auth('api')->user();

        return response()->json(compact('user', 'token'), 200);
    }

    // ===========================
    // LOGIN CON GOOGLE (REDIRECT)
    // ===========================
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    // ===========================
    // GOOGLE CALLBACK
    // ===========================
    public function handleGoogleCallback()
    {
        try {
            // Datos reales que llegan de Google
            $googleUser = Socialite::driver('google')->stateless()->user();

            $googleEmail = $googleUser->getEmail();
            $googleName  = $googleUser->getName();
            $googleId    = $googleUser->getId();

            // Crear o actualizar usuario SIN tocar contraseña normal
            $user = User::updateOrCreate(
                ['email' => $googleEmail],
                [
                    'name'              => $googleName,
                    'google_id'         => $googleId,
                    'email_verified_at' => now(),
                    'password'          => Hash::make(Str::random(32)), // random para no permitir login por password
                ]
            );

            // Generar JWT
            $token = JWTAuth::fromUser($user);

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

            return redirect("{$frontendUrl}/login?token={$token}");

        } catch (Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage());

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("{$frontendUrl}/login?error=google_failed");
        }
    }

    // ===========================
    // PERFIL / VALIDAR TOKEN
    // ===========================
    public function me(Request $request)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json(['status' => 'User not found'], 404);
        }

        return response()->json(['user' => $user], 200);

    } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
        return response()->json(['status' => 'Token expired'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['status' => 'Token invalid'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        return response()->json(['status' => 'Token not provided'], 401);
    }
}


    // ===========================
    // LOGOUT
    // ===========================
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
