<?php
// Plantillas de correo del formulario de cotización. Las usa enviar.php.
// HTML con tablas y estilos en línea para que se vea bien en Gmail, Outlook y Apple Mail.

if (!defined('CLICK_FORM')) {
  http_response_code(404);
  exit;
}

const C_ROJO = '#ff0003';
const C_TINTA = '#0c0c0d';
const C_TEXTO = '#1d1d20';
const C_GRIS = '#6b6964';
const C_FONDO = '#f3f1ec';
const C_LINEA = '#e6e3dc';
const COLORES = ['rojo' => C_ROJO, 'tinta' => C_TINTA, 'texto' => C_TEXTO, 'gris' => C_GRIS, 'fondo' => C_FONDO, 'linea' => C_LINEA];

function e($texto) {
  return htmlspecialchars((string) $texto, ENT_QUOTES, 'UTF-8');
}

// Estructura común: encabezado oscuro con logo, contenido blanco y pie.
function layout_correo($sitio, $preheader, $contenido, $pie) {
  $c = COLORES;
  $logo = e($sitio['url'] . '/email/logo.png');
  $fuente = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

  return <<<HTML
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>Click Producciones</title>
</head>
<body style="margin:0;padding:0;background:{$c['fondo']};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{$preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{$c['fondo']};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;{$fuente};">
      <tr><td style="background:{$c['tinta']};border-radius:16px 16px 0 0;padding:28px 36px;">
        <img src="{$logo}" width="150" height="45" alt="Click Producciones" style="display:block;border:0;width:150px;height:auto;">
      </td></tr>
      <tr><td style="background:{$c['rojo']};height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>
      <tr><td style="background:#ffffff;padding:36px;color:{$c['texto']};font-size:16px;line-height:1.6;">
        {$contenido}
      </td></tr>
      <tr><td style="background:#ffffff;border-top:1px solid {$c['linea']};border-radius:0 0 16px 16px;padding:20px 36px;color:{$c['gris']};font-size:13px;line-height:1.6;">
        {$pie}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
HTML;
}

function boton($url, $texto, $relleno = true) {
  $estilo = $relleno
    ? 'background:' . C_ROJO . ';color:#ffffff;border:2px solid ' . C_ROJO . ';'
    : 'background:#ffffff;color:' . C_TINTA . ';border:2px solid ' . C_TINTA . ';';
  return '<a href="' . e($url) . '" style="display:inline-block;' . $estilo
    . 'border-radius:999px;padding:12px 24px;font-size:15px;font-weight:600;text-decoration:none;margin:0 8px 8px 0;">'
    . e($texto) . '</a>';
}

function fila_dato($etiqueta, $valor) {
  return '<tr>'
    . '<td style="padding:10px 0;border-bottom:1px solid ' . C_LINEA . ';width:120px;vertical-align:top;'
    . 'font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:' . C_GRIS . ';">' . e($etiqueta) . '</td>'
    . '<td style="padding:10px 0;border-bottom:1px solid ' . C_LINEA . ';font-size:16px;font-weight:600;color:' . C_TEXTO . ';word-break:break-word;">'
    . $valor . '</td>'
    . '</tr>';
}

function link_whatsapp($telefono) {
  $digitos = preg_replace('/\D+/', '', $telefono);
  if (strlen($digitos) === 10) $digitos = '52' . $digitos; // número mexicano sin lada de país
  return strlen($digitos) >= 11 ? 'https://wa.me/' . $digitos : '';
}

/* ---------- Correo para ventas: nueva solicitud ---------- */

