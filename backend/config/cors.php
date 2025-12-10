<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Rutas que permiten CORS
    |--------------------------------------------------------------------------
    */
    'paths' => ['api/*'],

    /*
    | Métodos HTTP permitidos
    */
    'allowed_methods' => ['*'],

    /*
    | Orígenes permitidos
    */
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    /*
    | Cabeceras permitidas
    */
    'allowed_headers' => ['*'],

    /*
    | Cabeceras expuestas
    */
    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
