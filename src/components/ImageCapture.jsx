import React, { useRef, useState } from 'react'
import { Camera, Image, X, Type, ChevronDown, ChevronUp } from 'lucide-react'

export default function ImageCapture({ onImageSelected, onManualText, isAnalysing, extractedText }) {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const [tab, setTab] = useState('photo') // 'photo' | 'manual'
  const [preview, setPreview] = useState(null)
  const [manualInput, setManualInput] = useState('')
  const [showEditFallback, setShowEditFallback] = useState(false)
  const [editText, setEditText] = useState('')

  // When parent provides extracted text (from a photo scan), pre-fill the edit box
  React.useEffect(() => {
    if (extractedText) {
      setEditText(extractedText)
      setShowEditFallback(false)
    }
  }, [extractedText])

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onImageSelected(file)
  }

  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    setShowEditFallback(false)
    setEditText('')
    onImageSelected(null)
  }

  const handleManualSubmit = () => {
    const text = tab === 'manual' ? manualInput : editText
    onManualText(text.trim())
  }

  const handleEditReanalyse = () => {
    onManualText(editText.trim())
  }

  return (
    <div className="w-full space-y-3">
      {/* Tabs */}
      <div className="flex bg-cream-100 rounded-full p-1 gap-1">
        <button
          onClick={() => setTab('photo')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-body text-sm font-medium transition-all ${
            tab === 'photo'
              ? 'bg-white text-ink-900 shadow-sm'
              : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <Camera size={14} />
          Photo
        </button>
        <button
          onClick={() => setTab('manual')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-body text-sm font-medium transition-all ${
            tab === 'manual'
              ? 'bg-white text-ink-900 shadow-sm'
              : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <Type size={14} />
          Type manually
        </button>
      </div>

      {/* Photo tab */}
      {tab === 'photo' && (
        <>
          {preview ? (
            <div className="relative rounded-2xl overflow-hidden border border-cream-200 shadow-sm">
              <img
                src={preview}
                alt="Ingredient label"
                className="w-full object-contain max-h-72 bg-cream-100"
              />
              {!isAnalysing && (
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow hover:bg-white transition-all"
                >
                  <X size={16} className="text-ink-700" />
                </button>
              )}
              {isAnalysing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink-900 border-t-transparent rounded-full animate-spin-slow" />
                  <p className="font-body text-sm font-medium text-ink-800 animate-pulse-soft">
                    Reading ingredients…
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-cream-300 hover:border-ink-900 hover:bg-cream-50 transition-all duration-200 aspect-square sm:aspect-auto sm:py-10"
              >
                <div className="w-12 h-12 bg-ink-900 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera size={22} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="font-body font-semibold text-ink-900 text-sm">Take Photo</p>
                  <p className="font-body text-ink-400 text-xs mt-0.5">Point at the label</p>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-cream-300 hover:border-sage-500 hover:bg-sage-500/5 transition-all duration-200 aspect-square sm:aspect-auto sm:py-10"
              >
                <div className="w-12 h-12 bg-sage-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Image size={22} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="font-body font-semibold text-ink-900 text-sm">Upload Photo</p>
                  <p className="font-body text-ink-400 text-xs mt-0.5">From your library</p>
                </div>
              </button>
            </div>
          )}

          {/* Edit/fallback section — shown after a scan attempt */}
          {preview && !isAnalysing && (
            <div className="border border-cream-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowEditFallback(!showEditFallback)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-cream-50 transition-colors"
              >
                <span className="font-body text-sm text-ink-500">
                  Ingredients not detected properly? Edit manually
                </span>
                {showEditFallback
                  ? <ChevronUp size={15} className="text-ink-400" />
                  : <ChevronDown size={15} className="text-ink-400" />
                }
              </button>

              {showEditFallback && (
                <div className="px-4 pb-4 space-y-3 animate-fade-in">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    placeholder="Paste or type the ingredients here, e.g: Water, Glycerin, Niacinamide, ..."
                    rows={5}
                    className="w-full font-mono text-xs bg-cream-50 border border-cream-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900 transition-all resize-none leading-relaxed"
                  />
                  <button
                    onClick={handleEditReanalyse}
                    disabled={!editText.trim()}
                    className="btn-sage w-full py-2.5 text-sm"
                  >
                    Re-analyse with this text
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Manual text tab */}
      {tab === 'manual' && (
        <div className="space-y-3 animate-fade-in">
          <p className="font-body text-xs text-ink-400 leading-relaxed">
            Copy the ingredients list from the product or its website and paste it below.
          </p>
          <textarea
            value={manualInput}
            onChange={e => setManualInput(e.target.value)}
            placeholder="e.g: Water, Glycerin, Niacinamide, Hyaluronic Acid, Fragrance, ..."
            rows={6}
            className="w-full font-mono text-xs bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900 transition-all resize-none leading-relaxed"
          />
          <button
            onClick={handleManualSubmit}
            disabled={!manualInput.trim() || isAnalysing}
            className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
          >
            {isAnalysing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin-slow" />
                Analysing…
              </>
            ) : (
              'Analyse Ingredients'
            )}
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
