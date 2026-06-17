import { useEffect, useRef, useState, useCallback } from 'react'
import { 
  BrowserMultiFormatReader, 
  HTMLCanvasElementLuminanceSource, 
  HybridBinarizer, 
  BinaryBitmap 
} from '@zxing/library'
import {
  buscarProductoPorCodigo, getAlmacenes, registrarEntrada, registrarSalida,
} from '../services/api'
import Spinner from '../components/Spinner'
import {
  Camera, CameraOff, Scan, Package, ArrowDownCircle,
  ArrowUpCircle, CheckCircle, AlertTriangle, RotateCcw,
  Keyboard, X, Sun, Moon
} from 'lucide-react'

const normalizarCodigoEscaneo = (codigo) =>
  codigo.trim().replace(/[\s-]/g, '')

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
  const [isDark, setIsDark]       = useState(true)

  const codeReaderRef = useRef(new BrowserMultiFormatReader())
  const scannerRef = useRef(null)
  const domId      = 'video-preview'

  // Cargar almacenes
  useEffect(() => {
    getAlmacenes().then(setAlmacenes).catch(() => {})
  }, [])

  // Buscar cámaras disponibles usando ZXing
  useEffect(() => {
    codeReaderRef.current.listVideoInputDevices()
      .then(cams => {
        setCameras(cams)
        if (cams.length > 0) {
          const backCam = cams.find(c => 
            c.label.toLowerCase().includes('back') || 
            c.label.toLowerCase().includes('environment') || 
            c.label.toLowerCase().includes('trasera') || 
            c.label.toLowerCase().includes('posterior')
          )
          setCameraId(backCam ? backCam.deviceId : cams[0].deviceId)
        }
      })
      .catch(() => {})
  }, [])

  const buscarProducto = useCallback(async (codigo) => {
    if (!codigo || codigo === lastCode) return
    setLastCode(codigo)
    try {
      const res = await buscarProductoPorCodigo(codigo)
      setProducto(res.producto)
      setStockInfo(res.stock_por_almacen ?? [])
      const conStock = res.stock_por_almacen?.find(s => s.cantidad > 0)
      setForm({ id_almacen: conStock?.id_almacen ?? '', cantidad: 1 })
      setState(STATES.FOUND)
    } catch (err) {
      if (err?.message?.includes('no encontrado') || err?.status === 404) {
        setState(STATES.NOTFOUND)
        setFeedback(`Código "${codigo}" no registrado`)
      } else {
        setState(STATES.ERROR)
        setFeedback(err?.message || 'Error de conexión')
      }
    }
  }, [lastCode])

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

  const startScanner = useCallback(async () => {
    setState(STATES.SCANNING)
    setFeedback('')

    try {
      const constraints = {
        video: cameraId ? { deviceId: { exact: cameraId } } : { facingMode: 'environment' }
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      const video = document.getElementById(domId)
      if (!video) return
      
      video.srcObject = stream
      video.setAttribute('playsinline', 'true')
      await video.play()
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      
      let scanning = true
      // Guardamos la función stop en un ref para poder detenerlo desde fuera
      scannerRef.current = {
        stop: () => {
          scanning = false
          stream.getTracks().forEach(t => t.stop())
          video.srcObject = null
        }
      }

      const decodeCanvas = (canvasElement) => {
        const luminanceSource = new HTMLCanvasElementLuminanceSource(canvasElement)
        const hybridBinarizer = new HybridBinarizer(luminanceSource)
        const binaryBitmap = new BinaryBitmap(hybridBinarizer)
        return codeReaderRef.current.decodeBitmap(binaryBitmap)
      }

      const scanFrame = () => {
        if (!scanning) return
        
        if (video.videoWidth > 0) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          
          // 1. Intentar escanear el frame NORMAL
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          try {
            const result = decodeCanvas(canvas)
            if (result && result.getText()) {
              playBeep()
              scannerRef.current.stop()
              buscarProducto(normalizarCodigoEscaneo(result.getText()))
              return
            }
          } catch (e) {}
          
          // 2. Intentar escanear el frame ESPEJADO (Volteado horizontalmente)
          ctx.save()
          ctx.scale(-1, 1)
          ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
          ctx.restore()

          try {
            const resultMirrored = decodeCanvas(canvas)
            if (resultMirrored && resultMirrored.getText()) {
              playBeep()
              scannerRef.current.stop()
              buscarProducto(normalizarCodigoEscaneo(resultMirrored.getText()))
              return
            }
          } catch (e) {}
        }
        
        // Repetir el ciclo lo más rápido posible
        requestAnimationFrame(scanFrame)
      }
      
      scanFrame()
      
    } catch (err) {
      console.error("Scanner Error:", err)
      setState(STATES.ERROR)
      setFeedback('Error al iniciar la cámara. Verifica los permisos.')
    }
  }, [cameraId, buscarProducto])

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current = null
    }
    setState(STATES.IDLE)
    setLastCode('')
  }, [])

  const switchCamera = useCallback(() => {
    stopScanner()
    const next = cameras.find(c => c.deviceId !== cameraId)
    setCameraId(next?.deviceId ?? null)
    setTimeout(() => startScanner(), 300)
  }, [cameras, cameraId, stopScanner, startScanner])

  useEffect(() => {
    return () => {
      codeReaderRef.current.reset()
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
      buscarProducto(normalizarCodigoEscaneo(manualCode))
      setManualCode('')
    }
  }



  // ── Render ────────────────────────────────────────────────────────────────
  const isScanning = state === STATES.SCANNING || state === STATES.FOUND ||
                     state === STATES.NOTFOUND  || state === STATES.REGISTERING ||
                     state === STATES.SUCCESS    || state === STATES.ERROR

  return (
    <div className={`absolute inset-0 ${isDark ? 'dark' : ''} bg-gray-50 dark:bg-gray-950 p-6 overflow-y-auto transition-colors duration-300`}>
      <div className="max-w-lg mx-auto space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">Escáner</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 transition-colors duration-300">QR, EAN-13, CODE128 y más</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
                title="Alternar tema"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {isScanning && (
                <button
                  onClick={stopScanner}
                  className="inline-flex items-center gap-2 px-3 py-2 border-2 border-red-500/30 text-red-500 dark:text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  <CameraOff className="w-4 h-4" /> Detener
                </button>
              )}
            </div>
          </div>

          {/* Visor de cámara */}
          <div
            className={`relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ${isScanning ? 'block' : 'hidden'}`}
            style={{ minHeight: 240 }}
          >
            <video id={domId} className="w-full h-full object-cover" />

            {/* Overlay de mira */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-64 h-40 border-2 border-[#F59E0B]/50 rounded-xl">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#F59E0B] rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#F59E0B] rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#F59E0B] rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#F59E0B] rounded-br-xl" />
              </div>
            </div>

            {/* Indicador scanning */}
            {state === STATES.SCANNING && (
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                <p className="text-white text-xs font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Apunta al código
                </p>
              </div>
            )}
          </div>

          {/* Botones debajo de la cámara (cuando está activa) */}
          {isScanning && (
            <div className="flex gap-3">
              <button
                onClick={switchCamera}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <RotateCcw className="w-5 h-5" /> Cambiar cámara
              </button>
              <button
                onClick={() => { stopScanner(); setShowManual(true) }}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <Keyboard className="w-5 h-5" /> Manual
              </button>
            </div>
          )}

          {/* Panel IDLE - botón inicial */}
          {state === STATES.IDLE && !showManual && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 text-center space-y-5 transition-colors duration-300">
              <div className="w-20 h-20 bg-[#F59E0B]/10 rounded-2xl flex items-center justify-center mx-auto">
                <Scan className="w-10 h-10 text-[#F59E0B]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg transition-colors duration-300">Escáner de productos</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">
                  Activa la cámara para escanear códigos QR o de barras y registrar movimientos sin teclado
                </p>
              </div>
              <button
                onClick={startScanner}
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#F59E0B] text-gray-900 font-bold text-base rounded-2xl hover:bg-[#d98b09] transition-colors shadow-md"
              >
                <Camera className="w-5 h-5" /> Activar cámara
              </button>
              <button
                onClick={() => setShowManual(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                <Keyboard className="w-4 h-4" /> Ingresar código manualmente
              </button>
            </div>
          )}

          {/* Entrada manual */}
          {showManual && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Ingreso Manual</h3>
                <button onClick={() => setShowManual(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <input
                  type="text"
                  autoFocus
                  placeholder="Ej: 7771609001448"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] transition-colors duration-300"
                />
                <button type="submit" className="w-full py-3 bg-[#F59E0B] text-gray-900 font-bold rounded-xl hover:bg-[#D97706] transition-colors">
                  Buscar Código
                </button>
              </form>
            </div>
          )}

          {/* Panel NO ENCONTRADO */}
          {state === STATES.NOTFOUND && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 text-center space-y-4 transition-colors duration-300">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <Package className="w-7 h-7 text-orange-500" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Producto no encontrado</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm break-all transition-colors duration-300">{feedback}</p>
              <button onClick={reset} className="w-full py-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300">
                Escanear otro
              </button>
            </div>
          )}

          {/* Panel ERROR */}
          {state === STATES.ERROR && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 text-center space-y-4 transition-colors duration-300">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Error</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">{feedback}</p>
              <button onClick={reset} className="w-full py-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300">
                Reintentar
              </button>
            </div>
          )}

          {/* Panel SUCCESS */}
          {state === STATES.SUCCESS && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 text-center space-y-3 transition-colors duration-300">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg transition-colors duration-300">{feedback}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">Volviendo al escáner...</p>
            </div>
          )}

          {/* Panel PRODUCTO ENCONTRADO */}
          {state === STATES.FOUND && producto && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              {/* Cabecera del producto */}
              <div className="bg-[#F59E0B] px-5 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-bold text-base truncate">{producto.nombre}</p>
                  <p className="text-orange-900 text-xs font-medium">{producto.categoria?.nombre ?? '—'}</p>
                </div>
                <button onClick={reset} className="p-1.5 rounded-lg text-orange-900 hover:bg-black/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stock por almacén */}
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Stock actual</p>
                {stockInfo.length === 0 ? (
                  <p className="text-gray-500 text-sm">Sin stock registrado</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {stockInfo.map((s, i) => (
                      <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        s.cantidad === 0 ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                        s.cantidad <= (producto.stock_minimo ?? 0) ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' :
                        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                      }`}>
                        {s.almacen}: {s.cantidad} {producto.unidad_medida ?? 'unid.'}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulario de movimiento */}
              <div className="px-5 py-4 space-y-4 bg-white dark:bg-gray-900 transition-colors duration-300">
                <p className="text-xs font-bold text-gray-500 uppercase">Registrar movimiento</p>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Almacén *</label>
                  <select
                    value={form.id_almacen}
                    onChange={e => setForm(p => ({ ...p, id_almacen: e.target.value }))}
                    className="w-full px-3 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-[#F59E0B] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
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
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Cantidad *</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, cantidad: Math.max(1, p.cantidad - 1) }))}
                      className="w-12 h-12 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-xl text-xl font-bold text-gray-900 dark:text-gray-300 flex items-center justify-center transition-colors duration-300"
                    >−</button>
                    <input
                      type="number" min="1"
                      value={form.cantidad}
                      onChange={e => setForm(p => ({ ...p, cantidad: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="flex-1 text-center text-2xl font-extrabold py-2.5 border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#F59E0B] transition-colors duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, cantidad: p.cantidad + 1 }))}
                      className="w-12 h-12 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-xl text-xl font-bold text-gray-900 dark:text-gray-300 flex items-center justify-center transition-colors duration-300"
                    >+</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleRegistrar('ENTRADA')}
                    className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
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
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 text-center transition-colors duration-300">
              <Spinner size="lg" />
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-4 transition-colors duration-300">Registrando movimiento...</p>
            </div>
          )}

          {/* Información de ayuda */}
          {state === STATES.IDLE && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 transition-colors duration-300">
              <p className="text-orange-500 dark:text-orange-400 text-sm font-semibold mb-2">💡 Consejos de uso</p>
              <ul className="text-gray-500 dark:text-gray-400 text-xs space-y-1">
                <li>• Usa la cámara trasera del celular para mejor lectura</li>
                <li>• Soporta: QR, EAN-13, CODE-128, UPC-A, CODE-39</li>
                <li>• Asegúrate de que los productos tengan código de barras en <strong className="text-gray-800 dark:text-gray-300">Productos → Editar</strong></li>
                <li>• Si no tienes cámara, usa el botón "Ingresar código manualmente"</li>
              </ul>
            </div>
          )}

      </div>
    </div>
  )
}

