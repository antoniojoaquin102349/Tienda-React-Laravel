<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    /**
     * Lista de tipos de excepciones que no se reportan.
     */
    protected $dontReport = [];

    /**
     * Lista de inputs que no se muestran en los mensajes de validación.
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    protected function convertValidationExceptionToResponse(ValidationException $e, $request)
    {
    
        if ($e->response) {
            return $e->response;
        }
        return $this->invalidJson($request, $e);
    }


    public function invalidJson($request, ValidationException $e)
    {
        return response()->json([
            'message' => $e->getmessage(),
            'errors' => $e->errors(),
            ], $e->status);
    }
}
