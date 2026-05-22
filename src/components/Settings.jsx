import React, { useState } from 'react'
import { X, Plus, CheckCircle2 } from 'lucide-react'

const SKIN_TYPES = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive']

const COMMON_ALLERGENS = [
  'Fragrance', 'Parabens', 'Sulfates (SLS/SLES)', 'Alcohol', 'Silicones',
  'Coconut oil', 'Essential oils', 'Retinol', 'Niacinamide', 'Vitamin C',
  'AHA/BHA', 'Lanolin', 'Formaldehyde', 'Mineral oil', 'Phenoxyethanol',
]

export default function Settings({ profile, onSave }) {
  const [localProfile, setLocalProfile] = useState(profile)
  const [customAllergen, setCustomAllergen] = useState('')
  const [saved, setSaved] = useState(false)

  const toggleAllergen = (allergen) => {
    setLocalProfile(prev => {
      const list = prev.allergies || []
      return {
        ...prev,
        allergies: list.includes(allergen)
          ? list.filter(a => a !== allergen)
          : [...list, allergen],
      }
    })
  }

  const addCustom = () => {
    const trimmed = customAllergen.trim()
    if (!trimmed) return
    setLocalProfile(prev => ({
      ...prev,
      allergies: [...(prev.allergies || []), trimmed],
    }))
    setCustomAllergen('')
  }

  const removeAllergen = (allergen) => {
    setLocalProfile(prev => ({
      ...prev,
      allergies: (prev.allergies || []).filter(a => a !== allergen),
    }))
  }

  const handleSave = () => {
    onSave(localProfile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-up pb-12">
      {/* Skin type */}
      <div className="card p-5">
        <h2 className="font-body font-semibold text-ink-900 mb-1">Your Skin Type</h2>
        <p className="font-body text-xs text-ink-400 mb-3">Used to personalise ingredient recommendations.</p>
        <div className="flex flex-wrap gap-2">
          {SKIN_TYPES.map(type => (
            <button
              key={type}
              onClick={() =>
                setLocalProfile(prev => ({
                  ...prev,
                  skinType: prev.skinType === type ? null : type,
                }))
              }
              className={`px-4 py-2 rounded-full font-body text-sm font-medium border transition-all ${
                localProfile.skinType === type
                  ? 'bg-ink-900 text-white border-ink-900'
                  : 'bg-white text-ink-700 border-cream-200 hover:border-ink-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Allergies / sensitivities */}
      <div className="card p-5">
        <h2 className="font-body font-semibold text-ink-900 mb-1">Sensitivities & Allergies</h2>
        <p className="font-body text-xs text-ink-400 mb-4">
          These will be flagged in red in every analysis.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {COMMON_ALLERGENS.map(allergen => {
            const active = (localProfile.allergies || []).includes(allergen)
            return (
              <button
                key={allergen}
                onClick={() => toggleAllergen(allergen)}
                className={`px-3 py-1.5 rounded-full font-body text-xs font-medium border transition-all ${
                  active
                    ? 'bg-blush-500 text-white border-blush-500'
                    : 'bg-white text-ink-600 border-cream-200 hover:border-blush-300'
                }`}
              >
                {active ? '✓ ' : ''}{allergen}
              </button>
            )
          })}
        </div>

        {/* Custom allergen input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customAllergen}
            onChange={e => setCustomAllergen(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder="Add custom ingredient…"
            className="flex-1 font-body text-sm bg-cream-50 border border-cream-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900 transition-all"
          />
          <button onClick={addCustom} className="btn-primary px-4 py-2.5 text-sm">
            <Plus size={16} />
          </button>
        </div>

        {/* Custom allergens not in the common list */}
        {(localProfile.allergies || []).filter(a => !COMMON_ALLERGENS.includes(a)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {(localProfile.allergies || [])
              .filter(a => !COMMON_ALLERGENS.includes(a))
              .map(allergen => (
                <span
                  key={allergen}
                  className="flex items-center gap-1.5 bg-blush-500 text-white px-3 py-1.5 rounded-full font-body text-xs font-medium"
                >
                  {allergen}
                  <button onClick={() => removeAllergen(allergen)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full py-3.5 rounded-full font-body font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          saved ? 'bg-sage-500 text-white' : 'bg-ink-900 text-white hover:bg-ink-800'
        }`}
      >
        {saved ? <><CheckCircle2 size={16} /> Saved!</> : 'Save Profile'}
      </button>
    </div>
  )
}