function correo_notificacion($d, $sitio) {
  $c = COLORES;
  $asuntoRespuesta = 'Cotización Click Producciones — ' . ($d['empresa'] ?: $d['nombre']);
  $mailto = 'mailto:' . $d['correo'] . '?subject=' . rawurlencode($asuntoRespuesta);
  $wa = $d['telefono'] ? link_whatsapp($d['telefono']) : '';

  $filas = fila_dato('Nombre', e($d['nombre']))
    . fila_dato('Empresa', e($d['empresa'] ?: '—'))
    . fila_dato('Correo', '<a href="mailto:' . e($d['correo']) . '" style="color:' . C_ROJO . ';text-decoration:none;">' . e($d['correo']) . '</a>')
    . fila_dato('Teléfono', $d['telefono']
      ? '<a href="tel:' . e(preg_replace('/[^\d+]/', '', $d['telefono'])) . '" style="color:' . C_ROJO . ';text-decoration:none;">' . e($d['telefono']) . '</a>'
      : '—')
    . fila_dato('Servicio', e($d['servicio'] ?: 'No especificado'));

  $mensaje = nl2br(e($d['mensaje']));
  $botones = boton($mailto, 'Responder por correo') . ($wa ? boton($wa, 'Escribir por WhatsApp', false) : '');

  $contenido = <<<HTML
<p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:{$c['rojo']};font-weight:600;">Nueva solicitud de cotización</p>
<h1 style="margin:0 0 4px;font-size:26px;line-height:1.2;color:{$c['tinta']};">{$d['_nombre']}</h1>
<p style="margin:0 0 24px;color:{$c['gris']};font-size:14px;">Recibida el {$d['_fecha']}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{$filas}</table>
<p style="margin:28px 0 8px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:{$c['gris']};">Mensaje</p>
<div style="background:{$c['fondo']};border-left:4px solid {$c['rojo']};border-radius:0 10px 10px 0;padding:16px 20px;font-size:16px;line-height:1.6;color:{$c['texto']};">{$mensaje}</div>
<div style="margin-top:28px;">{$botones}</div>
HTML;

  $pie = 'Enviado desde el formulario de <a href="' . e($sitio['url']) . '" style="color:' . C_GRIS . ';">' . e($sitio['dominio']) . '</a>. '
    . 'Al responder este correo le contestas directamente a ' . e($d['nombre']) . '.';

  $html = layout_correo($sitio, 'Nueva solicitud de ' . e($d['nombre']) . ($d['empresa'] ? ' · ' . e($d['empresa']) : ''), $contenido, $pie);

  $texto = implode("\n", [
    'NUEVA SOLICITUD DE COTIZACIÓN',
    'Recibida el ' . $d['_fecha_txt'],
    '',
    'Nombre:    ' . $d['nombre'],
    'Empresa:   ' . ($d['empresa'] ?: '—'),
    'Correo:    ' . $d['correo'],
    'Teléfono:  ' . ($d['telefono'] ?: '—'),
    'Servicio:  ' . ($d['servicio'] ?: 'No especificado'),
    '',
    'Mensaje:',
    $d['mensaje'],
    '',
    '—',
    'Enviado desde el formulario de ' . $sitio['dominio'],
  ]);

  return [$html, $texto];
}

/* ---------- Correo para el cliente: confirmación ---------- */

function correo_confirmacion($d, $sitio) {
  $c = COLORES;
  $primerNombre = e(explode(' ', $d['nombre'])[0]);
  $resumen = fila_dato('Servicio', e($d['servicio'] ?: 'Por definir'))
    . ($d['empresa'] ? fila_dato('Empresa', e($d['empresa'])) : '')
    . fila_dato('Fecha', $d['_fecha']);

  $botones = boton($sitio['whatsapp'], 'Escríbenos por WhatsApp') . boton($sitio['url'] . '/#portafolio', 'Ver portafolio', false);

  $contenido = <<<HTML
<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:{$c['tinta']};">¡Gracias, {$primerNombre}!</h1>
<p style="margin:0 0 16px;">Recibimos tu solicitud de cotización. Nuestro equipo la está revisando y te contactaremos a la brevedad con una propuesta a la medida de tu empresa.</p>
<p style="margin:28px 0 8px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:{$c['gris']};">Resumen de tu solicitud</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{$resumen}</table>
<div style="margin-top:32px;background:{$c['fondo']};border-radius:12px;padding:20px 24px;">
  <p style="margin:0 0 4px;font-weight:600;color:{$c['tinta']};">¿Necesitas una respuesta inmediata?</p>
  <p style="margin:0 0 16px;color:{$c['gris']};font-size:15px;">Escríbenos por WhatsApp al {$sitio['telefono']} o responde a este correo.</p>
  {$botones}
</div>
<p style="margin:32px 0 0;">Saludos,<br><strong>Equipo Click Producciones</strong><br><span style="color:{$c['gris']};font-size:14px;">Fotografía y video corporativo · Más de 15 años</span></p>
HTML;

  $pie = '<strong style="color:' . C_TEXTO . ';">Click Producciones</strong> · ' . e($sitio['ubicacion']) . '<br>'
    . '<a href="mailto:' . e($sitio['correo']) . '" style="color:' . C_GRIS . ';">' . e($sitio['correo']) . '</a> · '
    . '<a href="' . e($sitio['url']) . '" style="color:' . C_GRIS . ';">' . e($sitio['dominio']) . '</a><br><br>'
    . 'Recibes este correo porque solicitaste una cotización en nuestro sitio. Si no fuiste tú, puedes ignorarlo.';

  $html = layout_correo($sitio, 'Recibimos tu solicitud y te contactaremos a la brevedad.', $contenido, $pie);

  $texto = implode("\n", array_filter([
    '¡Gracias, ' . explode(' ', $d['nombre'])[0] . '!',
    '',
    'Recibimos tu solicitud de cotización. Nuestro equipo la está revisando y te contactaremos',
    'a la brevedad con una propuesta a la medida de tu empresa.',
    '',
    'RESUMEN',
    'Servicio: ' . ($d['servicio'] ?: 'Por definir'),
    $d['empresa'] ? 'Empresa:  ' . $d['empresa'] : null,
    'Fecha:    ' . $d['_fecha_txt'],
    '',
    '¿Necesitas una respuesta inmediata? Escríbenos por WhatsApp al ' . $sitio['telefono'],
    $sitio['whatsapp'],
    '',
    'Saludos,',
    'Equipo Click Producciones',
    $sitio['correo'] . ' · ' . $sitio['url'],
  ], fn($linea) => $linea !== null));

  return [$html, $texto];
}
