// Vercel serverless function
// Your Mistral API key lives here on the server — never exposed to the browser

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' })
  }

  const { imageBase64, userProfile, manualText } = req.body

  // Build the prompt depending on input type
  const allergyContext = userProfile?.allergies?.length
    ? `The user has flagged these personal sensitivities/allergies: ${userProfile.allergies.join(', ')}.`
    : 'The user has not specified any personal allergies.'

  const skinContext = userProfile?.skinType
    ? `The user's skin type is: ${userProfile.skinType}.`
    : ''

  const analysisInstructions = `
${allergyContext}
${skinContext}

For each ingredient provide:
- name: the ingredient name exactly as written
- rating: one of "clean", "caution", "avoid", or "unknown"
- reason: a short 1-sentence plain English explanation
- personal_flag: true if it matches the user's listed allergies/sensitivities, false otherwise

Also provide:
- overall_rating: one of "clean", "mostly_clean", "mixed", "mostly_avoid", "avoid"
- overall_summary: 2-3 sentence plain English verdict on whether this product is safe/clean

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "raw_text": "the full ingredients text you found or were given",
  "product_name": "product name if visible or null",
  "overall_rating": "clean|mostly_clean|mixed|mostly_avoid|avoid",
  "overall_summary": "...",
  "ingredients": [
    {
      "name": "Ingredient Name",
      "rating": "clean|caution|avoid|unknown",
      "reason": "...",
      "personal_flag": false
    }
  ]
}`

  // Build the message content — image or manual text
  let messageContent

  if (manualText) {
    // User typed/pasted the ingredients manually
    messageContent = [
      {
        type: 'text',
        text: `You are a skincare ingredient expert. The user has provided this ingredients list as text:

"${manualText}"

Parse every individual ingredient from this text and analyse them.
${analysisInstructions}`,
      },
    ]
  } else if (imageBase64) {
    // Photo provided — use vision model
    messageContent = [
      {
        type: 'image_url',
        image_url: { url: imageBase64 },
      },
      {
        type: 'text',
        text: `You are a skincare ingredient expert analysing a photo of a product label.

STEP 1 — FIND THE INGREDIENTS:
Look carefully at the entire image. Find the section that starts with "Ingredients:", "INCI:", "Composition:", or similar. This section lists many chemical/botanical names separated by commas. IGNORE everything else — brand name, directions, marketing text, warnings, net weight.

STEP 2 — EXTRACT:
Extract ONLY the ingredient names from that section. If the text is small, curved, or partially cut off, extract as much as you can read.

STEP 3 — ANALYSE:
${analysisInstructions}

If you cannot find any ingredients list at all in the image, return:
{ "error": "no_ingredients_found", "message": "Could not find an ingredients list in this image. Try a closer or clearer photo, or use the manual text option." }`,
      },
    ]
  } else {
    return res.status(400).json({ error: 'No image or text provided.' })
  }

  try {
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: manualText ? 'mistral-small-latest' : 'pixtral-12b-2409',
        max_tokens: 2500,
        messages: [{ role: 'user', content: messageContent }],
      }),
    })

    if (!mistralRes.ok) {
      const err = await mistralRes.json().catch(() => ({}))
      return res.status(mistralRes.status).json({
        error: err?.message || `Mistral API error: ${mistralRes.status}`,
      })
    }

    const data = await mistralRes.json()
    const text = data.choices?.[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(clean)
    } catch {
      return res.status(422).json({
        error: 'Could not parse ingredient data. Try a clearer photo or use manual text input.',
      })
    }

    // If model returned a structured error (e.g. no ingredients found)
    if (parsed.error) {
      return res.status(422).json({ error: parsed.message || parsed.error })
    }

    return res.status(200).json(parsed)
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error.' })
  }
}
