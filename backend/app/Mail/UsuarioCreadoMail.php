<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UsuarioCreadoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $usuario;
    public $password;

    public function __construct($usuario, $password)
    {
        $this->usuario = $usuario;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject("Tu cuenta ha sido creada")
                    ->view("emails.usuario_creado")
                    ->with([
                        'usuario' => $this->usuario,
                        'password' => $this->password,
                    ]);
    }
}
