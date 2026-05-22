// Frontend API utility
// Calls our own Vercel serverless function — never touches Mistral directly
// Your API key stays safe on the server

/**
 * Convert a File/Blob to base64 data URL
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Analyse via photo — sends image to our serverless function
 */
export async function analyseFromImage(imageBase64, userProfile) {
  const res = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, userProfile }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Server error: ${res.status}`)
  }

  return data
}

/**
 * Analyse via manual text — user typed/pasted the ingredients
 */
export async function analyseFromText(manualText, userProfile) {
  if (!manualText?.trim()) {
    throw new Error('Please enter some ingredients first.')
  }

  const res = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ manualText, userProfile }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Server error: ${res.status}`)
  }

  return data
}
