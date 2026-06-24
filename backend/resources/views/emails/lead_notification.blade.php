<!DOCTYPE html>
<html>
<head>
    <title>Nuevo Lead - AlmaControl</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>¡Tienes un nuevo cliente potencial! 🎉</h2>
    <p>Alguien se ha registrado en la página principal para solicitar acceso a AlmaControl.</p>
    
    <table style="border-collapse: collapse; width: 100%; max-width: 500px; margin-top: 20px;">
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Nombre:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $lead->nombre }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Correo:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $lead->correo }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Empresa:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $lead->empresa }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Tamaño:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $lead->tamano_empresa }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Fecha:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $lead->created_at }}</td>
        </tr>
    </table>

    <div style="margin-top: 30px; text-align: center;">
        <a href="{{ url('/api/leads/' . $lead->id_lead . '/approve') }}" style="background-color: #2b7a78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Aprobar Cliente y Enviar Credenciales
        </a>
    </div>

    <p style="margin-top: 30px;">
        <em>Este es un correo automático generado por AlmaControl.</em>
    </p>
</body>
</html>
