import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import {
  buscarProductoPorCodigo, getAlmacenes, registrarEntrada, registrarSalida,
} from '../services/api'
import Spinner from '../components/Spinner'
import {
  Camera, CameraOff, Scan, Package, ArrowDownCircle,
  ArrowUpCircle, CheckCircle, AlertTriangle, RotateCcw,
  Keyboard, X,
} from 'lucide-react'

const SUPPORTED_FORMATS = [
  'QR_CODE', 'EAN_13', 'EAN_8', 'CODE_128',
  'CODE_39', 'UPC_A', 'UPC_E', 'ITF', 'CODABAR',
]

// ── Estado de la sesión de escaneo ───────────────────────────────────────────
const STATES = {
  IDLE:      'IDLE',       // sin cámara
  SCANNING:  'SCANNING',   // cámara activa, buscando código
  FOUND:     'FOUND',      // producto encontrado
  NOTFOUND:  'NOTFOUND',   // código no reconocido
  REGISTERING: 'REGISTERING', // enviando movimiento
  SUCCESS:   'SUCCESS',    // movimiento registrado
  ERROR:     'ERROR',      // error del servidor
}

export default function Escaner() {
  const [state, setState]         = useState(STATES.IDLE)
  const [producto, setProducto]   = useState(null)
  const [stockInfo, setStockInfo] = useState([])
  const [almacenes, setAlmacenes] = useState([])
  const [form, setForm]           = useState({ id_almacen: '', cantidad: 1 })
  const [feedback, setFeedback]   = useState('')
  const [manualCode, setManualCode] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [cameraId, setCameraId]   = useState(null) // null = trasera
  const [cameras, setCameras]     = useState([])
  const [lastCode, setLastCode]   = useState('')

  const scannerRef = useRef(null)
  const domId      = 'qr-reader-viewport'

  // Cargar almacenes
  useEffect(() => {
    getAlmacenes().then(setAlmacenes).catch(() => {})
  }, [])

  // Buscar cámaras disponibles y pre-seleccionar la mejor (trasera si existe, sino la primera)
  useEffect(() => {
    Html5Qrcode.getCameras().then(cams => {
      setCameras(cams)
      if (cams.length > 0) {
        const backCam = cams.find(c => 
          c.label.toLowerCase().includes('back') || 
          c.label.toLowerCase().includes('environment') || 
          c.label.toLowerCase().includes('trasera') || 
          c.label.toLowerCase().includes('posterior')
        )
        setCameraId(backCam ? backCam.id : cams[0].id)
      }
    }).catch(() => {})
  }, [])

  const buscarProducto = useCallback(async (codigo) => {
    if (!codigo || codigo === lastCode) return
    setLastCode(codigo)
    try {
      const res = await buscarProductoPorCodigo(codigo)
      setProducto(res.producto)
      setStockInfo(res.stock_por_almacen ?? [])
      // Preseleccionar almacén si hay uno con stock
      const conStock = res.stock_por_almacen?.find(s => s.cantidad > 0)
      setForm({ id_almacen: conStock?.id_almacen ?? '', cantidad: 1 })
      setState(STATES.FOUND)
    } catch (err) {
      if (err?.message?.includes('no encontrado') || err?.status === 404) {
        setState(STATES.NOTFOUND)
        setFeedback(`Código "${codigo}" no registrado en el sistema`)
      } else {
        setState(STATES.ERROR)
        setFeedback(err?.message || 'Error de conexión con el servidor')
      }
    }
  }, [lastCode])

  // Utilidad para emitir un sonido "Beep" corto al escanear
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) { console.warn("AudioContext no soportado") }
  }

  const startScanner = useCallback(() => {
    if (scannerRef.current) return
    
    // 1. Mostrar el contenedor primero para que tenga dimensiones (no display: none)
    setState(STATES.SCANNING)

    // 2. Esperar a que React renderice el div visible antes de iniciar el escáner
    setTimeout(async () => {
      const scanner = new Html5Qrcode(domId)
      scannerRef.current = scanner

      const config = {
        fps: 30, 
        // No definimos qrbox para que escanee TODA la pantalla. 
        // Esto hace que sea 100x más fácil de apuntar.
        formatsToSupport: SUPPORTED_FORMATS,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      }

      // Forzar resolución HD (720p) para que los códigos de barras tengan nitidez
      const camConfig = cameraId
        ? { deviceId: { exact: cameraId }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }

      try {
        await scanner.start(
          camConfig,
          config,
          (decodedText) => {
            playBeep()
            buscarProducto(decodedText.trim())
          },
          () => {} // suppress errors during scanning
        )
      } catch (err) {
        console.error("Scanner Error:", err)
        setState(STATES.ERROR)
        setFeedback('No se pudo acceder a la cámara. Verifica los permisos de tu navegador.')
        scannerRef.current = null
      }
    }, 100)
  }, [cameraId, buscarProducto])

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop() } catch {}
      scannerRef.current = null
    }
    setState(STATES.IDLE)
    setLastCode('')
  }, [])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleRegistrar = async (tipo) => {
    if (!form.id_almacen || !form.cantidad || form.cantidad < 1) {
      setFeedback('Selecciona almacén y cantidad')
      return
    }
    setState(STATES.REGISTERING)
    try {
      const fn = tipo === 'ENTRADA' ? registrarEntrada : registrarSalida
      await fn({
        id_producto: producto.id_producto,
        id_almacen:  parseInt(form.id_almacen),
        cantidad:    parseInt(form.cantidad),
        observaciones: `Escáner — ${tipo}`,
      })
      setState(STATES.SUCCESS)
      setFeedback(`${tipo === 'ENTRADA' ? '✅ Entrada' : '✅ Salida'} registrada: ${producto.nombre}`)
      // Limpiar después de 3 seg y volver a escanear
      setTimeout(() => {
        setProducto(null)
        setStockInfo([])
        setLastCode('')
        setForm({ id_almacen: '', cantidad: 1 })
        setState(STATES.SCANNING)
      }, 3000)
    } catch (err) {
      setState(STATES.ERROR)
      setFeedback(err?.message || 'Error al registrar el movimiento')
    }
  }

  const reset = () => {
    setProducto(null)
    setStockInfo([])
    setLastCode('')
    setForm({ id_almacen: '', cantidad: 1 })
    setFeedback('')
    setState(state === STATES.IDLE ? STATES.IDLE : STATES.SCANNING)
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualCode.trim()) {
      setShowManual(false)
      buscarProducto(manualCode.trim())
      setManualCode('')
    }
  }

  const switchCamera = async () => {
    await stopScanner()
    const next = cameras.find(c => c.id !== cameraId)
    setCameraId(next?.id ?? null)
    setTimeout(() => startScanner(), 300)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const isScanning = state === STATES.SCANNING || state === STATES.FOUND ||
                     state === STATES.NOTFOUND  || state === STATES.REGISTERING ||
                     state === STATES.SUCCESS    || state === STATES.ERROR

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Escáner</h1>
          <p className="text-gray-500 text-sm mt-0.5">QR, EAN-13, CODE128 y más</p>
        </div>
        {isScanning && (
          <button
            onClick={stopScanner}
            className="inline-flex items-center gap-2 px-3 py-2 border-2 border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
          >
            <CameraOff className="w-4 h-4" /> Detener
          </button>
        )}
      </div>

      {/* Visor de cámara (siempre montado cuando el scanner está activo) */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gray-900 ${isScanning ? 'block' : 'hidden'}`}
        style={{ minHeight: 240 }}
      >
        <style>{`
          #qr-reader-viewport video {
            transform: none !important;
            object-fit: cover !important;
          }
        `}</style>

        <div id={domId} className="w-full" />

        {/* Overlay de mira */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-40 border-2 border-[#F59E0B] rounded-xl opacity-70">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#F59E0B] rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#F59E0B] rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#F59E0B] rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#F59E0B] rounded-br-xl" />
          </div>
        </div>

        {/* Botones sobre cámara */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          {cameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-xl backdrop-blur-sm transition-colors"
              title="Cambiar cámara"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowManual(true)}
            className="p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-xl backdrop-blur-sm transition-colors"
            title="Ingresar código manualmente"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>

        {state === STATES.SCANNING && (
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
            <p className="text-white text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Apunta al código
            </p>
          </div>
        )}
      </div>

      {/* Botón inicial */}
      {state === STATES.IDLE && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-5">
          <div className="w-20 h-20 bg-[#1B4332]/10 rounded-2xl flex items-center justify-center mx-auto">
            <Scan className="w-10 h-10 text-[#1B4332]" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">Escáner de productos</p>
            <p className="text-gray-500 text-sm mt-1">
              Activa la cámara para escanear códigos QR o de barras y registrar movimientos sin teclado
            </p>
          </div>
          <button
            onClick={startScanner}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#1B4332] text-white font-bold text-base rounded-2xl hover:bg-[#163829] transition-colors shadow-md"
          >
            <Camera className="w-5 h-5" /> Activar cámara
          </button>
          <button
            onClick={() => setShowManual(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <Keyboard className="w-4 h-4" /> Ingresar código manualmente
          </button>
        </div>
      )}

      {/* Modal código manual */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Ingresar código</h3>
              <button onClick={() => setShowManual(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                type="text"
                autoFocus
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="EAN, QR, código interno..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#1B4332]"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#163829]"
              >
                Buscar producto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Panel NOT FOUND */}
      {state === STATES.NOTFOUND && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-orange-500" />
          </div>
          <p className="font-bold text-gray-900">Código no encontrado</p>
          <p className="text-gray-500 text-sm">{feedback}</p>
          <p className="text-xs text-gray-400">
            ¿Quieres agregar este producto? Ve a <strong>Productos → Nuevo</strong> y completa el campo "Código de barras".
          </p>
          <button onClick={reset} className="w-full py-3 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#163829]">
            Escanear otro
          </button>
        </div>
      )}

      {/* Panel ERROR */}
      {state === STATES.ERROR && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <p className="font-bold text-gray-900">Error</p>
          <p className="text-gray-500 text-sm">{feedback}</p>
          <button onClick={reset} className="w-full py-3 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#163829]">
            Reintentar
          </button>
        </div>
      )}

      {/* Panel SUCCESS */}
      {state === STATES.SUCCESS && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-3">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <p className="font-bold text-gray-900 text-lg">{feedback}</p>
          <p className="text-gray-400 text-sm">Volviendo al escáner...</p>
        </div>
      )}

      {/* Panel PRODUCTO ENCONTRADO */}
      {state === STATES.FOUND && producto && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cabecera del producto */}
          <div className="bg-[#1B4332] px-5 py-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base truncate">{producto.nombre}</p>
              <p className="text-green-200 text-xs">{producto.categoria?.nombre ?? '—'}</p>
            </div>
            <button onClick={reset} className="p-1.5 rounded-lg text-green-200 hover:bg-white/20">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stock por almacén */}
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Stock actual</p>
            {stockInfo.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin stock registrado</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stockInfo.map((s, i) => (
                  <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    s.cantidad === 0 ? 'bg-red-100 text-red-700' :
                    s.cantidad <= (producto.stock_minimo ?? 0) ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {s.almacen}: {s.cantidad} {producto.unidad_medida ?? 'unid.'}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Formulario de movimiento */}
          <div className="px-5 py-4 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase">Registrar movimiento</p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Almacén *</label>
              <select
                value={form.id_almacen}
                onChange={e => setForm(p => ({ ...p, id_almacen: e.target.value }))}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white"
              >
                <option value="">Seleccionar almacén...</option>
                {almacenes.map(a => (
                  <option key={a.id_almacen} value={a.id_almacen}>
                    {a.nombre}
                    {stockInfo.find(s => s.id_almacen === a.id_almacen)
                      ? ` (Stock: ${stockInfo.find(s => s.id_almacen === a.id_almacen).cantidad})`
                      : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cantidad *</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, cantidad: Math.max(1, p.cantidad - 1) }))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-bold text-gray-700 flex items-center justify-center transition-colors"
                >−</button>
                <input
                  type="number" min="1"
                  value={form.cantidad}
                  onChange={e => setForm(p => ({ ...p, cantidad: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="flex-1 text-center text-2xl font-extrabold py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                />
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, cantidad: p.cantidad + 1 }))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-bold text-gray-700 flex items-center justify-center transition-colors"
                >+</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleRegistrar('ENTRADA')}
                className="flex items-center justify-center gap-2 py-4 bg-[#1B4332] text-white font-bold text-sm rounded-xl hover:bg-[#163829] transition-colors shadow-md"
              >
                <ArrowDownCircle className="w-5 h-5" /> Entrada
              </button>
              <button
                onClick={() => handleRegistrar('SALIDA')}
                className="flex items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-md"
              >
                <ArrowUpCircle className="w-5 h-5" /> Salida
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel REGISTRANDO */}
      {state === STATES.REGISTERING && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 font-medium mt-4">Registrando movimiento...</p>
        </div>
      )}

      {/* Información de ayuda */}
      {state === STATES.IDLE && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <p className="text-amber-800 text-sm font-semibold mb-2">💡 Consejos de uso</p>
          <ul className="text-amber-700 text-xs space-y-1">
            <li>• Usa la cámara trasera del celular para mejor lectura</li>
            <li>• Soporta: QR, EAN-13, CODE-128, UPC-A, CODE-39</li>
            <li>• Asegúrate de que los productos tengan código de barras en <strong>Productos → Editar</strong></li>
            <li>• Si no tienes cámara, usa el botón "Ingresar código manualmente"</li>
          </ul>
        </div>
      )}
    </div>
  )
}
