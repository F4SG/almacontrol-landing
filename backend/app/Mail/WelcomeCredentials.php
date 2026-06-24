<?php

namespace App\Mail;

use App\Models\Usuario;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeCredentials extends Mailable
{
    use Queueable, SerializesModels;

    public $usuario;
    public $passwordPlain;
    public $loginUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Usuario $usuario, $passwordPlain)
    {
        $this->usuario = $usuario;
        $this->passwordPlain = $passwordPlain;
        // Asumiendo que la aplicación React de WMS está en la raíz de almacontrol.shop
        // o si es api.almacontrol.shop, usa esa URL. Ajustar según necesidad.
        $this->loginUrl = 'https://almacontrol.shop/login'; 
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bienvenido a AlmaControl - Tus credenciales de acceso',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome_credentials',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
