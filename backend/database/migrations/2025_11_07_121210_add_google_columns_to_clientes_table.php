<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Cliente;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $cliente = Cliente::updateOrCreate(
                ['google_id' => $googleUser->getId()],
                [
                    'nombre' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                ]
            );

            $token = JWTAuth::fromUser($cliente);

            return response()->json([
                'token' => $token,
                'cliente' => $cliente,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en autenticación con Google', 'details' => $e->getMessage()], 500);
        }
    }
}
