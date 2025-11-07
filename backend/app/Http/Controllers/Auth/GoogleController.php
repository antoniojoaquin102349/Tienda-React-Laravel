<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Cliente;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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

            $cliente = Cliente::where('google_id', $googleUser->getId())->first();

            if (!$cliente) {
                $cliente = Cliente::create([
                    'nombre' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'google_token' => $googleUser->token,
                    'password' => bcrypt(Str::random(16)),
                    'email_verified' => true,
                ]);
            }

            $token = Auth::guard('api')->login($cliente);

            return response()->json([
                'token' => $token,
                'cliente' => $cliente,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
