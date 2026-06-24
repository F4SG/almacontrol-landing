<!DOCTYPE html>
<html>
<head>
    <title>Bienvenido a AlmaControl</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>¡Hola, {{ $usuario->nombre }}! 👋</h2>
    <p>Gracias por registrarte en <strong>AlmaControl</strong>. Tu cuenta ha sido aprobada y configurada con el rol de Administrador, por lo que tienes acceso total al sistema y podrás crear cuentas para tus encargados y vendedores.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Tus credenciales de acceso:</h3>
        <p><strong>Correo electrónico:</strong> {{ $usuario->correo }}</p>
        <p><strong>Contraseña temporal:</strong> <span style="font-family: monospace; background: #e9ecef; padding: 2px 6px; border-radius: 3px;">{{ $passwordPlain }}</span></p>
    </div>

    <p>Puedes iniciar sesión haciendo clic en el siguiente enlace:</p>
    <p>
        <a href="{{ $loginUrl ?? 'https://almacontrol.shop/login' }}" style="display: inline-block; background-color: #2b7a78; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Iniciar Sesión en AlmaControl</a>
    </p>

    <div style="margin-top: 30px; padding: 15px; border-left: 4px solid #f39c12; background-color: #fdfae6;">
        <strong>Nota importante sobre tu contraseña:</strong><br>
        Esta contraseña aleatoria es temporal. <strong>Una vez que inicies sesión por primera vez, tu contraseña cambiará automáticamente a <code>password</code></strong> para tus futuros ingresos.
    </div>
    
    <p style="margin-top: 20px;">
        <em>Si tienes alguna duda, no dudes en responder este correo.</em>
    </p>
</body>
</html>
