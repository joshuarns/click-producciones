<?php
// Recibe el formulario de cotización y envía dos correos:
//   1. Notificación a ventas con los datos de la solicitud.
//   2. Confirmación al cliente.
// Las plantillas están en plantillas-correo.php.
// Corre en el hosting (cPanel); en `npm run dev` no se ejecuta PHP.

const DESTINO = 'ventas@clickproducciones.mx';
const REMITENTE = 'no-reply@clickproducciones.mx'; // debe ser del mismo dominio para no caer en spam
const LIMITE_POR_HORA = 5; // envíos permitidos por IP

const SITIO = [
  'correo' => DESTINO,
  'telefono' => '81 1774 0778',
  'whatsapp' => 'https://wa.me/528117740778',
  'ubicacion' => 'Monterrey, Nuevo León',
];

// Nunca mostrar advertencias de PHP: romperían el JSON y exponen rutas del servidor.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('America/Monterrey');

define('CLICK_FORM', true);
require __DIR__ . '/plantillas-correo.php';

function responder($ok, $mensaje = '', $codigo = 200) {
  http_response_code($codigo);
  echo json_encode(['ok' => $ok, 'message' => $mensaje]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  responder(false, 'Método no permitido.', 405);
}

// Campo trampa: los humanos no lo ven, los bots lo llenan.
if (!empty($_POST['website'])) {
  responder(true);
}

// Límite de envíos por IP para evitar abusos.
function excede_limite() {
  $archivo = sys_get_temp_dir() . '/click-form-' . md5($_SERVER['REMOTE_ADDR'] ?? '') . '.json';
  $ahora = time();
  $envios = is_file($archivo) ? (json_decode((string) @file_get_contents($archivo), true) ?: []) : [];
  $envios = array_values(array_filter($envios, fn($t) => $t > $ahora - 3600));
  if (count($envios) >= LIMITE_POR_HORA) return true;
  $envios[] = $ahora;
  @file_put_contents($archivo, json_encode($envios));
  return false;
}

function campo($nombre, $max = 200) {
  $valor = trim((string) ($_POST[$nombre] ?? ''));
  return mb_substr($valor, 0, $max);
}

// Quita saltos de línea para que no se puedan inyectar cabeceras.
function linea($texto) {
  return trim(preg_replace('/[\r\n]+/', ' ', $texto));
}

function fecha_es($ts) {
  $meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return date('j', $ts) . ' de ' . $meses[date('n', $ts) - 1] . ' de ' . date('Y', $ts) . ', ' . date('H:i', $ts) . ' h';
}

// Dominio del sitio para enlaces y el logo del correo.
function datos_sitio() {
  $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
  if (!preg_match('/^[a-z0-9.-]+(:\d+)?$/', $host)) $host = 'clickproducciones.mx';
  $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
  return SITIO + ['dominio' => $host, 'url' => ($https ? 'https://' : 'http://') . $host];
}

function cabecera($texto) {
  return mb_encode_mimeheader($texto, 'UTF-8', 'B', "\r\n");
}

// Envía un correo con versión HTML y texto plano.
function enviar($para, $asunto, $html, $texto, $responderA) {
  $limite = 'click-' . bin2hex(random_bytes(12));
  $cabeceras = implode("\r\n", [
    'From: ' . cabecera('Click Producciones') . ' <' . REMITENTE . '>',
    'Reply-To: ' . $responderA,
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $limite . '"',
  ]);
  $cuerpo = implode("\r\n", [
    '--' . $limite,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    chunk_split(base64_encode($texto)),
    '--' . $limite,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    chunk_split(base64_encode($html)),
    '--' . $limite . '--',
  ]);
  return mail($para, cabecera($asunto), $cuerpo, $cabeceras, '-f' . REMITENTE);
}

$datos = [
  'nombre' => linea(campo('nombre')),
  'empresa' => linea(campo('empresa')),
  'correo' => linea(campo('correo')),
  'telefono' => linea(campo('telefono', 40)),
  'servicio' => linea(campo('servicio')),
  'mensaje' => campo('mensaje', 5000),
];

if ($datos['nombre'] === '' || $datos['mensaje'] === '' || !filter_var($datos['correo'], FILTER_VALIDATE_EMAIL)) {
  responder(false, 'Revisa tu nombre, correo y mensaje.', 422);
}

if (excede_limite()) {
  responder(false, 'Recibimos varias solicitudes desde tu conexión.', 429);
}

$ahora = time();
$datos['_fecha'] = e(fecha_es($ahora));
$datos['_fecha_txt'] = fecha_es($ahora);
$datos['_nombre'] = e($datos['nombre']);
$sitio = datos_sitio();

// 1. Notificación a ventas (si falla, se avisa al usuario).
[$html, $texto] = correo_notificacion($datos, $sitio);
$asunto = 'Nueva cotización: ' . $datos['nombre'] . ($datos['empresa'] !== '' ? " · {$datos['empresa']}" : '');
$cliente = cabecera($datos['nombre']) . ' <' . $datos['correo'] . '>';

if (!enviar(DESTINO, $asunto, $html, $texto, $cliente)) {
  responder(false, 'No se pudo enviar el mensaje.', 500);
}

// 2. Confirmación al cliente (si falla, la solicitud ya llegó a ventas).
[$html, $texto] = correo_confirmacion($datos, $sitio);
enviar($datos['correo'], 'Recibimos tu solicitud — Click Producciones', $html, $texto, DESTINO);

responder(true);
