<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        // Forzar JSON en todas las rutas de API
        if ($request->is('api/*')) {
            if ($exception instanceof TokenExpiredException) {
                return response()->json(['status' => 'Token is expired'], 401);
            }
            if ($exception instanceof TokenInvalidException) {
                return response()->json(['status' => 'Token is invalid'], 401);
            }
            if ($exception instanceof JWTException) {
                return response()->json(['status' => 'Authorization Token not found'], 401);
            }

            // Otros errores de API
            return response()->json([
                'status' => 'Internal Server Error',
                'message' => $exception->getMessage(),
            ], 500);
        }

        return parent::render($request, $exception);
    }
}
