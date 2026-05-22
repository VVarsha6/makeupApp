import React, { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, ShieldAlert, HelpCircle, AlertCircle } from 'lucide-react'

const RATING_CONFIG = {
  clean: {
    label: 'Clean',
    labelClass: 'label-clean',
    icon: ShieldCheck,
    iconClass: 'text-sage-500',
    dot: 'bg-sage-500',
  },
  caution: {
    label: 'Caution',
    labelClass: 'label-caution',
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    dot: 'bg-amber-400',
  },
  avoid: {
    label: 'Avoid',
    labelClass: 'label-avoid',
    icon: ShieldAlert,
    iconClass: 'text-blush-500',
    dot: 'bg-blush-500',
  },
  unknown: {
    label: 'Unknown',
    labelClass: 'label-unknown',
    icon: HelpCircle,
    iconClass: 'text-ink-300',
    dot: 'bg-ink-300',
  },
}

const OVERALL_CONFIG = {
  clean: { bg: 'bg-sage-500', text: 'text-white', label: 'Clean' },
  mostly_clean: { bg: 'bg-sage-400', text: 'text-white', label: 'Mostly Clean' },
  mixed: { bg: 'bg-amber-400', text: 'text-amber-900', label: 'Mixed' },
  mostly_avoid: { bg: 'bg-blush-300', text: 'text-blush-500', label: 'Use with Caution' },
  avoid: { bg: 'bg-blush-500', text: 'text-white', label: 'Avoid' },
}

function IngredientRow({ ingredient, index }) {
  const [expanded, setExpanded] = useState(false)
  const config = RATING_CONFIG[ingredient.rating] || RATING_CONFIG.unknown
  const Icon = config.icon

  return (
    <div
      className="ingredient-row cursor-pointer hover:bg-cream-50 -mx-4 px-4 rounded-lg transition-colors"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Dot */}
      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${config.dot}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-medium text-ink-900 truncate">
              {ingredient.name}
            </span>
            {ingredient.personal_flag && (
              <span className="flex items-center gap-1 bg-blush-300/40 text-blush-500 text-xs font-body font-medium px-2 py-0.5 rounded-full">
                <AlertCircle size={10} />
                Your allergy
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={config.labelClass}>{config.label}</span>
            {expanded ? <ChevronUp size={14} className="text-ink-400" /> : <ChevronDown size={14} className="text-ink-400" />}
          </div>
        </div>

        {expanded && (
          <p className="font-body text-sm text-ink-500 mt-1.5 animate-fade-in leading-relaxed">
            {ingredient.reason}
          </p>
        )}
      </div>
    </div>
  )
}

export default function Results({ result }) {
  const [showRaw, setShowRaw] = useState(false)
  const overall = OVERALL_CONFIG[result.overall_rating] || OVERALL_CONFIG.mixed

  const flagged = result.ingredients.filter(i => i.personal_flag)
  const avoid = result.ingredients.filter(i => i.rating === 'avoid' && !i.personal_flag)
  const caution = result.ingredients.filter(i => i.rating === 'caution' && !i.personal_flag)
  const clean = result.ingredients.filter(i => i.rating === 'clean')

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Overall verdict */}
      <div className={`rounded-2xl p-5 ${overall.bg}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            {result.product_name && (
              <p className={`font-body text-sm font-medium opacity-80 mb-1 ${overall.text}`}>
                {result.product_name}
              </p>
            )}
            <h2 className={`font-display text-2xl font-semibold ${overall.text}`}>
              {overall.label}
            </h2>
            <p className={`font-body text-sm mt-2 leading-relaxed opacity-90 ${overall.text}`}>
              {result.overall_summary}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          {[
            { count: clean.length, label: 'Clean', color: 'bg-white/20' },
            { count: caution.length, label: 'Caution', color: 'bg-white/20' },
            { count: avoid.length, label: 'Avoid', color: 'bg-white/20' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl px-3 py-2 flex-1 text-center`}>
              <p className={`font-display text-xl font-semibold ${overall.text}`}>{s.count}</p>
              <p className={`font-body text-xs opacity-80 ${overall.text}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personal allergy flags */}
      {flagged.length > 0 && (
        <div className="card p-4 border-blush-300">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-blush-500" />
            <h3 className="font-body font-semibold text-blush-500 text-sm">
              {flagged.length} ingredient{flagged.length > 1 ? 's' : ''} match your sensitivities
            </h3>
          </div>
          {flagged.map((ing, i) => (
            <IngredientRow key={ing.name} ingredient={ing} index={i} />
          ))}
        </div>
      )}

      {/* Medical disclaimer */}
      <div className="bg-cream-100 rounded-xl px-4 py-3 flex gap-2.5">
        <AlertTriangle size={14} className="text-ink-400 flex-shrink-0 mt-0.5" />
        <p className="font-body text-xs text-ink-500 leading-relaxed">
          <strong className="text-ink-700">Not medical advice.</strong> SkinLens provides general ingredient information only. Always consult a dermatologist or allergist for personal medical guidance.
        </p>
      </div>

      {/* Full ingredient list */}
      <div className="card p-4">
        <h3 className="font-body font-semibold text-ink-900 text-sm mb-1">
          All Ingredients ({result.ingredients.length})
        </h3>
        <p className="font-body text-xs text-ink-400 mb-3">Tap any ingredient for details</p>
        <div>
          {result.ingredients.map((ing, i) => (
            <IngredientRow key={`${ing.name}-${i}`} ingredient={ing} index={i} />
          ))}
        </div>
      </div>

      {/* Raw extracted text toggle */}
      {result.raw_text && (
        <div className="card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-cream-50 transition-colors"
            onClick={() => setShowRaw(!showRaw)}
          >
            <span className="font-body text-sm font-medium text-ink-700">Raw extracted text</span>
            {showRaw ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}
          </button>
          {showRaw && (
            <div className="px-4 pb-4 animate-fade-in">
              <pre className="font-mono text-xs text-ink-500 whitespace-pre-wrap leading-relaxed bg-cream-50 rounded-lg p-3">
                {result.raw_text}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
