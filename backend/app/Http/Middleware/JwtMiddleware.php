<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['status' => 'User not found'], 404);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['status' => 'Token expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['status' => 'Token invalid'], 401);
        } catch (JWTException $e) {
            return response()->json(['status' => 'Token not provided'], 401);
        }

        return $next($request);
    }
}
