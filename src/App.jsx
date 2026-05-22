import React, { useState } from 'react'
import Header from './components/Header.jsx'
import ImageCapture from './components/ImageCapture.jsx'
import Results from './components/Results.jsx'
import Settings from './components/Settings.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { analyseFromImage, analyseFromText, fileToBase64 } from './utils/mistral.js'
import { Scan, AlertCircle, RotateCcw } from 'lucide-react'

const DEFAULT_PROFILE = {
  skinType: null,
  allergies: [],
}

export default function App() {
  const [page, setPage] = useState('home')
  const [profile, setProfile] = useLocalStorage('skinlens_profile', DEFAULT_PROFILE)

  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  // Raw text extracted from last photo scan — passed back to ImageCapture for editing
  const [extractedText, setExtractedText] = useState(null)

  const handleSaveSettings = (newProfile) => {
    setProfile(newProfile)
  }

  // Called when user picks/takes a photo
  const handleImageSelected = (file) => {
    setSelectedFile(file)
    setResult(null)
    setError(null)
    setExtractedText(null)
  }

  // Called when user clicks "Analyse Ingredients" after choosing a photo
  const handleAnalysePhoto = async () => {
    if (!selectedFile) return
    setIsAnalysing(true)
    setError(null)
    setResult(null)

    try {
      const base64 = await fileToBase64(selectedFile)
      const data = await analyseFromImage(base64, profile)
      setExtractedText(data.raw_text || '')
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsAnalysing(false)
    }
  }

  // Called from either manual tab or the edit fallback after a bad photo scan
  const handleAnalyseText = async (text) => {
    if (!text) return
    setIsAnalysing(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyseFromText(text, profile)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsAnalysing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setResult(null)
    setError(null)
    setExtractedText(null)
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header
        onSettingsClick={() => setPage(p => p === 'settings' ? 'home' : 'settings')}
        currentPage={page}
      />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {page === 'settings' ? (
          <Settings
            profile={profile}
            onSave={handleSaveSettings}
          />
        ) : (
          <div className="space-y-5">
            {/* Hero — only before result */}
            {!result && (
              <div className="pt-2 pb-1 animate-fade-up">
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 leading-tight">
                  Know what's in<br />
                  <span className="italic text-sage-600">your skincare.</span>
                </h1>
                <p className="font-body text-ink-500 mt-2 text-sm leading-relaxed">
                  Scan any ingredient label. Get instant, personalised analysis.
                </p>
              </div>
            )}

            {/* Image + manual input */}
            {!result && (
              <ImageCapture
                onImageSelected={handleImageSelected}
                onManualText={handleAnalyseText}
                isAnalysing={isAnalysing}
                extractedText={extractedText}
              />
            )}

            {/* Analyse photo button — only shows when photo is picked */}
            {selectedFile && !result && !isAnalysing && (
              <button
                onClick={handleAnalysePhoto}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 animate-fade-up"
              >
                <Scan size={18} />
                Analyse Ingredients
              </button>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-blush-300/20 border border-blush-300 rounded-xl p-4 animate-fade-in">
                <AlertCircle size={16} className="text-blush-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm font-semibold text-blush-500">Analysis failed</p>
                  <p className="font-body text-xs text-ink-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Results */}
            {result && (
              <>
                <Results result={result} />
                <button
                  onClick={handleReset}
                  className="btn-ghost w-full py-3 flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw size={15} />
                  Scan another product
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
